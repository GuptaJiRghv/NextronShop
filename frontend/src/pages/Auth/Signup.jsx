import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { validateEmailDomain } from '../../utils/emailValidator';
import { Eye, EyeOff, AlertCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import AuthShowcase from './AuthShowcase';

const GoogleIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.15C3.25 21.36 7.31 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.27C.46 8.2.005 10.04.005 12c0 1.96.455 3.8 1.265 5.42l4.01-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.64 1.27 6.58l4.01 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

const Signup = () => {
  const { signup, user } = useStore();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthNotice, setOauthNotice] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setOauthNotice('');

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

    if (!agreeTerms) {
      setError('You must agree to the Terms of Service to create an account.');
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

  const handleGoogleSignUp = () => {
    setOauthNotice('Google Authentication is ready. Complete the form below to register your Omnyx operative profile.');
  };

  return (
    <div className="min-h-screen w-full bg-[#080808] text-[#E5E5E5] flex flex-col lg:flex-row font-sans selection:bg-amber-400 selection:text-black">
      {/* ── LEFT COLUMN: OMNYX SHOWCASE (52% on desktop) ────────────────── */}
      <div className="w-full lg:w-[52%] xl:w-[55%] h-[420px] sm:h-[480px] lg:h-auto lg:min-h-screen relative flex-shrink-0">
        <AuthShowcase />
      </div>

      {/* ── RIGHT COLUMN: SIGNUP FORM (48% on desktop) ────────────────────── */}
      <div className="w-full lg:w-[48%] xl:w-[45%] flex flex-col justify-center items-center px-6 py-10 sm:px-10 lg:px-16 min-h-screen bg-[#0D0D0D] border-t lg:border-t-0 lg:border-l border-white/10 relative">
        {/* Glow backdrop accent */}
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-md w-full space-y-6 relative z-10">
          {/* Header */}
          <div className="space-y-1.5">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Create an Account
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">
              Sign up to unlock the Omnyx collective, member drops, and order tracking.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-300 block">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Input your full name"
                className="w-full px-4 py-3 rounded-2xl bg-[#141414] border border-white/10 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-mono"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-300 block">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Input your email"
                className="w-full px-4 py-3 rounded-2xl bg-[#141414] border border-white/10 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-mono"
              />
              <p className="text-[10px] text-gray-500 font-mono">
                Accepted: Gmail, Outlook, Hotmail, Live, Yahoo, iCloud
              </p>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-300 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-4 py-3 pr-12 rounded-2xl bg-[#141414] border border-white/10 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-300 block">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full px-4 py-3 pr-12 rounded-2xl bg-[#141414] border border-white/10 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms Agreement Checkbox */}
            <div className="pt-1 text-xs">
              <label className="flex items-start gap-2 cursor-pointer select-none text-gray-400 hover:text-gray-200 transition-colors">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#181818] border-white/20 text-amber-400 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-amber-400 mt-0.5"
                />
                <span className="text-[11px] leading-relaxed">
                  I agree to the <Link to="/terms" className="text-amber-400 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-amber-400 hover:underline">Privacy Policy</Link>.
                </span>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* OAuth notice */}
            {oauthNotice && (
              <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span>{oauthNotice}</span>
              </div>
            )}

            {/* Primary Signup CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-2xl font-black uppercase tracking-wider text-black bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:opacity-95 active:scale-[0.99] transition-all shadow-lg shadow-amber-500/20 text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  CREATING PROFILE...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center pt-0.5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative px-4 bg-[#0D0D0D] text-[11px] uppercase tracking-wider text-gray-500 font-bold">
              Or continue with:
            </div>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="w-full py-3 px-4 rounded-2xl font-bold border border-white/15 bg-white/5 hover:bg-white/10 text-white transition-all flex items-center justify-center gap-3 text-sm active:scale-[0.99] cursor-pointer"
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>

          {/* Switch to Login */}
          <div className="text-center pt-1">
            <p className="text-xs sm:text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-amber-400 font-bold hover:underline transition-colors">
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
