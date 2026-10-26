import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { 
  User, Package, Heart, LogOut, ShieldCheck, 
  Clock, ShoppingCart, ArrowRight, ChevronDown, 
  ChevronUp, RotateCcw, DollarSign, CheckCircle2, 
  MapPin, Calendar, Hash, ExternalLink 
} from 'lucide-react';

const Profile = () => {
  const { user, orders, wishlist, logout, addToCart, removeFromWishlist, reorderItems } = useStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [reorderedFeedback, setReorderedFeedback] = useState(null);

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center p-8 border border-[var(--border)] rounded-2xl bg-[var(--surface)] backdrop-blur-xl">
          <User className="w-16 h-16 text-[var(--accent)] mx-auto mb-4" />
          <h2 className="text-2xl font-bold font-mono tracking-tight mb-2 uppercase">AUTHENTICATION REQUIRED</h2>
          <p className="text-[var(--text-muted)] text-sm mb-6 font-mono">
            Please log in or sign up to access your personal dashboard, track order carts, and review transaction history.
          </p>
          <div className="flex gap-3">
            <Link
              to="/login"
              className="flex-1 py-3 px-4 rounded-xl font-mono text-xs tracking-wider uppercase font-bold text-black bg-[var(--accent)] hover:opacity-90 transition-opacity text-center"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="flex-1 py-3 px-4 rounded-xl font-mono text-xs tracking-wider uppercase font-bold border border-[var(--border)] hover:bg-[var(--border)] transition-colors text-center"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const totalOrdersCount = orders?.length || 0;
  const lifetimeSpent = orders?.reduce((sum, order) => sum + (Number(order.total) || 0), 0) || 0;
  const totalItemsPurchased = orders?.reduce((sum, order) => {
    return sum + (order.items?.reduce((itemSum, item) => itemSum + (item.quantity || 1), 0) || 0);
  }, 0) || 0;

  const toggleExpandOrder = (id) => {
    setExpandedOrderId(prev => prev === id ? null : id);
  };

  const handleReorder = (order) => {
    if (!order.items || order.items.length === 0) return;
    reorderItems(order.items);
    setReorderedFeedback(order.id);
    setTimeout(() => setReorderedFeedback(null), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Top Welcome / Dashboard Banner */}
      <div className="p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] relative overflow-hidden mb-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-[var(--primary)] border-2 border-[var(--accent)] flex items-center justify-center text-3xl font-mono font-black text-[var(--accent)] shadow-lg shadow-[var(--accent)]/15">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight uppercase">
                  {user.name}
                </h1>
                {user.role === 'admin' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[var(--accent-2)]/10 text-[var(--accent-2)] border border-[var(--accent-2)]/20 font-bold">
                    <ShieldCheck className="w-3 h-3" />
                    Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 font-bold">
                    Verified Customer
                  </span>
                )}
              </div>
              <p className="text-xs font-mono text-[var(--text-muted)]">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.role === 'admin' && (
              <Link
                to="/admin"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-bold text-black bg-[var(--accent)] hover:opacity-90 transition-opacity"
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Console
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards: Times placed order, lifetime spent, items purchased, wishlist */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {/* Total Orders Placed */}
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] relative overflow-hidden group hover:border-[var(--accent)]/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-[var(--text-muted)] tracking-wider">Orders Placed</span>
            <div className="p-2 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black font-mono text-[var(--accent)]">
            {totalOrdersCount}
          </p>
          <span className="text-[10px] font-mono text-[var(--text-muted)] mt-1 block">
            {totalOrdersCount === 0 ? 'No orders yet' : totalOrdersCount === 1 ? '1 completed transaction' : `${totalOrdersCount} total orders completed`}
          </span>
        </div>

        {/* Lifetime Spent */}
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] relative overflow-hidden group hover:border-[var(--accent)]/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-[var(--text-muted)] tracking-wider">Total Spent</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black font-mono text-[var(--text)]">
            ${lifetimeSpent.toFixed(2)}
          </p>
          <span className="text-[10px] font-mono text-emerald-400 mt-1 block">
            Lifetime Cart Volume
          </span>
        </div>

        {/* Total Items Purchased */}
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] relative overflow-hidden group hover:border-[var(--accent)]/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-[var(--text-muted)] tracking-wider">Gear Procured</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black font-mono text-[var(--text)]">
            {totalItemsPurchased}
          </p>
          <span className="text-[10px] font-mono text-[var(--text-muted)] mt-1 block">
            Total units delivered
          </span>
        </div>

        {/* Wishlist Items */}
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] relative overflow-hidden group hover:border-[var(--accent)]/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-[var(--text-muted)] tracking-wider">Saved Wishlist</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black font-mono text-[var(--text)]">
            {wishlist.length}
          </p>
          <span className="text-[10px] font-mono text-[var(--text-muted)] mt-1 block">
            Saved for later
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-[var(--border)] pb-4 mb-8">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 pb-2 text-xs font-mono uppercase tracking-wider font-bold transition-all relative ${
            activeTab === 'orders' ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
        >
          <Package className="w-4 h-4" />
          Previous Order Carts ({orders.length})
          {activeTab === 'orders' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--accent)]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`flex items-center gap-2 pb-2 text-xs font-mono uppercase tracking-wider font-bold transition-all relative ${
            activeTab === 'wishlist' ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
        >
          <Heart className="w-4 h-4" />
          Saved Wishlist ({wishlist.length})
          {activeTab === 'wishlist' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--accent)]" />
          )}
        </button>
      </div>

      {/* Previous Order Carts Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="text-center py-16 p-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
              <Package className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
              <h3 className="font-mono text-sm font-bold uppercase">No Previous Orders Placed</h3>
              <p className="text-xs text-[var(--text-muted)] mt-1 mb-6 font-mono">
                You haven't checked out any orders yet. Once placed, your carts and order telemetry will be preserved here.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs uppercase font-bold text-black bg-[var(--accent)] hover:opacity-90"
              >
                Explore Catalogue
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            orders.map(order => {
              const isExpanded = expandedOrderId === order.id;
              const itemCount = order.items?.reduce((s, i) => s + (i.quantity || 1), 0) || 0;
              const isJustReordered = reorderedFeedback === order.id;

              return (
                <div
                  key={order.id}
                  className={`rounded-2xl bg-[var(--surface)] border transition-all duration-200 overflow-hidden ${
                    isExpanded ? 'border-[var(--accent)] shadow-xl shadow-[var(--accent)]/5' : 'border-[var(--border)] hover:border-[var(--border)]/80'
                  }`}
                >
                  {/* Order Summary Header Bar */}
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: ID & Metadata */}
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-[var(--primary)] border border-[var(--border)] text-[var(--accent)]">
                          <Hash className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-base text-[var(--text)]">
                              ORDER #{order.id}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30 font-bold">
                              {order.status || 'Processing'}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-xs font-mono text-[var(--text-muted)]">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {order.date ? new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recent'}
                            </span>
                            <span>•</span>
                            <span>{itemCount} {itemCount === 1 ? 'item' : 'items'} in cart</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Price & Quick Actions */}
                      <div className="flex items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-[var(--border)]">
                        <div className="text-left lg:text-right mr-2">
                          <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Cart Total</span>
                          <span className="text-xl font-bold font-mono text-[var(--accent)]">
                            ${Number(order.total).toFixed(2)}
                          </span>
                        </div>

                        {/* Re-order Cart Button */}
                        <button
                          onClick={() => handleReorder(order)}
                          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-mono text-xs uppercase font-bold transition-all ${
                            isJustReordered
                              ? 'bg-emerald-500 text-black'
                              : 'bg-[var(--accent)] text-black hover:opacity-90'
                          }`}
                          title="Load this entire order cart back into your active shopping cart"
                        >
                          {isJustReordered ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Cart Loaded!
                            </>
                          ) : (
                            <>
                              <RotateCcw className="w-3.5 h-3.5" />
                              Re-order Cart
                            </>
                          )}
                        </button>

                        {/* Expand / Collapse Toggle Button */}
                        <button
                          onClick={() => toggleExpandOrder(order.id)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-mono text-xs uppercase border border-[var(--border)] hover:bg-[var(--primary)] text-[var(--text)] transition-colors"
                        >
                          <span>{isExpanded ? 'Hide Cart' : 'Inspect Cart'}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-[var(--accent)]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Order Cart Breakdown */}
                  {isExpanded && (
                    <div className="border-t border-[var(--border)] bg-[var(--primary)]/60 p-6 space-y-6 animate-in fade-in duration-150">
                      <div>
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)] mb-3 flex items-center gap-2">
                          <ShoppingCart className="w-4 h-4" />
                          Cart Contents ({order.items?.length || 0} unique items)
                        </h4>

                        <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-xl bg-[var(--surface)] overflow-hidden">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
                              <div className="flex items-center gap-3.5">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-12 h-12 object-cover rounded-lg border border-[var(--border)] bg-[var(--primary)]"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-lg bg-[var(--primary)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)]">
                                    <Package className="w-5 h-5" />
                                  </div>
                                )}
                                <div>
                                  <Link
                                    to={`/product/${item.id}`}
                                    className="font-bold text-sm text-[var(--text)] hover:text-[var(--accent)] transition-colors flex items-center gap-1.5"
                                  >
                                    {item.name}
                                    <ExternalLink className="w-3 h-3 text-[var(--text-muted)]" />
                                  </Link>
                                  <div className="flex items-center gap-3 text-[11px] text-[var(--text-muted)] mt-0.5">
                                    <span>Unit Price: ${item.price}</span>
                                    <span>•</span>
                                    <span className="text-[var(--accent)] font-bold">Quantity: {item.quantity || 1}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="text-left sm:text-right">
                                <span className="text-[10px] text-[var(--text-muted)] block uppercase">Subtotal</span>
                                <span className="font-bold text-sm text-[var(--text)]">
                                  ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Customer & Delivery Details for this order */}
                      {order.customerInfo && (
                        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] font-mono text-xs">
                          <h5 className="font-bold uppercase tracking-wider text-[var(--text-muted)] text-[11px] mb-2 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[var(--accent)]" />
                            Dispatch Destination
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[var(--text)]">
                            <div>
                              <span className="text-[var(--text-muted)]">Recipient: </span>
                              <span className="font-bold">{order.customerInfo.name || user.name}</span>
                            </div>
                            <div>
                              <span className="text-[var(--text-muted)]">Email: </span>
                              <span>{order.customerInfo.email || user.email}</span>
                            </div>
                            {order.customerInfo.address && (
                              <div className="sm:col-span-2">
                                <span className="text-[var(--text-muted)]">Address: </span>
                                <span>{order.customerInfo.address}, {order.customerInfo.city || ''} {order.customerInfo.postalCode || ''}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Wishlist Tab */}
      {activeTab === 'wishlist' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.length === 0 ? (
            <div className="col-span-full text-center py-16 p-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
              <Heart className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
              <h3 className="font-mono text-sm font-bold uppercase">Wishlist is Empty</h3>
              <p className="text-xs text-[var(--text-muted)] mt-1 mb-6 font-mono">
                Save your favorite cyberpunk gear by clicking the heart icon on any product page.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs uppercase font-bold text-black bg-[var(--accent)] hover:opacity-90"
              >
                Browse Gear
              </Link>
            </div>
          ) : (
            wishlist.map(p => (
              <div key={p.id} className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex flex-col justify-between space-y-4 hover:border-[var(--accent)]/30 transition-colors">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-[var(--primary)] border border-[var(--border)]">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold font-mono text-sm text-[var(--text)]">{p.name}</h4>
                  <p className="text-xs font-mono text-[var(--accent)] font-bold mt-1">${p.price}</p>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      addToCart(p);
                      removeFromWishlist(p.id);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl font-mono text-xs font-bold uppercase text-black bg-[var(--accent)] hover:opacity-90 flex items-center justify-center gap-1.5"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Move To Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(p.id)}
                    className="p-2 rounded-xl border border-[var(--border)] hover:bg-rose-500/10 text-rose-400"
                    title="Remove from Wishlist"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
