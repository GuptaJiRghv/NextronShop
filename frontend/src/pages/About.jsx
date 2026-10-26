import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
    const stats = [
        { value: '10K+', label: 'Happy Customers' },
        { value: '500+', label: 'Products Sold' },
        { value: '4.9', label: 'Average Rating' },
        { value: '24/7', label: 'Support' },
    ];

    const team = [
        { name: 'Alex Chen', role: 'Founder & CEO', emoji: '🧑‍💻' },
        { name: 'Mira Patel', role: 'Head of Design', emoji: '🎨' },
        { name: 'James Rivera', role: 'Lead Engineer', emoji: '⚙️' },
        { name: 'Sophie Kim', role: 'Marketing Director', emoji: '📢' },
    ];

    return (
        <div className="min-h-screen pt-24 pb-24">
            <div className="max-w-7xl mx-auto px-6">
                {/* Hero */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <span className="font-mono text-xs text-[var(--accent)] tracking-widest">OUR STORY</span>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter mt-4 mb-6">
                        BUILT FOR <span className="text-[var(--accent)]">THE FUTURE</span>
                    </h1>
                    <p className="text-lg text-[var(--text-muted)] leading-relaxed">
                        NEXTRON was born from a simple idea: premium electronics shouldn't break the bank.
                        We curate the finest audio and tech products, bringing them directly to you without
                        the traditional retail markup.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 text-center">
                            <span className="text-3xl font-black text-[var(--accent)] font-mono">{stat.value}</span>
                            <p className="text-sm text-[var(--text-muted)] mt-1 font-mono">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Mission */}
                <div className="grid md:grid-cols-2 gap-16 mb-20 items-center">
                    <div>
                        <span className="font-mono text-xs text-[var(--accent)] tracking-widest">MISSION</span>
                        <h2 className="text-3xl font-black tracking-tighter mt-2 mb-4">
                            REDEFINING <span className="text-[var(--accent)]">ELECTRONICS</span>
                        </h2>
                        <p className="text-[var(--text-muted)] leading-relaxed mb-4">
                            We believe in the power of great sound and thoughtful technology. Every product
                            in our catalogue is tested and approved by our team of audio engineers and tech
                            enthusiasts.
                        </p>
                        <p className="text-[var(--text-muted)] leading-relaxed">
                            From our curated headphone selection to our precision gaming mice, we only carry
                            products that meet our exacting standards for quality, design, and performance.
                        </p>
                    </div>
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8">
                        <div className="space-y-4">
                            {['Premium Quality Materials', 'Rigorous Testing Process', 'Direct-to-Consumer Pricing', '2-Year Warranty on Everything', 'Free Returns within 30 Days'].map((item) => (
                                <div key={item} className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-[var(--accent)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-sm">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Team */}
                <div className="text-center mb-12">
                    <span className="font-mono text-xs text-[var(--accent)] tracking-widest">THE TEAM</span>
                    <h2 className="text-3xl font-black tracking-tighter mt-2">
                        MEET THE <span className="text-[var(--accent)]">CREATORS</span>
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
                    {team.map((member) => (
                        <div key={member.name} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 text-center hover:border-[var(--accent)] transition-colors">
                            <div className="text-4xl mb-3">{member.emoji}</div>
                            <h3 className="font-bold">{member.name}</h3>
                            <p className="text-sm text-[var(--text-muted)] font-mono">{member.role}</p>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-r from-[var(--surface)] to-transparent rounded-3xl border border-[var(--border)] p-12 text-center relative overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[var(--accent)] opacity-[0.04] rounded-full blur-[100px]" />
                    </div>
                    <h2 className="text-3xl font-black tracking-tighter mb-4 relative">
                        READY TO <span className="text-[var(--accent)]">UPGRADE</span>?
                    </h2>
                    <p className="text-[var(--text-muted)] mb-6 max-w-md mx-auto relative">
                        Join thousands of satisfied customers who made the switch to premium.
                    </p>
                    <Link to="/products" className="btn-primary px-8 py-4 rounded-full text-sm font-bold relative inline-block">
                        SHOP NOW
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default About;
