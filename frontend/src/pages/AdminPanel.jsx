import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';
import { 
  ShieldCheck, Package, ShoppingCart, Users, MessageSquare, 
  TrendingUp, AlertCircle, Plus, Trash2, Edit3, CheckCircle, RefreshCw 
} from 'lucide-react';

const AdminPanel = () => {
  const { user, products, setProducts } = useStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New product form modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'audio',
    price: '',
    stock: 20,
    description: '',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
    trending: false,
    featured: false
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, ordersRes, usersRes, msgsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/orders'),
        api.get('/admin/users'),
        api.get('/admin/messages')
      ]);

      if (statsRes.ok) setStats(statsRes.data);
      if (ordersRes.ok) setOrders(ordersRes.data);
      if (usersRes.ok) setUsersList(usersRes.data);
      if (msgsRes.ok) setMessages(msgsRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch admin data from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchData();
    }
  }, [user]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center p-8 border border-[var(--border)] rounded-2xl bg-[var(--surface)] backdrop-blur-xl">
          <AlertCircle className="w-16 h-16 text-[var(--accent-2)] mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold font-mono tracking-tight mb-2">ACCESS RESTRICTED</h2>
          <p className="text-[var(--text-muted)] text-sm mb-6">
            Administrator privileges required. Please login with an admin account (admin@nextron.com / admin).
          </p>
          <Link
            to="/login"
            className="inline-block w-full py-3 px-6 rounded-xl font-mono text-xs tracking-wider uppercase font-bold text-black bg-[var(--accent)] hover:opacity-90 transition-opacity"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock, 10),
      };
      const res = await api.post('/products', payload);
      if (res.ok) {
        setProducts(prev => [res.data, ...prev]);
        setShowAddModal(false);
        setNewProduct({
          name: '',
          category: 'audio',
          price: '',
          stock: 20,
          description: '',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
          trending: false,
          featured: false
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await api.delete(`/products/${id}`);
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-8 border-b border-[var(--border)] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              Command Center
            </span>
          </div>
          <h1 className="text-3xl font-black font-mono tracking-tight uppercase">
            NEXTRON ADMIN CONSOLE
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Real-time management portal for operations, inventory & transactions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono uppercase border border-[var(--border)] hover:bg-[var(--border)] transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Sync Data
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono uppercase font-bold text-black bg-[var(--accent)] hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 py-6 border-b border-[var(--border)] scrollbar-none">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'products', label: `Inventory (${products.length})`, icon: Package },
          { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingCart },
          { id: 'users', label: `Users (${usersList.length})`, icon: Users },
          { id: 'messages', label: `Messages (${messages.length})`, icon: MessageSquare },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[var(--accent)] text-black font-bold shadow-lg shadow-[var(--accent)]/20'
                  : 'bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="pt-8">
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                <span className="text-xs font-mono uppercase text-[var(--text-muted)]">Gross Revenue</span>
                <p className="text-3xl font-black font-mono text-[var(--accent)] mt-2">
                  ${stats.revenue?.toLocaleString()}
                </p>
                <span className="text-[10px] font-mono text-emerald-400 mt-1 block">Live In-Memory Total</span>
              </div>
              <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                <span className="text-xs font-mono uppercase text-[var(--text-muted)]">Total Orders</span>
                <p className="text-3xl font-black font-mono text-[var(--text)] mt-2">{stats.totalOrders}</p>
                <span className="text-[10px] font-mono text-[var(--text-muted)] mt-1 block">Processed transactions</span>
              </div>
              <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                <span className="text-xs font-mono uppercase text-[var(--text-muted)]">Active Products</span>
                <p className="text-3xl font-black font-mono text-[var(--text)] mt-2">{stats.totalProducts}</p>
                <span className="text-[10px] font-mono text-amber-400 mt-1 block">{stats.lowStockCount} low on stock</span>
              </div>
              <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                <span className="text-xs font-mono uppercase text-[var(--text-muted)]">Registered Customers</span>
                <p className="text-3xl font-black font-mono text-[var(--text)] mt-2">{stats.totalUsers}</p>
                <span className="text-[10px] font-mono text-[var(--text-muted)] mt-1 block">Active user accounts</span>
              </div>
            </div>

            {/* Quick Status Breakdowns */}
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
              <h3 className="text-sm font-bold font-mono uppercase mb-4">Orders Pipeline Status</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Object.entries(stats.ordersByStatus || {}).map(([status, count]) => (
                  <div key={status} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--primary)]">
                    <span className="text-xs font-mono text-[var(--text-muted)] uppercase">{status}</span>
                    <p className="text-2xl font-bold font-mono mt-1">{count}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="overflow-x-auto border border-[var(--border)] rounded-2xl bg-[var(--surface)]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[var(--primary)] border-b border-[var(--border)] text-[var(--text-muted)] uppercase tracking-wider">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Badges</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[var(--primary)]/40 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg border border-[var(--border)]" />
                      <div>
                        <span className="font-bold text-[var(--text)] block">{p.name}</span>
                        <span className="text-[10px] text-[var(--text-muted)]">ID: {p.id}</span>
                      </div>
                    </td>
                    <td className="p-4 uppercase text-[var(--text-muted)]">{p.category}</td>
                    <td className="p-4 font-bold text-[var(--accent)]">${p.price}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${p.stock <= 5 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="p-4 space-x-1">
                      {p.trending && <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-300">TRENDING</span>}
                      {p.featured && <span className="px-1.5 py-0.5 rounded text-[9px] bg-cyan-500/20 text-cyan-300">FEATURED</span>}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="overflow-x-auto border border-[var(--border)] rounded-2xl bg-[var(--surface)]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[var(--primary)] border-b border-[var(--border)] text-[var(--text-muted)] uppercase tracking-wider">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-[var(--text-muted)]">No orders placed yet.</td>
                  </tr>
                ) : (
                  orders.map(o => (
                    <tr key={o.id} className="hover:bg-[var(--primary)]/40 transition-colors">
                      <td className="p-4 font-bold text-[var(--accent)]">#{o.id}</td>
                      <td className="p-4">
                        <span className="block font-bold">{o.customerInfo?.name || 'Guest'}</span>
                        <span className="text-[10px] text-[var(--text-muted)]">{o.customerInfo?.email}</span>
                      </td>
                      <td className="p-4">{o.items?.length || 0} items</td>
                      <td className="p-4 font-bold">${o.total}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30">
                          {o.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          className="bg-[var(--primary)] border border-[var(--border)] rounded-lg px-2 py-1 text-xs text-[var(--text)] outline-none"
                        >
                          {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(st => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="overflow-x-auto border border-[var(--border)] rounded-2xl bg-[var(--surface)]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[var(--primary)] border-b border-[var(--border)] text-[var(--text-muted)] uppercase tracking-wider">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {usersList.map(u => (
                  <tr key={u.id} className="hover:bg-[var(--primary)]/40 transition-colors">
                    <td className="p-4 font-bold">{u.name}</td>
                    <td className="p-4 text-[var(--text-muted)]">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                        u.role === 'admin' ? 'bg-[var(--accent-2)]/20 text-[var(--accent-2)] border border-[var(--accent-2)]/30' : 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-[var(--text-muted)]">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-[var(--text-muted)] border border-[var(--border)] rounded-2xl bg-[var(--surface)] font-mono text-xs">
                No customer messages submitted yet.
              </div>
            ) : (
              messages.map(m => (
                <div key={m.id} className="p-5 border border-[var(--border)] rounded-2xl bg-[var(--surface)] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-xs">
                      <span className="font-bold text-[var(--text)]">{m.name}</span>
                      <span className="text-[var(--text-muted)] ml-2">({m.email})</span>
                    </div>
                    <span className="font-mono text-[10px] text-[var(--text-muted)]">
                      {new Date(m.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-[var(--accent)]">{m.subject}</h4>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">{m.message}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
            <h3 className="text-lg font-bold font-mono uppercase">Add New Catalogue Item</h3>
            <form onSubmit={handleAddProduct} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-[var(--text-muted)] mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--primary)] border border-[var(--border)] text-[var(--text)] outline-none"
                  placeholder="e.g. Nextron Pulse Cyberdeck"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-muted)] mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--primary)] border border-[var(--border)] text-[var(--text)] outline-none uppercase"
                  >
                    <option value="audio">Audio</option>
                    <option value="wearables">Wearables</option>
                    <option value="computing">Computing</option>
                    <option value="gaming">Gaming</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[var(--text-muted)] mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProduct.price}
                    onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--primary)] border border-[var(--border)] text-[var(--text)] outline-none"
                    placeholder="299.99"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-muted)] mb-1">Stock Units</label>
                  <input
                    type="number"
                    required
                    value={newProduct.stock}
                    onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--primary)] border border-[var(--border)] text-[var(--text)] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-muted)] mb-1">Image URL</label>
                  <input
                    type="url"
                    required
                    value={newProduct.image}
                    onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--primary)] border border-[var(--border)] text-[var(--text)] outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[var(--text-muted)] mb-1">Description</label>
                <textarea
                  required
                  rows="3"
                  value={newProduct.description}
                  onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--primary)] border border-[var(--border)] text-[var(--text)] outline-none"
                  placeholder="Futuristic next-generation hardware..."
                />
              </div>
              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProduct.trending}
                    onChange={e => setNewProduct({ ...newProduct, trending: e.target.checked })}
                    className="accent-[var(--accent)]"
                  />
                  <span>Trending</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProduct.featured}
                    onChange={e => setNewProduct({ ...newProduct, featured: e.target.checked })}
                    className="accent-[var(--accent)]"
                  />
                  <span>Featured Drop</span>
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-black bg-[var(--accent)] hover:opacity-90"
                >
                  Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
