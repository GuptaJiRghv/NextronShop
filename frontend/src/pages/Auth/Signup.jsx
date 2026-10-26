import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { validateEmailDomain } from '../../utils/emailValidator';

const Signup = () => {
    const { signup, user } = useStore();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (user) navigate('/');
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name || name.trim().length < 2) {
            setError('Name must be at least 2 characters.');
            return;
        }

        const domainCheck = validateEmailDomain(email);
        if (!domainCheck.valid) {
            setError(domainCheck.error);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        const result = await signup(email, password, name);
        setLoading(false);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.message || 'Signup failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 pt-20">
            <div className="w-full max-w-md">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[var(--accent-2)] opacity-[0.04] rounded-full blur-[150px]" />
                </div>

                <div className="relative bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
                    <div className="text-center mb-8">
                        <Link to="/" className="text-3xl font-black tracking-tighter inline-block mb-2">
                            NEXTRON<span className="text-[var(--accent)]">.</span>
                        </Link>
                        <h1 className="text-xl font-bold">Create your account</h1>
                        <p className="text-sm text-[var(--text-muted)] mt-1">Join the Nextron community</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs font-mono text-[var(--text-muted)] mb-1 block">FULL NAME</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                className="w-full bg-[var(--primary)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm font-mono focus:border-[var(--accent)] transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-mono text-[var(--text-muted)] mb-1 block">EMAIL</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@gmail.com"
                                className="w-full bg-[var(--primary)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm font-mono focus:border-[var(--accent)] transition-colors"
                            />
                            <p className="text-[10px] text-[var(--text-muted)] mt-1 font-mono">
                                Accepted: Gmail, Outlook, Hotmail, Live, Yahoo, iCloud
                            </p>
                        </div>
                        <div>
                            <label className="text-xs font-mono text-[var(--text-muted)] mb-1 block">PASSWORD</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Min 6 characters"
                                className="w-full bg-[var(--primary)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm font-mono focus:border-[var(--accent)] transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-mono text-[var(--text-muted)] mb-1 block">CONFIRM PASSWORD</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter password"
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
                            {loading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-[var(--text-muted)]">
                            Already have an account?{' '}
                            <Link to="/login" className="text-[var(--accent)] font-bold hover:underline">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
