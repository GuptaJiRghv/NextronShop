import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  ShieldCheck, CheckCircle2, AlertCircle, 
  Smartphone, ArrowRight, Lock, RefreshCw 
} from 'lucide-react';

const MobilePayConfirm = () => {
  const [searchParams] = useSearchParams();
  const txId = searchParams.get('tx');
  const queryAmount = searchParams.get('amount');

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(!!txId);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState(!txId ? 'No transaction session identifier detected in QR transmission.' : null);

  useEffect(() => {
    if (!txId) {
      return;
    }

    const fetchDetails = async () => {
      try {
        const res = await fetch(`/api/payments/details/${txId}`);
        const data = await res.json();
        if (res.ok) {
          setDetails(data);
          if (data.status === 'completed') {
            setConfirmed(true);
          }
        } else {
          // If details endpoint failed, fall back to query amount
          setDetails({
            txId,
            amount: Number(queryAmount) || 0,
            status: 'pending',
            merchant: 'Nextron Cybernetics Store'
          });
        }
      } catch {
        setDetails({
          txId,
          amount: Number(queryAmount) || 0,
          status: 'pending',
          merchant: 'Nextron Cybernetics Store'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [txId, queryAmount]);

  const handleConfirmPayment = async () => {
    setConfirming(true);
    setError(null);

    try {
      const res = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txId })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setConfirmed(true);
      } else {
        setError(data.message || 'Payment authorization failed.');
      }
    } catch {
      setError('Network transmission failure. Ensure phone is on the same local Wi-Fi.');
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#E5E5E5] flex items-center justify-center p-6 font-mono">
        <div className="text-center space-y-4">
          <RefreshCw className="w-10 h-10 text-[#00FFD1] animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest text-gray-400">Loading Secure Mobile Session...</p>
        </div>
      </div>
    );
  }

  if (error && !details) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#E5E5E5] flex items-center justify-center p-6 font-mono">
        <div className="max-w-sm w-full p-8 rounded-2xl bg-[#111111] border border-red-500/30 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold uppercase text-rose-400">Session Error</h2>
          <p className="text-xs text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  const displayAmount = details?.amount ? Number(details.amount).toFixed(2) : Number(queryAmount || 0).toFixed(2);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E5E5E5] flex flex-col justify-between p-6 font-mono selection:bg-[#00FFD1] selection:text-black">
      {/* Header */}
      <div className="max-w-md w-full mx-auto pt-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest bg-[#00FFD1]/10 text-[#00FFD1] border border-[#00FFD1]/20 mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          Nextron Pay Mobile Gateway
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white uppercase">
          Authorization Link
        </h1>
        <p className="text-[11px] text-gray-400 mt-1">
          Scanned via Smartphone Camera
        </p>
      </div>

      {/* Main Card */}
      <div className="max-w-md w-full mx-auto my-auto py-8">
        <div className="p-7 rounded-3xl bg-[#111111] border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          {confirmed ? (
            <div className="text-center py-6 space-y-5 animate-in fade-in duration-300">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce" />
              </div>
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight text-white">Payment Authorized!</h3>
                <p className="text-xs text-emerald-400 mt-1 font-bold">Transaction Successfully Completed</p>
              </div>

              <div className="p-4 rounded-xl bg-black/50 border border-white/10 text-left text-[11px] space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount Paid:</span>
                  <span className="font-bold text-white">${displayAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Transaction ID:</span>
                  <span className="font-bold text-[#00FFD1]">{txId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-emerald-400 font-bold uppercase">Confirmed (Mock)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#00FFD1]/10 border border-[#00FFD1]/20 text-[11px] text-gray-300 leading-relaxed">
                🚀 Look at your computer screen! The order has been automatically finalized and created. You can safely close this mobile window.
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Merchant Details */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block">Merchant</span>
                  <span className="font-bold text-white">Nextron Technologies</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-500 uppercase block">Transmission ID</span>
                  <span className="text-[#00FFD1] font-bold text-[11px]">{txId}</span>
                </div>
              </div>

              {/* Amount Display */}
              <div className="text-center py-4 bg-black/40 rounded-2xl border border-white/5">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1">Total Authorized Amount</span>
                <div className="text-4xl font-black tracking-tight text-[#00FFD1]">
                  ${displayAmount}
                </div>
                <span className="text-[10px] text-gray-500 uppercase mt-1 block">Simulated Evaluation Transaction</span>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleConfirmPayment}
                disabled={confirming}
                className="w-full py-4 px-6 rounded-2xl font-bold uppercase tracking-wider text-black bg-[#00FFD1] hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#00FFD1]/20 text-sm"
              >
                {confirming ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Transmitting Approval...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Confirm & Authorize Payment
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500">
                <Smartphone className="w-3 h-3 text-[#00FFD1]" />
                <span>End-to-End Encrypted Relay Node</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md w-full mx-auto text-center pb-4 text-[10px] text-gray-500">
        Nextron Secure Commerce • Evaluation Node Gateway
      </div>
    </div>
  );
};

export default MobilePayConfirm;
