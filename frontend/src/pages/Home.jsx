import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { CATEGORIES, PRODUCTS_DATA } from '../data';
import { 
    ArrowRight, ArrowUpRight, ShieldCheck, Truck, RotateCcw, 
    Award, Zap, Sparkles, Lock, Flame
} from 'lucide-react';

const WARRANTY_TICKER = [
    {
        icon: ShieldCheck,
        title: '2-YEAR HARDWARE WARRANTY',
        subtitle: 'Zero Deductible • Full Device Replacement',
        color: 'text-emerald-400',
        borderColor: 'border-emerald-500/30',
        bgGlow: 'bg-emerald-500/10'
    },
    {
        icon: Truck,
        title: 'FREE GLOBAL EXPRESS DISPATCH',
        subtitle: 'Encrypted Transport • 24H Turnaround',
        color: 'text-[#00FFD1]',
        borderColor: 'border-[#00FFD1]/30',
        bgGlow: 'bg-[#00FFD1]/10'
    },
    {
        icon: RotateCcw,
        title: '30-DAY ZERO-RISK RETURNS',
        subtitle: 'Instant Automated Telemetry Refund',
        color: 'text-amber-400',
        borderColor: 'border-amber-400/30',
        bgGlow: 'bg-amber-400/10'
    },
    {
        icon: Award,
        title: 'MIL-SPEC HARDWARE TESTING',
        subtitle: 'MIL-STD 810H Certified Durability',
        color: 'text-cyan-400',
        borderColor: 'border-cyan-400/30',
        bgGlow: 'bg-cyan-400/10'
    },
    {
        icon: Zap,
        title: 'REAL-TIME QR MOBILE PAY',
        subtitle: 'Instant Phone Authorization',
        color: 'text-yellow-400',
        borderColor: 'border-yellow-400/30',
        bgGlow: 'bg-yellow-400/10'
    },
    {
        icon: Lock,
        title: '256-BIT CRYPTO SECURITY',
        subtitle: 'End-to-End Encrypted Architecture',
        color: 'text-rose-400',
        borderColor: 'border-rose-400/30',
        bgGlow: 'bg-rose-400/10'
    }
];

const Home = () => {
    const { products, addToCart, navigateToCategory } = useStore();
    const heroRef = useRef(null);

    const pool = (products && products.length > 0) ? products : PRODUCTS_DATA;
    const featured = pool.filter((p) => p.featured);
    const trending = pool.filter((p) => p.trending).slice(0, 4);

    // Distribute products into two columns for the dual vertical marquee
    const col1 = pool.slice(0, 6);
    const col2 = pool.slice(6, 12).length >= 4 ? pool.slice(6, 12) : pool.slice(0, 6).reverse();

    // Reveal-on-scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('active')),
            { threshold: 0.15 }
        );
        document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen">
            {/* ─── Hero: Editorial Cyberpunk Layout + Dual-Column Vertical Stream ─── */}
            <section ref={heroRef} className="relative flex items-center min-h-[92vh] px-4 sm:px-6 lg:px-8 pt-24 pb-14 overflow-hidden">
                {/* Cyberpunk Ambient Glow Gradients */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 -left-40 w-[650px] h-[650px] bg-[var(--accent)] opacity-[0.08] rounded-full blur-[180px]" />
                    <div className="absolute bottom-1/4 -right-40 w-[600px] h-[600px] bg-amber-500 opacity-[0.06] rounded-full blur-[170px]" />
                    <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-[#38EF7D] opacity-[0.03] rounded-full blur-[200px]" />
                </div>

                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center relative z-10">
                    {/* LEFT COLUMN: Brutalist / Editorial Headline & CTAs (7 cols) */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-[#00FFD1] border border-[#00FFD1]/30 bg-[#00FFD1]/10 px-3.5 py-1.5 rounded-full shadow-lg shadow-[#00FFD1]/10">
                            <Sparkles className="w-3.5 h-3.5 text-[#00FFD1] animate-spin" style={{ animationDuration: '6s' }} />
                            <span>Next-Gen Cybernetics Archive • Autumn 2026</span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black leading-[0.92] tracking-tighter uppercase text-white">
                            AN ARCHIVE<br />
                            OF <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFD1] via-[#38EF7D] to-[#00FFD1]">CYBER</span><br />
                            HARDWARE<span className="text-[var(--accent-2)]">.</span>
                        </h1>

                        <p className="text-[var(--text-muted)] text-base sm:text-lg max-w-xl leading-relaxed font-light">
                            Nextron archives high-performance neural audio, quantum tactical computers, and precision electronics engineered for extreme creator capability.
                        </p>

                        {/* Pill action buttons (inspired by Atrium reference) */}
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-black text-xs sm:text-sm uppercase tracking-wider text-black bg-gradient-to-r from-[#00FFD1] to-[#38EF7D] hover:opacity-95 transition-all shadow-lg shadow-[#00FFD1]/25 active:scale-95 group cursor-pointer"
                            >
                                <span>Explore Hardware</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>

                            <Link
                                to="/trending"
                                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider text-white border border-white/20 hover:border-[#00FFD1] hover:text-[#00FFD1] bg-white/5 hover:bg-[#00FFD1]/10 transition-all active:scale-95 cursor-pointer backdrop-blur-md"
                            >
                                <Flame className="w-4 h-4 text-amber-400" />
                                <span>Trending Drops</span>
                            </Link>
                        </div>

                        {/* Telemetry Stat Strip */}
                        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-xs font-mono max-w-lg">
                            <div>
                                <div className="text-xl sm:text-2xl font-black text-white font-sans">50K+</div>
                                <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Operatives Active</div>
                            </div>
                            <div>
                                <div className="text-xl sm:text-2xl font-black text-[#00FFD1] font-sans">2-YEAR</div>
                                <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Hardware Warranty</div>
                            </div>
                            <div>
                                <div className="text-xl sm:text-2xl font-black text-amber-400 font-sans">24H</div>
                                <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Express Dispatch</div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Dual-Column Vertical Product Marquee (5 cols) */}
                    <div className="lg:col-span-5 relative">
                        {/* Frame Header Pill */}
                        <div className="flex items-center justify-between pb-3 text-xs font-mono text-gray-400 px-1">
                            <span className="flex items-center gap-2 uppercase tracking-wider text-[11px] text-[#00FFD1]">
                                <span className="w-2 h-2 rounded-full bg-[#00FFD1] animate-ping" />
                                Live Hardware Feed
                            </span>
                            <span className="text-[10px] text-gray-500">Hover to pause</span>
                        </div>

                        {/* Dual Column Vertical Stream with Fade Masks */}
                        <div className="relative h-[540px] sm:h-[600px] lg:h-[640px] overflow-hidden vertical-fade-mask grid grid-cols-2 gap-3 sm:gap-4 p-1">
                            {/* Column 1: Scrolling Upwards */}
                            <div className="animate-scroll-up pause-hover flex flex-col gap-3 sm:gap-4">
                                {[...col1, ...col1].map((product, idx) => (
                                    <Link
                                        key={`c1-${product.id}-${idx}`}
                                        to={`/product/${product.id}`}
                                        className="group relative block rounded-3xl bg-[#111111]/90 border border-white/10 hover:border-[#00FFD1] p-3 sm:p-3.5 shadow-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-[#00FFD1]/15 overflow-hidden backdrop-blur-md"
                                    >
                                        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black/60 mb-2.5 border border-white/5">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                loading="lazy"
                                            />
                                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider bg-black/75 border border-white/15 text-[#00FFD1] backdrop-blur-md font-mono">
                                                {product.category}
                                            </span>
                                            <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[11px] font-black bg-black/85 text-white border border-white/15 font-mono shadow-md">
                                                ${product.price}
                                            </span>
                                        </div>
                                        <div className="space-y-0.5 px-0.5">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#00FFD1] transition-colors truncate">
                                                    {product.name}
                                                </h3>
                                                <ArrowUpRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#00FFD1] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
                                            </div>
                                            <p className="text-[10px] text-gray-400 truncate font-light">
                                                {product.description}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Column 2: Scrolling Downwards */}
                            <div className="animate-scroll-down pause-hover flex flex-col gap-3 sm:gap-4">
                                {[...col2, ...col2].map((product, idx) => (
                                    <Link
                                        key={`c2-${product.id}-${idx}`}
                                        to={`/product/${product.id}`}
                                        className="group relative block rounded-3xl bg-[#111111]/90 border border-white/10 hover:border-amber-400 p-3 sm:p-3.5 shadow-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-amber-400/15 overflow-hidden backdrop-blur-md"
                                    >
                                        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black/60 mb-2.5 border border-white/5">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                loading="lazy"
                                            />
                                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider bg-black/75 border border-white/15 text-amber-400 backdrop-blur-md font-mono">
                                                {product.category}
                                            </span>
                                            <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[11px] font-black bg-black/85 text-white border border-white/15 font-mono shadow-md">
                                                ${product.price}
                                            </span>
                                        </div>
                                        <div className="space-y-0.5 px-0.5">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                                                    {product.name}
                                                </h3>
                                                <ArrowUpRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
                                            </div>
                                            <p className="text-[10px] text-gray-400 truncate font-light">
                                                {product.description}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Illuminated Cyber-Pill 2-Year Warranty & Telemetry Ticker ─── */}
            <div className="border-y border-white/10 bg-[#090909]/95 backdrop-blur-xl py-4 overflow-hidden relative">
                {/* Edge Fading Gradients */}
                <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-[var(--primary)] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-[var(--primary)] to-transparent z-10 pointer-events-none" />

                <div className="marquee pause-hover flex items-center gap-5 whitespace-nowrap">
                    {[...WARRANTY_TICKER, ...WARRANTY_TICKER].map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={idx}
                                className={`inline-flex items-center gap-3.5 px-5 py-2.5 rounded-2xl bg-[#121212] border ${item.borderColor} hover:scale-105 transition-all duration-200 shadow-md cursor-default flex-shrink-0`}
                            >
                                <div className={`w-8 h-8 rounded-xl ${item.bgGlow} flex items-center justify-center ${item.color}`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <div className="text-left font-mono">
                                    <div className={`text-xs font-bold uppercase tracking-wider ${item.color}`}>
                                        {item.title}
                                    </div>
                                    <div className="text-[10px] text-gray-400 tracking-tight">
                                        {item.subtitle}
                                    </div>
                                </div>
                                <span className="text-gray-600 text-xs ml-2">✦</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ─── Categories ──────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-6 py-24">
                <div className="reveal">
                    <span className="font-mono text-xs text-[var(--accent)] tracking-widest">CATEGORIES</span>
                    <h2 className="text-4xl font-black tracking-tighter mt-2 mb-12">
                        BROWSE BY <span className="text-[var(--accent)]">CATEGORY</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {CATEGORIES.map((cat, i) => (
                        <div
                            key={cat.id}
                            className="reveal category-card rounded-2xl overflow-hidden cursor-pointer bg-[var(--surface)] border border-[var(--border)]"
                            style={{ transitionDelay: `${i * 100}ms` }}
                            onClick={() => navigateToCategory(cat.id)}
                        >
                            <div className="h-48 overflow-hidden">
                                <img src={cat.image} alt={cat.name} className="category-image w-full h-full object-cover" />
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-lg mb-1">{cat.name}</h3>
                                <p className="text-sm text-[var(--text-muted)]">{cat.description}</p>
                                <p className="text-xs font-mono text-[var(--accent)] mt-2">{cat.count} products →</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── Trending ────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-6 pb-24">
                <div className="reveal">
                    <span className="font-mono text-xs text-[var(--accent-2)] tracking-widest">HOT RIGHT NOW</span>
                    <h2 className="text-4xl font-black tracking-tighter mt-2 mb-12">
                        TRENDING <span className="text-[var(--accent-2)]">PRODUCTS</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {trending.map((product, i) => (
                        <div key={product.id} className="reveal product-card bg-[var(--surface)] rounded-2xl overflow-hidden border border-[var(--border)] group" style={{ transitionDelay: `${i * 100}ms` }}>
                            <Link to={`/product/${product.id}`}>
                                <div className="h-56 overflow-hidden">
                                    <img src={product.image} alt={product.name} className="product-image w-full h-full object-cover" />
                                </div>
                            </Link>
                            <div className="p-5">
                                <p className="text-xs font-mono text-[var(--text-muted)] uppercase mb-1">{product.category}</p>
                                <Link to={`/product/${product.id}`}>
                                    <h3 className="font-bold mb-2 hover:text-[var(--accent)] transition-colors">{product.name}</h3>
                                </Link>
                                <div className="flex items-center justify-between">
                                    <span className="text-[var(--accent)] font-bold font-mono text-lg">${product.price}</span>
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="btn-primary px-4 py-2 rounded-full text-xs font-bold"
                                    >
                                        ADD TO CART
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-10 reveal">
                    <Link to="/trending" className="btn-outline px-8 py-3 rounded-full text-sm">
                        VIEW ALL TRENDING →
                    </Link>
                </div>
            </section>

            {/* ─── CTA Banner ─────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-6 pb-24">
                <div className="reveal bg-gradient-to-r from-[var(--surface)] to-transparent rounded-3xl border border-[var(--border)] p-12 md:p-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--accent)] opacity-[0.06] rounded-full blur-[100px]" />
                    <span className="font-mono text-xs text-[var(--accent)] tracking-widest">LIMITED DROP</span>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter mt-3 mb-4">
                        DON'T MISS<br />THE <span className="text-[var(--accent)]">NEW ARRIVALS</span>
                    </h2>
                    <p className="text-[var(--text-muted)] mb-8 max-w-md">
                        Exclusive limited-edition products dropping every week. Be the first to get your hands on them.
                    </p>
                    <Link to="/new-arrivals" className="btn-primary px-8 py-4 rounded-full text-sm font-bold inline-block">
                        EXPLORE DROPS
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
