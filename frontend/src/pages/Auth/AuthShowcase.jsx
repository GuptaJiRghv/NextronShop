import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Zap, Globe, Sparkles } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    tag: 'Next-Gen Cybernetics',
    headline: 'Edit Smarter. Export Faster. Create Anywhere.',
    subtext: 'From neural gear to tactical electronics, our high-performance hardware empowers creators worldwide with speed and precision.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&auto=format&fit=crop&q=80',
    stat: '50k+ Operatives Active',
  },
  {
    id: 2,
    tag: 'Encrypted Commerce',
    headline: 'Real-Time Sync. 256-Bit Cryptographic Checkout.',
    subtext: 'Experience instant QR phone authorization, biometric clearance, and verified hardware serialization with zero lag.',
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1600&auto=format&fit=crop&q=80',
    stat: '99.9% Uptime Guarantee',
  },
  {
    id: 3,
    tag: 'Elite Member Drops',
    headline: 'Unlock Confidential Tiers. Exclusive Gear.',
    subtext: 'Get VIP early access to secret prototype batches, member-only discounts, and direct telemetry dispatch.',
    image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1600&auto=format&fit=crop&q=80',
    stat: 'Global Express Relay',
  },
];

const AuthShowcase = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <div className="relative w-full h-full min-h-[520px] lg:min-h-screen overflow-hidden flex flex-col justify-between p-6 sm:p-10 lg:p-14 text-white">
      {/* Background Images with smooth fade transition */}
      {SLIDES.map((s, idx) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
          }`}
          style={{ transition: 'opacity 1s ease-in-out, transform 8s ease-out' }}
        >
          <img
            src={s.image}
            alt={s.headline}
            className="w-full h-full object-cover object-center"
          />
          {/* Dual Gradient Vignette (matching the warm golden/amber skyscraper reference) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/35" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />
        </div>
      ))}

      {/* Top Navigation Bar inside showcase */}
      <div className="relative z-10 flex items-center justify-between">
        {/* Omnyx Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-amber-500 to-yellow-600 flex items-center justify-center text-black font-black text-xl shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
            O
          </div>
          <span className="text-2xl font-black tracking-tight text-white group-hover:text-amber-400 transition-colors">
            OMNYX<span className="text-amber-400">.</span>
          </span>
        </Link>

        {/* Back to Website Link (styled exactly like the reference screenshot) */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors tracking-wide group py-1.5 px-3 rounded-full bg-black/40 border border-amber-400/30 hover:border-amber-400/60 backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Website
        </Link>
      </div>

      {/* Center Subtle Cyber Badge */}
      <div className="relative z-10 hidden sm:block">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] uppercase font-bold tracking-widest bg-amber-400/10 text-amber-300 border border-amber-400/20 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          {slide.tag}
        </div>
      </div>

      {/* Bottom Content Area */}
      <div className="relative z-10 space-y-6 max-w-xl">
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.1]">
            {slide.headline}
          </h2>
          <p className="text-sm sm:text-base text-gray-200/90 leading-relaxed font-light">
            {slide.subtext}
          </p>
        </div>

        {/* Interactive Pagination Dots (matching reference) */}
        <div className="flex items-center gap-2.5 pt-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 transition-all duration-300 rounded-full ${
                idx === currentSlide
                  ? 'w-8 bg-amber-400 shadow-md shadow-amber-400/50'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}

          <span className="text-[11px] uppercase tracking-wider text-amber-400/90 font-mono font-bold ml-3 hidden sm:inline-block">
            {slide.stat}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthShowcase;
