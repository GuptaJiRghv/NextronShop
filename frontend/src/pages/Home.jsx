import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data';

const Home = () => {
    const { products, addToCart, navigateToCategory } = useStore();
    const heroRef = useRef(null);

    const featured = products.filter((p) => p.featured);
    const trending = products.filter((p) => p.trending).slice(0, 4);

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
            {/* ─── Hero ─────────────────────────────────────────── */}
            <section ref={heroRef} className="relative flex items-center min-h-screen px-6 overflow-hidden">
                {/* Background glow */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] bg-[var(--accent)] opacity-[0.07] rounded-full blur-[180px]" />
                    <div className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] bg-[var(--accent-2)] opacity-[0.05] rounded-full blur-[160px]" />
                </div>

                <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
                    <div>
                        <span className="inline-block font-mono text-xs text-[var(--accent)] border border-[var(--accent)] px-3 py-1 rounded-full mb-6 tracking-widest">
                            PREMIUM ELECTRONICS
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tighter mb-6">
                            THE FUTURE<br />
                            OF <span className="text-[var(--accent)]">SOUND</span><br />
                            IS HERE<span className="text-[var(--accent-2)]">.</span>
                        </h1>
                        <p className="text-[var(--text-muted)] text-lg max-w-md mb-8 leading-relaxed">
                            Experience audio excellence with our curated collection of premium headphones, earbuds, and tech gear.
                        </p>
                        <div className="flex gap-4">
                            <Link to="/products" className="btn-primary px-8 py-4 rounded-full text-sm font-bold">
                                SHOP NOW
                            </Link>
                            <Link to="/trending" className="btn-outline px-8 py-4 rounded-full text-sm">
                                TRENDING
                            </Link>
                        </div>
                    </div>

                    {/* Hero product showcase */}
                    <div className="hidden md:flex justify-center">
                        <div className="relative">
                            <div className="w-80 h-80 rounded-full border border-[var(--border)] flex items-center justify-center floating">
                                {featured[0] && (
                                    <img
                                        src={featured[0].image}
                                        alt={featured[0].name}
                                        className="w-64 h-64 object-cover rounded-full"
                                    />
                                )}
                            </div>
                            <div className="absolute -bottom-4 -right-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 font-mono text-xs">
                                <span className="text-[var(--accent)]">●</span> {featured[0]?.name ?? 'Featured Product'}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Marquee ──────────────────────────────────────── */}
            <div className="border-y border-[var(--border)] py-4 overflow-hidden">
                <div className="marquee whitespace-nowrap">
                    {Array(4).fill('FREE SHIPPING ON ALL ORDERS   •   30-DAY RETURNS   •   2-YEAR WARRANTY   •   PREMIUM QUALITY   •   ').map((text, i) => (
                        <span key={i} className="font-mono text-sm text-[var(--text-muted)] mx-4">{text}</span>
                    ))}
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
