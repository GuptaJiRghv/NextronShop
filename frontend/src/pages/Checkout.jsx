import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { 
  ShieldCheck, CreditCard, QrCode, Banknote, 
  CheckCircle2, ArrowRight, ArrowLeft, RefreshCw, 
  Smartphone, Lock, MapPin, Package, ExternalLink,
  Truck, Calendar, Copy, Check, Printer, ShoppingBag, 
  Clock, Wifi, HelpCircle
} from 'lucide-react';

const Checkout = () => {
  const { cart, cartTotal, placeOrder, user } = useStore();
  const navigate = useNavigate();

  // Steps: 1 = Shipping, 2 = Payment Gateway, 3 = Confirmation / Receipt
  const [step, setStep] = useState(1);

  // Customer Shipping Details
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: 'Sector 7, Neo-Avenue 42',
    city: 'San Francisco',
    postalCode: '94103',
    phone: '+1 (555) 019-2831',
    country: 'United States'
  });

  // Selected Payment Method: 'qr' | 'card' | 'cod'
  const [paymentMethod, setPaymentMethod] = useState('qr');

  // Card details state
  const [cardData, setCardData] = useState({
    number: '4242 •••• •••• 4242',
    name: user?.name || 'ALEX MERCER',
    expiry: '12/28',
    cvv: '888'
  });

  // QR Payment Session State
  const [qrSession, setQrSession] = useState(null);
  const [selectedIp, setSelectedIp] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);
  const [pollingActive, setPollingActive] = useState(false);
  const pollingRef = useRef(null);

  // Big Green Tick & Transition State
  const [showSuccessTick, setShowSuccessTick] = useState(false);
  const [tickCountdown, setTickCountdown] = useState(3);
  const [successTxId, setSuccessTxId] = useState('');

  // Cart snapshot for receipt (preserved after cart is cleared)
  const [snapshotItems, setSnapshotItems] = useState([]);
  const [snapshotTotal, setSnapshotTotal] = useState(0);

  // Processing & Final Order State
  const [processing, setProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [error, setError] = useState(null);

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    setPollingActive(false);
  };

  const startPolling = (txId) => {
    stopPolling();
    setPollingActive(true);

    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/payments/status/${txId}`);
        const data = await res.json();
        if (res.ok && data.status === 'completed') {
          stopPolling();
          triggerPaymentSuccess(txId);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 1500);
  };

  const initQrSession = async (ipOverride) => {
    setQrLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/payments/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: cartTotal, 
          preferredIp: ipOverride || selectedIp || undefined,
          orderData: { customerInfo, itemsCount: cart.length } 
        })
      });
      const data = await res.json();
      if (res.ok) {
        setQrSession(data);
        if (!selectedIp || ipOverride) {
          setSelectedIp(data.localIp);
        }
        startPolling(data.txId);
      } else {
        setError('Failed to initialize mobile payment session.');
      }
    } catch {
      setError('Could not connect to payment gateway.');
    } finally {
      setQrLoading(false);
    }
  };

  // Finalize order creation
  const handleFinalizeOrder = async (methodUsed, txId) => {
    setProcessing(true);
    stopPolling();
    setError(null);

    const result = await placeOrder({
      ...customerInfo,
      paymentMethod: methodUsed,
      txId: txId || qrSession?.txId || ''
    });

    setProcessing(false);
    if (result.success) {
      setCompletedOrder(result.order);
    } else {
      setError(result.error || 'Failed to finalize order.');
    }
  };

  // Trigger the green tick transition and finalize the order
  const triggerPaymentSuccess = (txId) => {
    stopPolling();
    setSuccessTxId(txId);
    setSnapshotItems([...cart]);
    setSnapshotTotal(cartTotal);
    setTickCountdown(3);
    setShowSuccessTick(true);
    handleFinalizeOrder(`QR Mobile Payment (${txId})`, txId);
  };

  const handleIpChange = (newIp) => {
    setSelectedIp(newIp);
    stopPolling();
    initQrSession(newIp);
  };

  const copyPayUrl = () => {
    if (!qrSession?.mobilePayUrl) return;
    navigator.clipboard.writeText(qrSession.mobilePayUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // Keep snapshot updated while in steps 1 and 2
  useEffect(() => {
    if (cart.length > 0) {
      setSnapshotItems([...cart]);
      setSnapshotTotal(cartTotal);
    }
  }, [cart, cartTotal]);

  // Initialize QR session when entering Step 2 with QR method selected
  useEffect(() => {
    if (step === 2 && paymentMethod === 'qr' && !qrSession && cart.length > 0) {
      initQrSession();
    }
    return () => stopPolling();
  }, [step, paymentMethod, qrSession, cart.length]);

  // Countdown timer for the big green tick modal
  useEffect(() => {
    if (!showSuccessTick) return;
    const timer = setInterval(() => {
      setTickCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowSuccessTick(false);
          setStep(3);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showSuccessTick]);

  // Simulate mobile scan on PC
  const handleSimulateMobileApproval = async () => {
    if (!qrSession?.txId) return;
    try {
      await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txId: qrSession.txId })
      });
      triggerPaymentSuccess(qrSession.txId);
    } catch {
      setError('Simulation failed.');
    }
  };

  const handleCardPayment = () => {
    const mockTx = 'CARD_' + Math.random().toString(36).substring(2, 9).toUpperCase();
    setProcessing(true);
    setTimeout(() => {
      triggerPaymentSuccess(mockTx);
    }, 1200);
  };

  const handleCodPayment = () => {
    const mockTx = 'COD_' + Math.random().toString(36).substring(2, 9).toUpperCase();
    setProcessing(true);
    setTimeout(() => {
      triggerPaymentSuccess(mockTx);
    }, 1000);
  };

  // Calculate 3-5 business days arrival window
  const getDeliveryDateRange = () => {
    const today = new Date();
    const minDays = 3;
    const maxDays = 5;

    const minDate = new Date(today);
    minDate.setDate(today.getDate() + minDays);

    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + maxDays);

    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return {
      formattedRange: `${minDate.toLocaleDateString('en-US', options)} - ${maxDate.toLocaleDateString('en-US', options)}`,
      minDateFormatted: minDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      maxDateFormatted: maxDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      businessDays: '3 - 5 Business Days'
    };
  };

  const deliveryInfo = getDeliveryDateRange();

  // If cart is empty and we are NOT on the receipt page
  if (cart.length === 0 && step !== 3 && !showSuccessTick) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 font-mono">
        <div className="max-w-md w-full text-center p-8 border border-[var(--border)] rounded-2xl bg-[var(--surface)]">
          <Package className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
          <h2 className="text-xl font-bold uppercase tracking-tight mb-2">Shopping Cart is Empty</h2>
          <p className="text-xs text-[var(--text-muted)] mb-6">
            Add items to your cart before proceeding to the checkout portal.
          </p>
          <Link
            to="/products"
            className="inline-block w-full py-3 px-6 rounded-xl text-xs uppercase font-bold text-black bg-[var(--accent)] hover:opacity-90"
          >
            Explore Catalogue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-mono">
      {/* ── BIG GREEN TICK MODAL (TRANSACTION SUCCESS TRANSITION) ─────────────── */}
      {showSuccessTick && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="max-w-md w-full p-8 rounded-3xl bg-[#111111] border-2 border-emerald-500/50 shadow-2xl shadow-emerald-500/20 text-center space-y-6 relative overflow-hidden">
            {/* Glow aura */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Giant animated green tick */}
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
              <div className="w-24 h-24 rounded-full bg-emerald-500/15 border-2 border-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/40 relative z-10">
                <CheckCircle2 className="w-14 h-14 text-emerald-400 animate-bounce" />
              </div>
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Payment Authorized & Cleared
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-3">
                TRANSACTION DONE!
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Your payment of <span className="text-emerald-400 font-bold">${snapshotTotal.toFixed(2)}</span> has been securely authorized.
              </p>
            </div>

            {/* Transaction snippet box */}
            <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-left text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Transaction ID:</span>
                <span className="font-bold text-[#00FFD1] font-mono">{successTxId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Payment Channel:</span>
                <span className="font-bold text-white">Mobile Hotspot / Wi-Fi Relay</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Status:</span>
                <span className="text-emerald-400 font-bold uppercase flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Confirmed
                </span>
              </div>
            </div>

            {/* Auto progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] text-gray-400">
                <span>Generating Official Order Receipt...</span>
                <span className="text-emerald-400 font-bold">{tickCountdown}s</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-[#00FFD1] transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${((4 - tickCountdown) / 3) * 100}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => {
                setShowSuccessTick(false);
                setStep(3);
              }}
              className="w-full py-3.5 px-6 rounded-xl font-bold uppercase tracking-wider text-black bg-[#00FFD1] hover:opacity-90 flex items-center justify-center gap-2 text-xs transition-transform active:scale-95"
            >
              View Order Receipt Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── HEADER & STEPPER (HIDDEN IN PRINT) ─────────────────────────────────── */}
      <div className="mb-10 text-center print:hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] uppercase font-bold bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          Encrypted Nextron Checkout Gateway
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
          {step === 3 ? 'ORDER RECEIPT & CONFIRMATION' : 'SECURE CHECKOUT'}
        </h1>

        {/* Stepper Bar */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 mt-8">
          {[
            { num: 1, label: 'Shipping Address' },
            { num: 2, label: 'Payment Gateway' },
            { num: 3, label: 'Official Receipt' },
          ].map((st) => (
            <div key={st.num} className="flex items-center gap-2 sm:gap-3">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === st.num
                    ? 'bg-[var(--accent)] text-black shadow-lg shadow-[var(--accent)]/25'
                    : step > st.num
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)]'
                }`}
              >
                {step > st.num ? <CheckCircle2 className="w-4 h-4" /> : st.num}
              </div>
              <span className={`text-xs uppercase font-bold hidden sm:inline ${step === st.num ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'}`}>
                {st.label}
              </span>
              {st.num < 3 && <span className="text-[var(--border)] hidden sm:inline">———</span>}
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN LAYOUT ──────────────────────────────────────────────────────── */}
      {step === 3 ? (
        /* ══════════════════════════════════════════════════════════════════════════
           STEP 3: COMPREHENSIVE E-COMMERCE RECEIPT & ORDER PLACED VIEW
           ══════════════════════════════════════════════════════════════════════════ */
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Top Celebration & Quick Action Bar */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-emerald-500/40 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-pulse" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-1">
                    <Check className="w-3 h-3" />
                    Transaction Completed & Order Placed
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[var(--text)]">
                    ORDER CONFIRMED #{completedOrder?.id || 'NX-2026'}
                  </h2>
                  <p className="text-xs text-[var(--text-muted)]">
                    Placed on {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              {/* Action Buttons (Print / Continue Shopping) */}
              <div className="flex items-center gap-3 w-full sm:w-auto print:hidden">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 sm:flex-none py-3 px-4 rounded-xl text-xs uppercase font-bold border border-[var(--border)] hover:bg-[var(--primary)] text-[var(--text)] transition-colors flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print Receipt
                </button>
                <Link
                  to="/products"
                  className="flex-1 sm:flex-none py-3 px-5 rounded-xl text-xs uppercase font-bold text-black bg-[var(--accent)] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-[var(--accent)]/15"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Estimated Delivery Window & Visual Stepper */}
            <div className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-[var(--primary)] border border-[var(--border)] text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Estimated Delivery Window</span>
                    <span className="font-bold text-[var(--text)] text-sm">{deliveryInfo.formattedRange}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Logistics Courier & Tracking</span>
                    <span className="font-bold text-[var(--text)] text-sm">Nextron Quantum Express (#NX-TRK-{completedOrder?.id || '9842'}98)</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block">Dispatch Speed</span>
                    <span className="font-bold text-[var(--text)] text-sm">{deliveryInfo.businessDays} Guaranteed</span>
                  </div>
                </div>
              </div>

              {/* 4-Stage Visual Progress Bar */}
              <div className="p-6 rounded-2xl bg-[var(--primary)]/50 border border-[var(--border)]">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-5">
                  Shipment Fulfillment Timeline
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
                  {[
                    { title: '1. Order Placed', desc: 'Payment Cleared', done: true, current: false },
                    { title: '2. Processing Hub', desc: 'Packed & Verified', done: false, current: true },
                    { title: '3. In Transit', desc: 'Handed to Courier', done: false, current: false },
                    { title: '4. Delivered', desc: 'Arrived at Address', done: false, current: false },
                  ].map((track, i) => (
                    <div key={i} className="flex flex-col items-center text-center space-y-2 relative">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        track.done 
                          ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30' 
                          : track.current 
                          ? 'bg-[var(--accent)] text-black animate-pulse shadow-lg shadow-[var(--accent)]/30' 
                          : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)]'
                      }`}>
                        {track.done ? <Check className="w-4 h-4 stroke-[3]" /> : i + 1}
                      </div>
                      <div>
                        <span className={`text-xs font-bold block ${track.done || track.current ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'}`}>
                          {track.title}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)]">{track.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid: Delivery Address & Payment Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Delivery Destination Card */}
            <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[var(--border)]">
                <MapPin className="w-4 h-4 text-[var(--accent)]" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Delivery Destination</h3>
              </div>
              <div className="space-y-3 text-xs leading-relaxed">
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] uppercase block">Recipient</span>
                  <span className="font-bold text-sm text-[var(--text)]">{customerInfo.name || completedOrder?.customerInfo?.fullName || 'Valued Customer'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] uppercase block">Shipping Address</span>
                  <p className="text-[var(--text)] font-mono">
                    {customerInfo.address || completedOrder?.customerInfo?.address}<br />
                    {customerInfo.city || completedOrder?.customerInfo?.city}, {customerInfo.postalCode || completedOrder?.customerInfo?.zipCode}<br />
                    {customerInfo.country || 'United States'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--border)]">
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase block">Contact Phone</span>
                    <span className="text-[var(--text)]">{customerInfo.phone || '+1 (555) 019-2831'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase block">Notification Email</span>
                    <span className="text-[var(--text)] break-all">{customerInfo.email || 'customer@domain.com'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment & Security Card */}
            <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[var(--border)]">
                <Lock className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Payment & Security Details</h3>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-muted)]">Payment Protocol:</span>
                  <span className="font-bold text-[var(--text)]">
                    {completedOrder?.customerInfo?.payment?.method || completedOrder?.customerInfo?.paymentMethod || 'QR Mobile Scan (Authorized)'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-muted)]">Transaction Reference:</span>
                  <span className="font-bold text-[var(--accent)] font-mono">
                    {successTxId || completedOrder?.customerInfo?.payment?.txId || qrSession?.txId || `TX_${completedOrder?.id || 'NX982'}`}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-muted)]">Payment Status:</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    PAID IN FULL
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-muted)]">Payment Network:</span>
                  <span className="font-bold text-[var(--text)]">
                    {selectedIp ? `Hotspot/Wi-Fi (${selectedIp})` : 'Encrypted Wireless Relay'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--primary)] border border-[var(--border)] text-[10px] text-[var(--text-muted)] mt-2">
                  🔒 Verified with Nextron 256-Bit Cryptographic Authorization Signature. Official electronic tax receipt generated.
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Order Breakdown Table */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-wider pb-4 border-b border-[var(--border)] flex items-center justify-between">
              <span>Itemized Purchase Breakdown</span>
              <span className="text-[var(--accent)] font-normal">
                {(completedOrder?.items || snapshotItems).length} item(s) ordered
              </span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--text-muted)] uppercase text-[10px]">
                    <th className="pb-3">Product Description</th>
                    <th className="pb-3 text-center">Unit Price</th>
                    <th className="pb-3 text-center">Quantity</th>
                    <th className="pb-3 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {(completedOrder?.items || snapshotItems).map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-[var(--primary)]/30 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-xl border border-[var(--border)] bg-[var(--primary)] flex-shrink-0"
                          />
                          <div>
                            <p className="font-bold text-[var(--text)] text-sm">{item.name}</p>
                            <span className="text-[10px] text-[var(--text-muted)] uppercase">
                              SKU: NX-00{item.id} • {item.category || 'Hardware'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-center font-mono text-[var(--text)]">
                        ${Number(item.price).toFixed(2)}
                      </td>
                      <td className="py-4 text-center font-bold text-[var(--text)]">
                        × {item.quantity}
                      </td>
                      <td className="py-4 text-right font-bold text-[var(--accent)] font-mono text-sm">
                        ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Calculations Box */}
            <div className="border-t border-[var(--border)] pt-4 flex flex-col items-end">
              <div className="w-full sm:w-72 space-y-2 text-xs">
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>Subtotal:</span>
                  <span className="font-bold text-[var(--text)] font-mono">
                    ${(completedOrder?.total || snapshotTotal).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>Express Quantum Freight:</span>
                  <span className="font-bold text-emerald-400 uppercase">FREE</span>
                </div>
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>Estimated Sales Tax (0%):</span>
                  <span className="font-bold text-[var(--text)] font-mono">$0.00</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[var(--text)] border-t border-[var(--border)] pt-3">
                  <span>Grand Total Paid:</span>
                  <span className="text-xl text-[var(--accent)] font-mono">
                    ${(completedOrder?.total || snapshotTotal).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Guarantee & Customer Care Card */}
          <div className="p-6 rounded-2xl bg-[var(--primary)] border border-[var(--border)] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <h5 className="font-bold uppercase text-[var(--accent)] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                30-Day Money-Back Guarantee & 2-Year Warranty
              </h5>
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                All Nextron Cybernetics hardware is protected by an unconditional 30-day return policy and full 2-year manufacturer warranty.
              </p>
            </div>
            <div className="space-y-1 md:text-right">
              <span className="font-bold uppercase text-[var(--text)] block">Need Help with Your Delivery?</span>
              <p className="text-[11px] text-[var(--text-muted)]">
                Email: <span className="text-[var(--accent)] font-mono">support@nextron.com</span> • Hotline: 1-800-NEXTRON
              </p>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 print:hidden">
            <Link
              to="/products"
              className="flex-1 py-4 px-6 rounded-2xl font-bold uppercase tracking-wider text-black bg-[var(--accent)] hover:opacity-90 flex items-center justify-center gap-2 text-xs shadow-lg shadow-[var(--accent)]/15"
            >
              <ShoppingBag className="w-4 h-4" />
              Continue Shopping
            </Link>
            <Link
              to="/profile"
              className="flex-1 py-4 px-6 rounded-2xl font-bold uppercase tracking-wider border border-[var(--border)] hover:bg-[var(--surface)] text-[var(--text)] flex items-center justify-center gap-2 text-xs transition-colors"
            >
              <Package className="w-4 h-4" />
              View Orders in Profile
            </Link>
            <button
              type="button"
              onClick={() => window.print()}
              className="sm:w-auto py-4 px-6 rounded-2xl font-bold uppercase tracking-wider border border-[var(--border)] hover:bg-[var(--surface)] text-[var(--text)] flex items-center justify-center gap-2 text-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print Order Receipt
            </button>
          </div>
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════════════════════════
           STEPS 1 & 2: SHIPPING AND PAYMENT SELECTION
           ══════════════════════════════════════════════════════════════════════════ */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form & Steps */}
          <div className="lg:col-span-7">
            {error && (
              <div className="p-4 mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                {error}
              </div>
            )}

            {/* STEP 1: Shipping Details */}
            {step === 1 && (
              <div className="p-7 rounded-3xl bg-[var(--surface)] border border-[var(--border)] space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-[var(--border)]">
                  <MapPin className="w-4 h-4 text-[var(--accent)]" />
                  <h3 className="text-sm font-bold uppercase tracking-wider">1. Delivery Destination</h3>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[var(--text-muted)] uppercase mb-1">Full Recipient Name</label>
                    <input
                      type="text"
                      required
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--primary)] border border-[var(--border)] text-[var(--text)] outline-none focus:border-[var(--accent)]"
                      placeholder="Alex Mercer"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[var(--text-muted)] uppercase mb-1">Comms Email</label>
                      <input
                        type="email"
                        required
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[var(--primary)] border border-[var(--border)] text-[var(--text)] outline-none focus:border-[var(--accent)]"
                        placeholder="alex@domain.com"
                      />
                    </div>
                    <div>
                      <label className="block text-[var(--text-muted)] uppercase mb-1">Phone / Relay</label>
                      <input
                        type="text"
                        required
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[var(--primary)] border border-[var(--border)] text-[var(--text)] outline-none focus:border-[var(--accent)]"
                        placeholder="+1 (555) 019-2831"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[var(--text-muted)] uppercase mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--primary)] border border-[var(--border)] text-[var(--text)] outline-none focus:border-[var(--accent)]"
                      placeholder="Sector 7, Neo-Avenue 42"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[var(--text-muted)] uppercase mb-1">City / Sector</label>
                      <input
                        type="text"
                        required
                        value={customerInfo.city}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[var(--primary)] border border-[var(--border)] text-[var(--text)] outline-none focus:border-[var(--accent)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[var(--text-muted)] uppercase mb-1">Postal Code</label>
                      <input
                        type="text"
                        required
                        value={customerInfo.postalCode}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, postalCode: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[var(--primary)] border border-[var(--border)] text-[var(--text)] outline-none focus:border-[var(--accent)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[var(--text-muted)] uppercase mb-1">Country</label>
                      <input
                        type="text"
                        required
                        value={customerInfo.country}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, country: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[var(--primary)] border border-[var(--border)] text-[var(--text)] outline-none focus:border-[var(--accent)]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 py-4 px-6 rounded-xl font-bold uppercase tracking-wider text-black bg-[var(--accent)] hover:opacity-90 flex items-center justify-center gap-2"
                  >
                    Proceed to Payment Gateway
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* STEP 2: Payment Gateway Selection */}
            {step === 2 && (
              <div className="p-7 rounded-3xl bg-[var(--surface)] border border-[var(--border)] space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[var(--accent)]" />
                    <h3 className="text-sm font-bold uppercase tracking-wider">2. Select Payment Method</h3>
                  </div>
                  <button
                    onClick={() => { stopPolling(); setStep(1); }}
                    className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] flex items-center gap-1 uppercase"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Edit Address
                  </button>
                </div>

                {/* Payment Method Selector Tabs */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'qr', label: 'QR Phone Scan', icon: QrCode, badge: 'Recommended' },
                    { id: 'card', label: 'Card Gateway', icon: CreditCard },
                    { id: 'cod', label: 'Cash on Delivery', icon: Banknote },
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSelected = paymentMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setPaymentMethod(m.id);
                          if (m.id !== 'qr') stopPolling();
                        }}
                        className={`p-4 rounded-2xl border text-center transition-all relative flex flex-col items-center justify-center gap-2 ${
                          isSelected
                            ? 'border-[var(--accent)] bg-[var(--primary)] text-[var(--accent)] shadow-lg shadow-[var(--accent)]/10 font-bold'
                            : 'border-[var(--border)] bg-[var(--primary)]/40 text-[var(--text-muted)] hover:text-[var(--text)]'
                        }`}
                      >
                        {m.badge && (
                          <span className="absolute -top-2 px-2 py-0.5 rounded-full text-[8px] uppercase tracking-wider bg-[var(--accent)] text-black font-black">
                            {m.badge}
                          </span>
                        )}
                        <Icon className="w-5 h-5" />
                        <span className="text-[11px] uppercase tracking-tight">{m.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* SUB-PANEL 1: QR CODE PHONE SCAN */}
                {paymentMethod === 'qr' && (
                  <div className="p-6 rounded-2xl bg-[var(--primary)] border border-[var(--border)] text-center space-y-5">
                    {/* Network Info Banner */}
                    <div className="p-3.5 rounded-xl bg-black/60 border border-[var(--border)] text-left text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold">
                          <Wifi className="w-4 h-4 animate-pulse" />
                          <span>Same Hotspot / Local Network</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase font-mono">
                          {selectedIp || qrSession?.localIp}:5173
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                        Connect your computer to your phone's hotspot or the same Wi-Fi. The QR code dynamically uses your active network address.
                      </p>

                      {/* Adapter selector if multiple available */}
                      {qrSession?.availableIps && qrSession.availableIps.length > 1 && (
                        <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between gap-2">
                          <label className="text-[10px] text-[var(--text-muted)] uppercase">Network Adapter:</label>
                          <select
                            value={selectedIp}
                            onChange={(e) => handleIpChange(e.target.value)}
                            className="text-[11px] px-2 py-1 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] outline-none font-mono"
                          >
                            {qrSession.availableIps.map((adapter, i) => (
                              <option key={i} value={adapter.address}>
                                {adapter.name} ({adapter.address}) {adapter.isWifi ? '★ Wi-Fi' : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-center gap-2 text-xs text-[var(--accent)] uppercase font-bold">
                      <Smartphone className="w-4 h-4" />
                      Scan with Your Phone Camera
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] max-w-sm mx-auto">
                      Scan the code below with your phone camera, tap "Confirm Payment" on your phone, and watch this screen authorize in real time.
                    </p>

                    {/* QR Code Container */}
                    <div className="inline-block p-4 rounded-2xl bg-[#111111] border-2 border-[var(--accent)] shadow-2xl shadow-[var(--accent)]/10 relative">
                      {qrLoading ? (
                        <div className="w-[220px] h-[220px] flex items-center justify-center">
                          <RefreshCw className="w-8 h-8 text-[var(--accent)] animate-spin" />
                        </div>
                      ) : qrSession ? (
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrSession.mobilePayUrl)}&color=00FFD1&bgcolor=111111`}
                          alt="Nextron Pay Mobile QR"
                          className="w-[220px] h-[220px] object-contain rounded-lg"
                        />
                      ) : (
                        <div className="w-[220px] h-[220px] flex items-center justify-center text-rose-400 text-xs">
                          QR Session Failed
                        </div>
                      )}
                    </div>

                    {/* Real-time Status Indicator */}
                    <div className="flex items-center justify-center gap-2 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-gray-300">
                        {pollingActive ? 'Awaiting authorization on your phone (polling active)...' : 'Ready for payment...'}
                      </span>
                    </div>

                    {/* Direct Link & Simulation Tools */}
                    {qrSession && (
                      <div className="pt-3 border-t border-[var(--border)] space-y-3">
                        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-black/40 border border-[var(--border)] text-[11px]">
                          <span className="text-[var(--text-muted)] truncate max-w-[260px] font-mono">
                            {qrSession.mobilePayUrl}
                          </span>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              type="button"
                              onClick={copyPayUrl}
                              className="px-2.5 py-1 rounded-lg border border-[var(--border)] hover:bg-[var(--surface)] text-[var(--text)] transition-colors flex items-center gap-1 text-[10px] uppercase font-bold"
                            >
                              {copiedUrl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              {copiedUrl ? 'Copied' : 'Copy'}
                            </button>
                            <a
                              href={qrSession.mobilePayUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 hover:bg-[var(--accent)]/20 transition-colors flex items-center gap-1 text-[10px] uppercase font-bold"
                            >
                              Open <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>

                        {/* PC Testing Helper Button */}
                        <button
                          type="button"
                          onClick={handleSimulateMobileApproval}
                          disabled={processing}
                          className="w-full py-3 px-4 rounded-xl text-xs uppercase font-bold border border-[var(--accent)]/40 hover:bg-[var(--accent)]/10 text-[var(--accent)] transition-colors flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Simulate Phone Scan & Authorize (One-Click Test)
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* SUB-PANEL 2: CREDIT / DEBIT CARD */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div className="p-6 rounded-2xl bg-gradient-to-tr from-[#111] via-[#1a1a1a] to-[#222] border border-[var(--border)] text-white space-y-6 shadow-xl relative overflow-hidden">
                      <div className="flex justify-between items-center">
                        <span className="text-xs tracking-widest uppercase font-bold text-[var(--accent)]">NEXTRON QUANTUM CARD</span>
                        <CreditCard className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="text-xl tracking-widest font-mono text-center py-2">
                        {cardData.number || '4242 •••• •••• 4242'}
                      </div>
                      <div className="flex justify-between text-xs font-mono text-gray-400">
                        <div>
                          <span className="text-[8px] uppercase block">Cardholder</span>
                          <span className="text-white font-bold">{cardData.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[8px] uppercase block">Expires</span>
                          <span className="text-white font-bold">{cardData.expiry}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-[var(--text-muted)] uppercase mb-1">Card Number</label>
                        <input
                          type="text"
                          value={cardData.number}
                          onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-[var(--primary)] border border-[var(--border)] text-[var(--text)] font-mono outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[var(--text-muted)] uppercase mb-1">Expiry Date</label>
                          <input
                            type="text"
                            value={cardData.expiry}
                            onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-[var(--primary)] border border-[var(--border)] text-[var(--text)] font-mono outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[var(--text-muted)] uppercase mb-1">CVV Security</label>
                          <input
                            type="password"
                            value={cardData.cvv}
                            onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-[var(--primary)] border border-[var(--border)] text-[var(--text)] font-mono outline-none"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleCardPayment}
                        disabled={processing}
                        className="w-full mt-2 py-4 px-6 rounded-xl font-bold uppercase tracking-wider text-black bg-[var(--accent)] hover:opacity-90 flex items-center justify-center gap-2"
                      >
                        {processing ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Processing Transaction...
                          </>
                        ) : (
                          `Pay $${cartTotal.toFixed(2)} with Card`
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* SUB-PANEL 3: CASH ON DELIVERY */}
                {paymentMethod === 'cod' && (
                  <div className="p-6 rounded-2xl bg-[var(--primary)] border border-[var(--border)] space-y-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center mx-auto">
                      <Banknote className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-sm uppercase">Cash on Delivery Dispatch</h4>
                    <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto leading-relaxed">
                      Pay in exact cash when our express courier delivers the package to your shipping address. No online transaction required.
                    </p>
                    <button
                      type="button"
                      onClick={handleCodPayment}
                      disabled={processing}
                      className="w-full py-4 px-6 rounded-xl font-bold uppercase tracking-wider text-black bg-[var(--accent)] hover:opacity-90 flex items-center justify-center gap-2"
                    >
                      {processing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Registering Order...
                        </>
                      ) : (
                        `Confirm Order ($${cartTotal.toFixed(2)} COD)`
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Live Order Cart Summary */}
          <div className="lg:col-span-5">
            <div className="p-7 rounded-3xl bg-[var(--surface)] border border-[var(--border)] space-y-6 sticky top-28">
              <h3 className="text-sm font-bold uppercase tracking-wider pb-4 border-b border-[var(--border)] flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs text-[var(--accent)] font-normal">{cart.length} item(s)</span>
              </h3>

              {/* Cart Items List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg border border-[var(--border)] bg-[var(--primary)]" />
                      <div>
                        <p className="font-bold text-[var(--text)]">{item.name}</p>
                        <span className="text-[10px] text-[var(--text-muted)]">Qty: {item.quantity} × ${Number(item.price).toFixed(2)}</span>
                      </div>
                    </div>
                    <span className="font-bold text-[var(--text)]">${(Number(item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Totals Calculation */}
              <div className="border-t border-[var(--border)] pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>Subtotal</span>
                  <span className="font-bold text-[var(--text)]">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>Express Quantum Shipping</span>
                  <span className="font-bold text-emerald-400 uppercase">FREE</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[var(--text)] border-t border-[var(--border)] pt-3">
                  <span>Total Amount</span>
                  <span className="text-xl text-[var(--accent)] font-mono">${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--primary)] border border-[var(--border)] text-[10px] text-[var(--text-muted)] leading-relaxed">
                🔒 256-Bit Mock Gateway with Instant Verification. No actual financial charge will occur.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
