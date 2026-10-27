import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="border-t border-[var(--border)] mt-24">
            {/* Newsletter bar */}
            <div className="bg-[var(--surface)]">
                <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-bold mb-1">STAY IN THE <span className="text-[var(--accent)]">LOOP</span></h3>
                        <p className="text-sm text-[var(--text-muted)]">Get exclusive drops, deals, and tech news.</p>
                    </div>
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            const email = e.target.elements.email.value;
                            try {
                                await fetch('/api/support/newsletter', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ email }),
                                });
                                e.target.reset();
                            } catch { /* silent */ }
                        }}
                        className="flex w-full md:w-auto"
                    >
                        <input
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            required
                            className="flex-1 md:w-72 bg-[var(--primary)] border border-[var(--border)] rounded-l-full px-5 py-3 text-sm font-mono focus:border-[var(--accent)] transition-colors"
                        />
                        <button type="submit" className="btn-primary px-6 py-3 rounded-r-full text-sm font-bold whitespace-nowrap">
                            SUBSCRIBE
                        </button>
                    </form>
                </div>
            </div>

            {/* Main footer grid */}
            <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
                <div>
                    <h4 className="text-lg font-black tracking-tighter mb-4">OMNYX<span className="text-[var(--accent)]">.</span></h4>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                        Premium electronics for those who demand more. Built for the future.
                    </p>
                </div>
                <div>
                    <h5 className="font-mono text-xs text-[var(--text-muted)] mb-4 tracking-wider">SHOP</h5>
                    <ul className="space-y-2">
                        <li><Link to="/products" className="text-sm hover:text-[var(--accent)] transition-colors">All Products</Link></li>
                        <li><Link to="/trending" className="text-sm hover:text-[var(--accent)] transition-colors">Trending</Link></li>
                        <li><Link to="/new-arrivals" className="text-sm hover:text-[var(--accent)] transition-colors">New Arrivals</Link></li>
                        <li><Link to="/products?category=headphones" className="text-sm hover:text-[var(--accent)] transition-colors">Headphones</Link></li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-mono text-xs text-[var(--text-muted)] mb-4 tracking-wider">COMPANY</h5>
                    <ul className="space-y-2">
                        <li><Link to="/about" className="text-sm hover:text-[var(--accent)] transition-colors">About</Link></li>
                        <li><Link to="/contact" className="text-sm hover:text-[var(--accent)] transition-colors">Contact</Link></li>
                        <li><Link to="/faq" className="text-sm hover:text-[var(--accent)] transition-colors">FAQ</Link></li>
                        <li><Link to="/shipping" className="text-sm hover:text-[var(--accent)] transition-colors">Shipping</Link></li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-mono text-xs text-[var(--text-muted)] mb-4 tracking-wider">LEGAL</h5>
                    <ul className="space-y-2">
                        <li><Link to="/privacy" className="text-sm hover:text-[var(--accent)] transition-colors">Privacy Policy</Link></li>
                        <li><Link to="/terms" className="text-sm hover:text-[var(--accent)] transition-colors">Terms of Service</Link></li>
                        <li><Link to="/warranty" className="text-sm hover:text-[var(--accent)] transition-colors">Warranty</Link></li>
                    </ul>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-[var(--border)]">
                <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-[var(--text-muted)] font-mono">
                        © {new Date().getFullYear()} OMNYX. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        {['GitHub', 'Twitter', 'Discord'].map((s) => (
                            <span key={s} className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors cursor-pointer font-mono">{s}</span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
