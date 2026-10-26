import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const Trending = () => {
    const { products, addToCart, addToWishlist, wishlist } = useStore();
    const trending = products.filter((p) => p.trending);
    const isInWishlist = (id) => wishlist.some((w) => w.id === id);

    return (
        <div className="min-h-screen pt-24 pb-24">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="mb-12">
                    <span className="font-mono text-xs text-[var(--accent-2)] tracking-widest">🔥 HOT RIGHT NOW</span>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter mt-2 mb-4">
                        TRENDING <span className="text-[var(--accent-2)]">PRODUCTS</span>
                    </h1>
                    <p className="text-[var(--text-muted)] max-w-lg">
                        Our most popular products right now. Don't miss out on what everyone's talking about.
                    </p>
                </div>

                {/* Products grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {trending.map((product) => (
                        <div key={product.id} className="product-card bg-[var(--surface)] rounded-2xl overflow-hidden border border-[var(--border)] group">
                            <div className="relative h-56 overflow-hidden">
                                <Link to={`/product/${product.id}`}>
                                    <img src={product.image} alt={product.name} className="product-image w-full h-full object-cover" />
                                </Link>
                                <span className="absolute top-3 left-3 bg-[var(--accent-2)] text-white text-[10px] font-mono font-bold px-2 py-1 rounded-full">
                                    TRENDING
                                </span>
                                <button
                                    onClick={() => addToWishlist(product)}
                                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[var(--primary)] bg-opacity-80 flex items-center justify-center border border-[var(--border)] hover:border-[var(--accent-2)] transition-colors"
                                >
                                    <svg className={`w-4 h-4 ${isInWishlist(product.id) ? 'text-[var(--accent-2)] fill-current' : ''}`} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-5">
                                <p className="text-xs font-mono text-[var(--text-muted)] uppercase mb-1">{product.category}</p>
                                <Link to={`/product/${product.id}`}>
                                    <h3 className="font-bold mb-1 hover:text-[var(--accent)] transition-colors">{product.name}</h3>
                                </Link>
                                <p className="text-xs text-[var(--text-muted)] mb-3">{product.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-[var(--accent)] font-bold font-mono text-lg">${product.price}</span>
                                    <button onClick={() => addToCart(product)} className="btn-primary px-4 py-2 rounded-full text-xs font-bold">
                                        ADD TO CART
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {trending.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-[var(--text-muted)] font-mono">No trending products right now. Check back soon!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Trending;
