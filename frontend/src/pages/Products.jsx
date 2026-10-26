import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data';

const Products = () => {
    const { products, addToCart, addToWishlist, wishlist } = useStore();
    const [searchParams, setSearchParams] = useSearchParams();

    const activeCategory = searchParams.get('category') || 'all';
    const [sortBy, setSortBy] = useState('');
    const [search, setSearch] = useState('');

    const setCategory = (cat) => {
        setSearchParams(cat === 'all' ? {} : { category: cat });
    };

    let filtered = products;

    if (activeCategory && activeCategory !== 'all') {
        filtered = filtered.filter((p) => p.category === activeCategory);
    }

    if (search.trim()) {
        const term = search.toLowerCase();
        filtered = filtered.filter(
            (p) => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)
        );
    }

    if (sortBy === 'price-low') filtered = [...filtered].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') filtered = [...filtered].sort((a, b) => b.price - a.price);
    if (sortBy === 'name') filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));

    const isInWishlist = (id) => wishlist.some((w) => w.id === id);

    // Reveal on scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('active')),
            { threshold: 0.1 }
        );
        document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [filtered]);

    return (
        <div className="min-h-screen pt-24">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="mb-12">
                    <span className="font-mono text-xs text-[var(--accent)] tracking-widest">COLLECTION</span>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter mt-2 mb-4">
                        ALL <span className="text-[var(--accent)]">PRODUCTS</span>
                    </h1>
                    <p className="text-[var(--text-muted)] max-w-lg">
                        Browse our full catalogue of premium electronics. Filter by category, search, or sort to find exactly what you're looking for.
                    </p>
                </div>

                {/* Filters bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-10">
                    {/* Category pills */}
                    <div className="flex gap-2 flex-wrap flex-1">
                        <button
                            onClick={() => setCategory('all')}
                            className={`px-4 py-2 rounded-full text-xs font-mono font-bold border transition-colors ${
                                activeCategory === 'all'
                                    ? 'bg-[var(--accent)] text-[var(--primary)] border-[var(--accent)]'
                                    : 'border-[var(--border)] hover:border-[var(--accent)]'
                            }`}
                        >
                            ALL
                        </button>
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setCategory(cat.id)}
                                className={`px-4 py-2 rounded-full text-xs font-mono font-bold border transition-colors ${
                                    activeCategory === cat.id
                                        ? 'bg-[var(--accent)] text-[var(--primary)] border-[var(--accent)]'
                                        : 'border-[var(--border)] hover:border-[var(--accent)]'
                                }`}
                            >
                                {cat.name.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    {/* Search + Sort */}
                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-[var(--surface)] border border-[var(--border)] rounded-full px-4 py-2 text-sm font-mono w-48 focus:border-[var(--accent)] transition-colors"
                        />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-[var(--surface)] border border-[var(--border)] rounded-full px-4 py-2 text-sm font-mono cursor-pointer focus:border-[var(--accent)] transition-colors"
                        >
                            <option value="">Sort By</option>
                            <option value="price-low">Price: Low → High</option>
                            <option value="price-high">Price: High → Low</option>
                            <option value="name">Name: A → Z</option>
                        </select>
                    </div>
                </div>

                {/* Product count */}
                <p className="text-sm text-[var(--text-muted)] font-mono mb-6">
                    {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
                </p>

                {/* Product grid */}
                {filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-[var(--text-muted)] font-mono text-lg">No products found.</p>
                        <button onClick={() => { setCategory('all'); setSearch(''); }} className="btn-outline px-6 py-2 rounded-full text-sm mt-4">
                            CLEAR FILTERS
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-24">
                        {filtered.map((product, i) => (
                            <div
                                key={product.id}
                                className="reveal product-card bg-[var(--surface)] rounded-2xl overflow-hidden border border-[var(--border)] group"
                                style={{ transitionDelay: `${(i % 8) * 60}ms` }}
                            >
                                <div className="relative h-56 overflow-hidden">
                                    <Link to={`/product/${product.id}`}>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="product-image w-full h-full object-cover"
                                        />
                                    </Link>
                                    {/* Wishlist button */}
                                    <button
                                        onClick={() => addToWishlist(product)}
                                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[var(--primary)] bg-opacity-80 flex items-center justify-center border border-[var(--border)] hover:border-[var(--accent-2)] transition-colors"
                                    >
                                        <svg className={`w-4 h-4 ${isInWishlist(product.id) ? 'text-[var(--accent-2)] fill-current' : ''}`} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>
                                    {/* Stock badge */}
                                    {product.stock <= 5 && product.stock > 0 && (
                                        <span className="absolute top-3 left-3 bg-[var(--accent-2)] text-white text-[10px] font-mono font-bold px-2 py-1 rounded-full">
                                            ONLY {product.stock} LEFT
                                        </span>
                                    )}
                                    {product.stock === 0 && (
                                        <span className="absolute top-3 left-3 bg-gray-700 text-white text-[10px] font-mono font-bold px-2 py-1 rounded-full">
                                            OUT OF STOCK
                                        </span>
                                    )}
                                </div>
                                <div className="p-5">
                                    <p className="text-xs font-mono text-[var(--text-muted)] uppercase mb-1">{product.category}</p>
                                    <Link to={`/product/${product.id}`}>
                                        <h3 className="font-bold mb-1 hover:text-[var(--accent)] transition-colors">{product.name}</h3>
                                    </Link>
                                    <p className="text-xs text-[var(--text-muted)] mb-3 line-clamp-2">{product.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[var(--accent)] font-bold font-mono text-lg">${product.price}</span>
                                        <button
                                            onClick={() => addToCart(product)}
                                            disabled={product.stock === 0}
                                            className="btn-primary px-4 py-2 rounded-full text-xs font-bold"
                                        >
                                            {product.stock === 0 ? 'SOLD OUT' : 'ADD TO CART'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;
