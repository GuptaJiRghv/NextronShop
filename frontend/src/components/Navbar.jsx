import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { 
  User, ChevronDown, Package, Heart, ShieldCheck, 
  LogOut, LayoutDashboard 
} from 'lucide-react';

const navLinkClass = ({ isActive }) =>
    `hover:text-[var(--accent)] transition-colors ${isActive ? 'text-[var(--accent)]' : ''}`;

const Navbar = () => {
    const {
        cartCount, wishlist, orders, setIsCartOpen, setIsWishlistOpen,
        user, logout, theme, toggleTheme
    } = useStore();
    const [scrolled, setScrolled] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setProfileDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setProfileDropdownOpen(false);
        navigate('/');
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'navbar-blur' : ''}`}>
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-12">
                        <Link to="/" className="text-2xl font-black tracking-tighter cursor-pointer glitch">
                            OMNYX<span className="text-[var(--accent)]">.</span>
                        </Link>
                        <div className="hidden md:flex space-x-8 font-mono text-sm">
                            <NavLink to="/" end className={navLinkClass}>HOME</NavLink>
                            <NavLink to="/products" className={navLinkClass}>ALL PRODUCTS</NavLink>
                            <NavLink to="/trending" className={navLinkClass}>TRENDING</NavLink>
                            <NavLink to="/new-arrivals" className={navLinkClass}>NEW ARRIVALS</NavLink>
                            <NavLink to="/about" className={navLinkClass}>ABOUT</NavLink>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                {/* Small Profile Button on top */}
                                <button
                                    onClick={() => setProfileDropdownOpen(prev => !prev)}
                                    className={`flex items-center gap-2.5 py-1.5 px-3 rounded-full border transition-all ${
                                        profileDropdownOpen 
                                            ? 'border-[var(--accent)] bg-[var(--surface)] shadow-lg shadow-[var(--accent)]/15 text-[var(--accent)]' 
                                            : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/50 text-[var(--text)]'
                                    }`}
                                    title="Open User Menu"
                                >
                                    <div className="w-7 h-7 rounded-full bg-[var(--primary)] border border-[var(--accent)] flex items-center justify-center font-mono text-xs font-bold text-[var(--accent)]">
                                        {user.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <span className="text-xs font-mono font-bold tracking-tight hidden sm:inline-block">
                                        {user.name?.split(' ')[0]}
                                    </span>
                                    {orders?.length > 0 && (
                                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[var(--accent)]/20 text-[var(--accent)] font-bold hidden md:inline-block">
                                            {orders.length}
                                        </span>
                                    )}
                                    <ChevronDown className={`w-3.5 h-3.5 text-[var(--text-muted)] transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180 text-[var(--accent)]' : ''}`} />
                                </button>

                                {/* Profile Dropdown Menu */}
                                {profileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl p-4 font-mono text-xs z-50 backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150">
                                        {/* User Identity Header */}
                                        <div className="flex items-center gap-3 pb-3 border-b border-[var(--border)]">
                                            <div className="w-10 h-10 rounded-xl bg-[var(--primary)] border border-[var(--accent)] flex items-center justify-center text-sm font-black text-[var(--accent)]">
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="font-bold text-sm text-[var(--text)] truncate">{user.name}</p>
                                                <p className="text-[10px] text-[var(--text-muted)] truncate">{user.email}</p>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${
                                                        user.role === 'admin' 
                                                            ? 'bg-[var(--accent-2)]/20 text-[var(--accent-2)] border border-[var(--accent-2)]/30' 
                                                            : 'bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30'
                                                    }`}>
                                                        {user.role}
                                                    </span>
                                                    <span className="text-[9px] text-[var(--text-muted)]">
                                                        {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quick Links */}
                                        <div className="py-2 space-y-1">
                                            <Link
                                                to="/profile"
                                                onClick={() => setProfileDropdownOpen(false)}
                                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text)] hover:bg-[var(--primary)] hover:text-[var(--accent)] transition-colors"
                                            >
                                                <LayoutDashboard className="w-4 h-4 text-[var(--accent)]" />
                                                <div className="flex-1">
                                                    <span className="font-bold block">Dashboard & Orders</span>
                                                    <span className="text-[10px] text-[var(--text-muted)]">Inspect past carts & stats</span>
                                                </div>
                                            </Link>

                                            <button
                                                onClick={() => {
                                                    setProfileDropdownOpen(false);
                                                    setIsWishlistOpen(true);
                                                }}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--text)] hover:bg-[var(--primary)] hover:text-[var(--accent)] transition-colors text-left"
                                            >
                                                <Heart className="w-4 h-4 text-rose-400" />
                                                <div className="flex-1">
                                                    <span className="font-bold block">Saved Wishlist</span>
                                                    <span className="text-[10px] text-[var(--text-muted)]">{wishlist.length} item(s)</span>
                                                </div>
                                            </button>

                                            {user.role === 'admin' && (
                                                <Link
                                                    to="/admin"
                                                    onClick={() => setProfileDropdownOpen(false)}
                                                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[var(--accent)] bg-[var(--accent)]/10 hover:bg-[var(--accent)]/20 transition-colors"
                                                >
                                                    <ShieldCheck className="w-4 h-4" />
                                                    <div className="flex-1">
                                                        <span className="font-bold block">Admin Console</span>
                                                        <span className="text-[10px] text-[var(--text-muted)]">Manage store & inventory</span>
                                                    </div>
                                                </Link>
                                            )}
                                        </div>

                                        {/* Logout Button */}
                                        <div className="pt-2 border-t border-[var(--border)]">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors uppercase font-bold text-[11px]"
                                            >
                                                <LogOut className="w-3.5 h-3.5" />
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-sm font-mono hover:text-[var(--accent)] transition-colors">LOGIN</Link>
                                <Link to="/signup" className="text-sm font-mono btn-primary px-4 py-2 rounded-full text-[var(--primary)]">SIGNUP</Link>
                            </div>
                        )}

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            className="hover:text-[var(--accent)] transition-colors"
                        >
                            {theme === 'dark' ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="5" strokeWidth={2} strokeLinecap="round" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                                </svg>
                            )}
                        </button>

                        {/* Wishlist Icon */}
                        <button onClick={() => setIsWishlistOpen(true)} className="relative hover:text-[var(--accent)] transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {wishlist.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[var(--accent-2)] text-[var(--primary)] text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{wishlist.length}</span>
                            )}
                        </button>

                        {/* Cart Icon */}
                        <button onClick={() => setIsCartOpen(true)} className="relative hover:text-[var(--accent)] transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[var(--accent)] text-[var(--primary)] text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold badge-pulse">{cartCount}</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
