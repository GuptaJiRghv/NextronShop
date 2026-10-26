import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const MysteryDrop = () => {
    const { products, addToCart } = useStore();
    const featured = products.filter((p) => p.featured);

    return (
        <div className="min-h-screen pt-24 pb-24">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="font-mono text-xs text-[var(--accent)] tracking-widest">✦ EXCLUSIVE DROP</span>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter mt-4 mb-4">
                        NEW <span className="text-[var(--accent)]">ARRIVALS</span>
                    </h1>
                    <p className="text-[var(--text-muted)] max-w-lg mx-auto">
                        Our latest and greatest products, hand-picked for the tech enthusiast in you. Limited quantities available.
                    </p>
                </div>

                {/* Countdown / Hype */}
                <div className="bg-[var(--surface)] rounded-3xl border border-[var(--border)] p-8 mb-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-60 h-60 bg-[var(--accent)] opacity-[0.05] rounded-full blur-[80px]" />
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Limited Edition Collection</h2>
                            <p className="text-[var(--text-muted)] text-sm">
                                These premium products won't last long. Grab yours before they're gone.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            {[
                                { value: '03', label: 'DAYS' },
                                { value: '12', label: 'HRS' },
                                { value: '45', label: 'MIN' },
                                { value: '22', label: 'SEC' },
                            ].map((item) => (
                                <div key={item.label} className="text-center">
                                    <div className="bg-[var(--primary)] border border-[var(--border)] rounded-xl w-16 h-16 flex items-center justify-center mb-1">
                                        <span className="text-2xl font-mono font-bold text-[var(--accent)]">{item.value}</span>
                                    </div>
                                    <span className="text-[10px] font-mono text-[var(--text-muted)]">{item.label}</span>
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
