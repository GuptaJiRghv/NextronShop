import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { validateEmailDomain } from '../../utils/emailValidator';

const Login = () => {
    const { login, user } = useStore();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect if already logged in
    React.useEffect(() => {
        if (user) navigate('/');
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Email and password are required.');
            return;
        }

        setLoading(true);
        const result = await login(email, password);
        setLoading(false);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 pt-20">
            <div className="w-full max-w-md">
                {/* Background glow */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[var(--accent)] opacity-[0.04] rounded-full blur-[150px]" />
                </div>

                <div className="relative bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
                    <div className="text-center mb-8">
                        <Link to="/" className="text-3xl font-black tracking-tighter inline-block mb-2">
                            NEXTRON<span className="text-[var(--accent)]">.</span>
                        </Link>
                        <h1 className="text-xl font-bold">Welcome back</h1>
                        <p className="text-sm text-[var(--text-muted)] mt-1">Log in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs font-mono text-[var(--text-muted)] mb-1 block">EMAIL</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@gmail.com"
                                className="w-full bg-[var(--primary)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm font-mono focus:border-[var(--accent)] transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-mono text-[var(--text-muted)] mb-1 block">PASSWORD</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full bg-[var(--primary)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm font-mono focus:border-[var(--accent)] transition-colors"
                            />
                        </div>

                        {error && (
                            <p className="text-[var(--accent-2)] text-sm font-mono">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-3 rounded-full font-bold text-sm"
                        >
                            {loading ? 'LOGGING IN...' : 'LOGIN'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-[var(--text-muted)]">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-[var(--accent)] font-bold hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </div>

                    {/* Demo credentials */}
                    <div className="mt-6 pt-6 border-t border-[var(--border)]">
                        <p className="text-xs font-mono text-[var(--text-muted)] text-center mb-2">DEMO CREDENTIALS</p>
                        <div className="bg-[var(--primary)] rounded-lg p-3 text-xs font-mono space-y-1">
                            <p><span className="text-[var(--text-muted)]">Admin:</span> admin@nextron.com / admin</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
