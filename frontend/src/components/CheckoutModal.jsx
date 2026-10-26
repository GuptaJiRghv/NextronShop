import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

const STEPS = ['Shipping', 'Payment', 'Review'];

const CheckoutModal = () => {
    const { cart, cartTotal, isCheckoutOpen, setIsCheckoutOpen, placeOrder, user } = useStore();
    const [step, setStep] = useState(0);
    const [orderResult, setOrderResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        cardNumber: '',
        cardExpiry: '',
        cardCvv: '',
    });

    if (!isCheckoutOpen) return null;

    const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handleClose = () => {
        setIsCheckoutOpen(false);
        setStep(0);
        setOrderResult(null);
        setError('');
        setForm({ fullName: '', email: '', phone: '', address: '', city: '', state: '', zipCode: '', country: '', cardNumber: '', cardExpiry: '', cardCvv: '' });
    };

    const handleSubmit = async () => {
        if (step < 2) {
            setStep(step + 1);
            return;
        }

        setLoading(true);
        setError('');

        const result = await placeOrder(form);

        setLoading(false);

        if (result.success) {
            setOrderResult(result.order);
            setStep(3);
        } else {
            setError(result.error || 'Something went wrong.');
        }
    };

    const inputClass = 'w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--accent)] transition-colors font-mono text-sm';

    return (
        <>
            <div className="fixed inset-0 modal-backdrop z-[60] flex items-center justify-center p-4" onClick={handleClose}>
                <div className="bg-[var(--primary)] border border-[var(--border)] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto hide-scrollbar" onClick={(e) => e.stopPropagation()}>
                    <div className="p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">
                                {step < 3 ? 'CHECKOUT' : 'ORDER CONFIRMED'}
                                <span className="text-[var(--accent)]">.</span>
                            </h2>
                            <button onClick={handleClose} className="w-10 h-10 rounded-full border border-[var(--border)] hover:border-[var(--accent)] transition-colors flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Step Indicator */}
                        {step < 3 && (
                            <div className="flex gap-2 mb-6">
                                {STEPS.map((label, i) => (
                                    <div key={label} className="flex-1">
                                        <div className={`h-1 rounded-full transition-colors ${i <= step ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`} />
                                        <p className={`text-xs font-mono mt-1 ${i <= step ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>{label}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Not logged in */}
                        {!user && step < 3 && (
                            <div className="text-center py-8">
                                <p className="text-[var(--accent-2)] font-mono mb-2">Please log in to complete your order.</p>
                            </div>
                        )}

                        {/* Step 0 – Shipping */}
                        {user && step === 0 && (
                            <div className="space-y-4">
                                <input className={inputClass} placeholder="Full Name *" value={form.fullName} onChange={update('fullName')} />
                                <input className={inputClass} placeholder="Email" type="email" value={form.email} onChange={update('email')} />
                                <input className={inputClass} placeholder="Phone" value={form.phone} onChange={update('phone')} />
                                <input className={inputClass} placeholder="Address *" value={form.address} onChange={update('address')} />
                                <div className="grid grid-cols-2 gap-4">
                                    <input className={inputClass} placeholder="City *" value={form.city} onChange={update('city')} />
                                    <input className={inputClass} placeholder="State" value={form.state} onChange={update('state')} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input className={inputClass} placeholder="ZIP Code" value={form.zipCode} onChange={update('zipCode')} />
                                    <input className={inputClass} placeholder="Country *" value={form.country} onChange={update('country')} />
                                </div>
                            </div>
                        )}

                        {/* Step 1 – Payment */}
                        {user && step === 1 && (
                            <div className="space-y-4">
                                <p className="text-xs text-[var(--text-muted)] font-mono mb-2">
                                    Demo mode — enter any 16-digit card number. Nothing is charged.
                                </p>
                                <input className={inputClass} placeholder="Card Number" value={form.cardNumber} onChange={update('cardNumber')} maxLength={19} />
                                <div className="grid grid-cols-2 gap-4">
                                    <input className={inputClass} placeholder="MM/YY" value={form.cardExpiry} onChange={update('cardExpiry')} maxLength={5} />
                                    <input className={inputClass} placeholder="CVV" value={form.cardCvv} onChange={update('cardCvv')} maxLength={4} type="password" />
                                </div>
                            </div>
                        )}

                        {/* Step 2 – Review */}
                        {user && step === 2 && (
                            <div className="space-y-4">
                                <div className="bg-[var(--surface)] rounded-xl p-4 border border-[var(--border)]">
                                    <h3 className="font-bold mb-3 text-sm">ORDER SUMMARY</h3>
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex justify-between text-sm py-1">
                                            <span className="text-[var(--text-muted)]">{item.name} × {item.quantity}</span>
                                            <span className="font-mono">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                    <div className="border-t border-[var(--border)] mt-3 pt-3 flex justify-between font-bold">
                                        <span>Total</span>
                                        <span className="text-[var(--accent)]">${cartTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="bg-[var(--surface)] rounded-xl p-4 border border-[var(--border)]">
                                    <h3 className="font-bold mb-2 text-sm">SHIPPING TO</h3>
                                    <p className="text-sm text-[var(--text-muted)]">
                                        {form.fullName}<br />
                                        {form.address}, {form.city}<br />
                                        {form.state} {form.zipCode}, {form.country}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Step 3 – Success */}
                        {step === 3 && orderResult && (
                            <div className="text-center py-8">
                                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[var(--accent)] bg-opacity-20 flex items-center justify-center">
                                    <svg className="w-10 h-10 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path className="checkmark" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Thank you!</h3>
                                <p className="text-[var(--text-muted)] font-mono text-sm mb-4">Order #{orderResult.id} has been placed.</p>
                                <p className="text-[var(--accent)] font-bold text-xl">${orderResult.total?.toFixed(2)}</p>
                            </div>
                        )}

                        {/* Error */}
                        {error && <p className="text-[var(--accent-2)] text-sm font-mono mt-4">{error}</p>}

                        {/* Actions */}
                        {step < 3 && user && (
                            <div className="flex gap-3 mt-6">
                                {step > 0 && (
                                    <button onClick={() => setStep(step - 1)} className="flex-1 btn-outline py-3 rounded-full text-sm">
                                        BACK
                                    </button>
                                )}
                                <button onClick={handleSubmit} disabled={loading} className="flex-1 btn-primary py-3 rounded-full text-sm font-bold">
                                    {loading ? 'PLACING ORDER...' : step === 2 ? 'PLACE ORDER' : 'CONTINUE'}
                                </button>
                            </div>
                        )}

                        {step === 3 && (
                            <button onClick={handleClose} className="w-full btn-primary py-3 rounded-full text-sm font-bold mt-4">
                                CONTINUE SHOPPING
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CheckoutModal;
