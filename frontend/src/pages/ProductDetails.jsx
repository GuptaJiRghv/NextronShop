import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { 
  Star, MessageSquare, ShieldCheck, CheckCircle2, 
  Send, ThumbsUp, Sparkles, User, Calendar 
} from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const { products, addToCart, addToWishlist, wishlist, user } = useStore();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);

    // Community Reviews State
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(5.0);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewForm, setReviewForm] = useState({
        userName: user?.name || '',
        rating: 5,
        title: '',
        comment: ''
    });
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewSuccess, setReviewSuccess] = useState(false);

    useEffect(() => {
        const found = products.find((p) => p.id === Number(id));
        setProduct(found || null);

        if (found) {
            setRelatedProducts(
                products.filter((p) => p.category === found.category && p.id !== found.id).slice(0, 4)
            );
        }

        // Fetch Community Reviews from API
        fetchReviews(id);
    }, [id, products]);

    const fetchReviews = async (productId) => {
        setReviewsLoading(true);
        try {
            const res = await fetch(`/api/products/${productId}/reviews`);
            const data = await res.json();
            if (res.ok && Array.isArray(data.reviews)) {
                setReviews(data.reviews);
                setAvgRating(data.avgRating || 5.0);
            }
        } catch (err) {
            console.error('Failed to load reviews:', err);
        } finally {
            setReviewsLoading(false);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setSubmittingReview(true);
        try {
            const res = await fetch(`/api/products/${id}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reviewForm)
            });
            const newRev = await res.json();
            if (res.ok) {
                setReviews(prev => [newRev, ...prev]);
                // Recalculate average
                const newAvg = Math.round((([newRev, ...reviews].reduce((acc, r) => acc + r.rating, 0) / (reviews.length + 1))) * 10) / 10;
                setAvgRating(newAvg);
                setReviewSuccess(true);
                setReviewForm({ userName: user?.name || '', rating: 5, title: '', comment: '' });
                setTimeout(() => {
                    setReviewSuccess(false);
                    setShowReviewForm(false);
                }, 2000);
            }
        } catch (err) {
            console.error('Failed to post review:', err);
        } finally {
            setSubmittingReview(false);
        }
    };

    const isInWishlist = product ? wishlist.some((w) => w.id === product.id) : false;

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center font-mono">
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
        <div className="min-h-screen pt-24 pb-24 font-mono">
            <div className="max-w-7xl mx-auto px-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-8">
                    <Link to="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
                    <span>/</span>
                    <Link to="/products" className="hover:text-[var(--accent)] transition-colors">Products</Link>
                    <span>/</span>
                    <Link to={`/products?category=${product.category}`} className="hover:text-[var(--accent)] transition-colors capitalize">{product.category}</Link>
                    <span>/</span>
                    <span className="text-[var(--text)]">{product.name}</span>
                </div>

                {/* Product Hero Grid */}
                <div className="grid md:grid-cols-2 gap-12 items-start">
                    {/* Image */}
                    <div className="bg-[var(--surface)] rounded-3xl border border-[var(--border)] overflow-hidden shadow-2xl">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-[500px] object-cover"
                        />
                    </div>

                    {/* Info */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="inline-block text-xs text-[var(--accent)] border border-[var(--accent)] px-3 py-1 rounded-full uppercase tracking-wider">
                                {product.category}
                            </span>
                            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                                <Star className="w-4 h-4 fill-current" />
                                <span>{avgRating}</span>
                                <span className="text-[var(--text-muted)] font-normal">({reviews.length} reviews)</span>
                            </div>
                        </div>

                        <h1 className="text-4xl font-black tracking-tighter mb-4 uppercase">{product.name}</h1>

                        <p className="text-[var(--text-muted)] text-base mb-6 leading-relaxed font-sans">{product.description}</p>

                        <div className="flex items-end gap-4 mb-8">
                            <span className="text-4xl font-black text-[var(--accent)]">${product.price}</span>
                            <span className="text-xs text-emerald-400 font-bold">FREE QUANTUM SHIPPING</span>
                        </div>

                        {/* Stock indicator */}
                        <div className="flex items-center gap-2 mb-8">
                            <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 5 ? 'bg-emerald-400' : product.stock > 0 ? 'bg-amber-400 badge-pulse' : 'bg-rose-500'}`} />
                            <span className="text-xs text-[var(--text-muted)] uppercase">
                                {product.stock > 5 ? `In Stock (${product.stock} units)` : product.stock > 0 ? `Critical Low (${product.stock} remaining)` : 'Out of Stock'}
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 mb-8">
                            <button
                                onClick={() => addToCart(product)}
                                disabled={product.stock === 0}
                                className="flex-1 btn-primary py-4 rounded-xl font-bold text-xs uppercase tracking-wider"
                            >
                                {product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
                            </button>
                            <button
                                onClick={() => addToWishlist(product)}
                                className={`w-14 h-14 rounded-xl border flex items-center justify-center transition-colors ${
                                    isInWishlist ? 'border-[var(--accent-2)] text-[var(--accent-2)]' : 'border-[var(--border)] hover:border-[var(--accent-2)]'
                                }`}
                                title="Add to Wishlist"
                            >
                                <svg className="w-5 h-5" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                        </div>

                        {/* Features */}
                        <div className="border-t border-[var(--border)] pt-6 space-y-2.5">
                            <h3 className="text-xs text-[var(--text-muted)] tracking-widest mb-3 uppercase font-bold">HARDWARE SPECIFICATIONS</h3>
                            {['Aerospace-Grade Materials', '2-Year Direct Replacement Warranty', '30-Day Evaluation Period', 'Global Carbon-Offset Dispatch'].map((f) => (
                                <div key={f} className="flex items-center gap-3 text-xs text-[var(--text)]">
                                    <ShieldCheck className="w-4 h-4 text-[var(--accent)]" />
                                    <span>{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ────────────────────────────────────────────────────────── */}
                {/* COMMUNITY REVIEWS SECTION */}
                {/* ────────────────────────────────────────────────────────── */}
                <div className="mt-24 pt-12 border-t border-[var(--border)]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                        <div>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase font-bold bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 mb-2">
                                <MessageSquare className="w-3.5 h-3.5" />
                                Verified Field Transmissions
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
                                COMMUNITY REVIEWS
                            </h2>
                            <p className="text-xs text-[var(--text-muted)] mt-1">
                                Real impressions and telemetry data from field operators using this gear.
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <div className="text-3xl font-black text-amber-400 flex items-center justify-end gap-1">
                                    <Star className="w-6 h-6 fill-current" />
                                    <span>{avgRating}</span>
                                </div>
                                <span className="text-[10px] text-[var(--text-muted)] uppercase">Based on {reviews.length} reviews</span>
                            </div>
                            <button
                                onClick={() => setShowReviewForm(prev => !prev)}
                                className="px-5 py-3 rounded-xl font-bold uppercase text-xs text-black bg-[var(--accent)] hover:opacity-90 transition-opacity"
                            >
                                {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                            </button>
                        </div>
                    </div>

                    {/* Interactive Review Form */}
                    {showReviewForm && (
                        <div className="p-7 mb-10 rounded-3xl bg-[var(--surface)] border border-[var(--accent)]/30 shadow-2xl animate-in fade-in duration-200">
                            <h3 className="text-sm font-bold uppercase mb-4 text-[var(--accent)] flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Submit Transmission Review
                            </h3>

                            {reviewSuccess ? (
                                <div className="p-6 text-center text-emerald-400 font-bold space-y-2">
                                    <CheckCircle2 className="w-8 h-8 mx-auto animate-bounce" />
                                    <p>Review Dispatched and Logged into Community Relay!</p>
                                </div>
                            ) : (
                                <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[var(--text-muted)] uppercase mb-1">Operator Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={reviewForm.userName}
                                                onChange={(e) => setReviewForm({ ...reviewForm, userName: e.target.value })}
                                                placeholder="e.g. Alex M."
                                                className="w-full px-4 py-2.5 rounded-xl bg-[var(--primary)] border border-[var(--border)] text-[var(--text)] outline-none focus:border-[var(--accent)]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[var(--text-muted)] uppercase mb-1">Star Rating (1 - 5)</label>
                                            <div className="flex items-center gap-2 pt-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        type="button"
                                                        key={star}
                                                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                                        className={`p-1.5 rounded-lg border transition-all ${
                                                            reviewForm.rating >= star
                                                                ? 'border-amber-400 text-amber-400 bg-amber-400/10'
                                                                : 'border-[var(--border)] text-gray-600 hover:text-gray-400'
                                                        }`}
                                                    >
                                                        <Star className={`w-5 h-5 ${reviewForm.rating >= star ? 'fill-current' : ''}`} />
                                                    </button>
                                                ))}
                                                <span className="text-xs text-[var(--accent)] font-bold ml-2">{reviewForm.rating} of 5 Stars</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[var(--text-muted)] uppercase mb-1">Review Headline</label>
                                        <input
                                            type="text"
                                            required
                                            value={reviewForm.title}
                                            onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                                            placeholder="e.g. Revolutionary hardware design & thermal performance"
                                            className="w-full px-4 py-2.5 rounded-xl bg-[var(--primary)] border border-[var(--border)] text-[var(--text)] outline-none focus:border-[var(--accent)]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[var(--text-muted)] uppercase mb-1">Transmission Commentary</label>
                                        <textarea
                                            required
                                            rows="4"
                                            value={reviewForm.comment}
                                            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                            placeholder="Share your detailed impressions regarding durability, ergonomics, and daily workflow..."
                                            className="w-full px-4 py-2.5 rounded-xl bg-[var(--primary)] border border-[var(--border)] text-[var(--text)] outline-none focus:border-[var(--accent)] resize-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submittingReview}
                                        className="py-3 px-6 rounded-xl font-bold uppercase text-black bg-[var(--accent)] hover:opacity-90 flex items-center gap-2"
                                    >
                                        {submittingReview ? (
                                            'Transmitting Review...'
                                        ) : (
                                            <>
                                                <Send className="w-3.5 h-3.5" />
                                                Publish Review
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-4">
                        {reviewsLoading ? (
                            <div className="p-8 text-center text-xs text-[var(--text-muted)]">
                                Loading Community Transmissions...
                            </div>
                        ) : reviews.length === 0 ? (
                            <div className="p-12 text-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text-muted)]">
                                No reviews registered yet. Be the first operator to submit field feedback.
                            </div>
                        ) : (
                            reviews.map((rev) => (
                                <div
                                    key={rev.id}
                                    className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-3 hover:border-[var(--accent)]/30 transition-colors"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border)]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[var(--primary)] border border-[var(--accent)]/40 flex items-center justify-center font-bold text-xs text-[var(--accent)]">
                                                {rev.userName ? rev.userName.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-sm text-[var(--text)]">{rev.userName}</span>
                                                    <span className="px-2 py-0.5 rounded text-[9px] uppercase font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                        {rev.userRole || 'Verified Customer'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)] mt-0.5">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{rev.date ? new Date(rev.date).toLocaleDateString() : 'Recent'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stars */}
                                        <div className="flex items-center gap-1 text-amber-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-gray-700'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Review Content */}
                                    <h4 className="font-bold text-sm text-[var(--accent)]">{rev.title}</h4>
                                    <p className="text-xs text-[var(--text-muted)] font-sans leading-relaxed">
                                        {rev.comment}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-24 pt-12 border-t border-[var(--border)]">
                        <h2 className="text-2xl font-black tracking-tighter mb-8 uppercase">
                            RELATED <span className="text-[var(--accent)]">HARDWARE</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((rp) => (
                                <Link key={rp.id} to={`/product/${rp.id}`} className="product-card bg-[var(--surface)] rounded-2xl overflow-hidden border border-[var(--border)] group">
                                    <div className="h-48 overflow-hidden bg-[var(--primary)]">
                                        <img src={rp.image} alt={rp.name} className="product-image w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold mb-1 text-sm">{rp.name}</h3>
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
