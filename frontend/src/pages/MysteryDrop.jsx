import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Clock, Sparkles } from 'lucide-react';

const INITIAL_SECONDS = (3 * 86400) + (12 * 3600) + (45 * 60) + 22; // 305,122s (3d 12h 45m 22s)

const formatTimeUnits = (totalSeconds) => {
    const sec = Math.max(0, totalSeconds);
    const days = Math.floor(sec / 86400);
    const hours = Math.floor((sec % 86400) / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;
    return {
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
    };
};

const MysteryDrop = () => {
    const { products, addToCart } = useStore();
    const featured = products.filter((p) => p.featured);

    const [remainingSeconds, setRemainingSeconds] = useState(INITIAL_SECONDS);
    const [targetTime, setTargetTime] = useState(null);

    // Fetch server-synchronized drop target timestamp
    useEffect(() => {
        let isMounted = true;
        const fetchTimer = async () => {
            try {
                const res = await fetch(`/api/drop-timer?_t=${Date.now()}`);
                if (res.ok) {
                    const data = await res.json();
                    if (isMounted && data.targetTime) {
                        setTargetTime(data.targetTime);
                        const diff = Math.max(0, Math.floor((data.targetTime - Date.now()) / 1000));
                        setRemainingSeconds(diff);
                    }
                }
            } catch {
                // If offline or network error, fallback to initial duration
            }
        };

        fetchTimer();
        return () => { isMounted = false; };
    }, []);

    // Live 1-second interval ticker
    useEffect(() => {
        const interval = setInterval(() => {
            if (targetTime) {
                const diff = Math.max(0, Math.floor((targetTime - Date.now()) / 1000));
                setRemainingSeconds(diff);
            } else {
                setRemainingSeconds((prev) => Math.max(0, prev - 1));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [targetTime]);

    const time = formatTimeUnits(remainingSeconds);

    return (
        <div className="min-h-screen pt-24 pb-24 font-sans">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="font-mono text-xs text-[var(--accent)] tracking-widest inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20">
                        <Sparkles className="w-3.5 h-3.5" />
                        EXCLUSIVE DROP TELEMETRY
                    </span>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter mt-4 mb-4 uppercase">
                        NEW <span className="text-[var(--accent)]">ARRIVALS</span>
                    </h1>
                    <p className="text-[var(--text-muted)] max-w-lg mx-auto">
                        Our latest and greatest products, hand-picked for the tech enthusiast in you. Limited quantities available.
                    </p>
                </div>

                {/* Countdown / Hype */}
                <div className="bg-[var(--surface)] rounded-3xl border border-[var(--border)] p-8 mb-16 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-60 h-60 bg-[var(--accent)] opacity-[0.08] rounded-full blur-[80px] pointer-events-none" />
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                        <div>
                            <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--accent)] mb-2 uppercase font-bold tracking-wider">
                                <Clock className="w-4 h-4 animate-pulse" />
                                <span>Active Drop Countdown</span>
                            </div>
                            <h2 className="text-2xl font-bold mb-2 text-white">Limited Edition Collection</h2>
                            <p className="text-[var(--text-muted)] text-sm max-w-md">
                                These premium products won't last long. Grab yours before the release window expires.
                            </p>
                        </div>

                        {/* Real-Time Countdown Digit Display */}
                        <div className="flex gap-2.5 sm:gap-4">
                            {[
                                { value: time.days, label: 'DAYS' },
                                { value: time.hours, label: 'HRS' },
                                { value: time.minutes, label: 'MIN' },
                                { value: time.seconds, label: 'SEC' },
                            ].map((item) => (
                                <div key={item.label} className="text-center">
                                    <div className="bg-[var(--primary)] border border-white/10 rounded-2xl w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mb-1.5 shadow-lg shadow-black/60 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-[var(--accent)]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <span className="text-2xl sm:text-3xl font-mono font-black text-[var(--accent)] tracking-tight">
                                            {item.value}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-mono text-gray-400 font-bold uppercase tracking-wider block">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Featured Products as New Arrivals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {featured.map((product, i) => (
                        <div
                            key={product.id}
                            className="product-card bg-[var(--surface)] rounded-3xl overflow-hidden border border-[var(--border)] flex flex-col md:flex-row"
                        >
                            <Link to={`/product/${product.id}`} className="md:w-1/2">
                                <img src={product.image} alt={product.name} className="product-image w-full h-64 md:h-full object-cover" />
                            </Link>
                            <div className="p-6 md:w-1/2 flex flex-col justify-center">
                                <span className="inline-block font-mono text-[10px] text-[var(--accent)] border border-[var(--accent)] px-2 py-0.5 rounded-full mb-3 w-fit uppercase tracking-wider">
                                    {product.category}
                                </span>
                                <Link to={`/product/${product.id}`}>
                                    <h3 className="text-2xl font-bold mb-2 hover:text-[var(--accent)] transition-colors">{product.name}</h3>
                                </Link>
                                <p className="text-sm text-[var(--text-muted)] mb-4">{product.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-black text-[var(--accent)] font-mono">${product.price}</span>
                                    <button onClick={() => addToCart(product)} className="btn-primary px-5 py-2 rounded-full text-xs font-bold">
                                        ADD TO CART
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MysteryDrop;
