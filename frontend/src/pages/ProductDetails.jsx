import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const ProductDetails = () => {
    const { id } = useParams();
    const { products, addToCart, addToWishlist, wishlist } = useStore();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        const found = products.find((p) => p.id === Number(id));
        setProduct(found || null);

        if (found) {
            setRelatedProducts(
                products.filter((p) => p.category === found.category && p.id !== found.id).slice(0, 4)
            );
        }
    }, [id, products]);

    const isInWishlist = product ? wishlist.some((w) => w.id === product.id) : false;

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Product not found</h2>
                    <Link to="/products" className="btn-primary px-6 py-3 rounded-full text-sm font-bold">
                        BROWSE PRODUCTS
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-24">
            <div className="max-w-7xl mx-auto px-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm font-mono text-[var(--text-muted)] mb-8">
                    <Link to="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
                    <span>/</span>
                    <Link to="/products" className="hover:text-[var(--accent)] transition-colors">Products</Link>
                    <span>/</span>
                    <Link to={`/products?category=${product.category}`} className="hover:text-[var(--accent)] transition-colors capitalize">{product.category}</Link>
                    <span>/</span>
                    <span className="text-[var(--text)]">{product.name}</span>
                </div>

                {/* Product */}
                <div className="grid md:grid-cols-2 gap-12 items-start">
                    {/* Image */}
                    <div className="bg-[var(--surface)] rounded-3xl border border-[var(--border)] overflow-hidden">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-[500px] object-cover"
                        />
                    </div>

                    {/* Info */}
                    <div>
                        <span className="inline-block font-mono text-xs text-[var(--accent)] border border-[var(--accent)] px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                            {product.category}
                        </span>

                        <h1 className="text-4xl font-black tracking-tighter mb-4">{product.name}</h1>

                        <p className="text-[var(--text-muted)] text-lg mb-6 leading-relaxed">{product.description}</p>

                        <div className="flex items-end gap-4 mb-8">
                            <span className="text-4xl font-black text-[var(--accent)] font-mono">${product.price}</span>
                            <span className="text-sm font-mono text-[var(--text-muted)]">FREE SHIPPING</span>
                        </div>

                        {/* Stock indicator */}
                        <div className="flex items-center gap-2 mb-8">
                            <div className={`w-2 h-2 rounded-full ${product.stock > 5 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500 badge-pulse' : 'bg-red-500'}`} />
                            <span className="text-sm font-mono text-[var(--text-muted)]">
                                {product.stock > 5 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 mb-8">
                            <button
                                onClick={() => addToCart(product)}
                                disabled={product.stock === 0}
                                className="flex-1 btn-primary py-4 rounded-full font-bold text-sm"
                            >
                                {product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
                            </button>
                            <button
                                onClick={() => addToWishlist(product)}
                                className={`w-14 h-14 rounded-full border flex items-center justify-center transition-colors ${
                                    isInWishlist ? 'border-[var(--accent-2)] text-[var(--accent-2)]' : 'border-[var(--border)] hover:border-[var(--accent-2)]'
                                }`}
                            >
                                <svg className="w-5 h-5" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                        </div>

                        {/* Features */}
                        <div className="border-t border-[var(--border)] pt-6 space-y-3">
                            <h3 className="font-mono text-xs text-[var(--text-muted)] tracking-widest mb-3">FEATURES</h3>
                            {['Premium Build Quality', '2-Year Warranty', '30-Day Returns', 'Free Express Shipping'].map((f) => (
                                <div key={f} className="flex items-center gap-3 text-sm">
                                    <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-24">
                        <h2 className="text-2xl font-black tracking-tighter mb-8">
                            RELATED <span className="text-[var(--accent)]">PRODUCTS</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((rp) => (
                                <Link key={rp.id} to={`/product/${rp.id}`} className="product-card bg-[var(--surface)] rounded-2xl overflow-hidden border border-[var(--border)]">
                                    <div className="h-48 overflow-hidden">
                                        <img src={rp.image} alt={rp.name} className="product-image w-full h-full object-cover" />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold mb-1">{rp.name}</h3>
                                        <span className="text-[var(--accent)] font-bold font-mono">${rp.price}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
