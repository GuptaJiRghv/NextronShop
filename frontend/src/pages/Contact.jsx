import React, { useState } from 'react';
import { Mail, MessageSquare, Terminal, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { validateEmailDomain } from '../utils/emailValidator';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    const emailCheck = validateEmailDomain(formData.email);
    if (!emailCheck.valid) {
      setStatus({ loading: false, success: false, error: emailCheck.message });
      return;
    }

    try {
      const res = await api.post('/support/contact', formData, { auth: false });
      if (res.ok) {
        setStatus({ loading: false, success: true, error: null });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({ loading: false, success: false, error: res.data?.message || 'Failed to dispatch transmission.' });
      }
    } catch {
      setStatus({ loading: false, success: false, error: 'Network error communicating with Nextron Relay.' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 mb-4">
          <Terminal className="w-3.5 h-3.5" />
          Direct Dispatch Uplink
        </span>
        <h1 className="text-4xl sm:text-5xl font-black font-mono tracking-tight uppercase mb-4">
          CONTACT SUPPORT
        </h1>
        <p className="text-[var(--text-muted)] text-sm sm:text-base">
          Have an inquiry, custom procurement request, or technical feedback? Establish a direct comms link with our engineering crew.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
            <h3 className="font-mono text-xs uppercase font-bold text-[var(--accent)] tracking-wider">Communication Channels</h3>
            
            <div className="flex items-start gap-4 pt-2">
              <div className="p-3 rounded-xl bg-[var(--primary)] border border-[var(--border)] text-[var(--accent)]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono text-[var(--text-muted)] block">Electronic Mail</span>
                <span className="text-sm font-bold text-[var(--text)]">support@nextron.io</span>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Average response: &lt; 2 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-4 pt-2">
              <div className="p-3 rounded-xl bg-[var(--primary)] border border-[var(--border)] text-[var(--accent)]">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono text-[var(--text-muted)] block">Discord Community</span>
                <span className="text-sm font-bold text-[var(--text)]">discord.gg/nextron-cyber</span>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">24/7 Peer & Staff Support</p>
              </div>
            </div>

            <div className="flex items-start gap-4 pt-2">
              <div className="p-3 rounded-xl bg-[var(--primary)] border border-[var(--border)] text-[var(--accent)]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono text-[var(--text-muted)] block">Node Headquarters</span>
                <span className="text-sm font-bold text-[var(--text)]">Sector 7-G Cyber Hub</span>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">San Francisco, CA / Neo-Tokyo</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
            <h3 className="font-mono text-xs uppercase font-bold text-[var(--text)] mb-2">Need Instant Answers?</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
              Explore our comprehensive knowledgebase covering shipping timelines, warranty coverage, and device firmware updates.
            </p>
            <a
              href="/faq"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--accent)] hover:underline uppercase"
            >
              Read Knowledgebase FAQs &rarr;
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl relative overflow-hidden">
            {status.success ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-[var(--accent)] mx-auto animate-pulse" />
                <h3 className="text-2xl font-bold font-mono uppercase tracking-tight">Transmission Received</h3>
                <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto">
                  Your message has been logged to the Nextron Support queue. Our operators will respond via your provided email shortly.
                </p>
                <button
                  onClick={() => setStatus({ loading: false, success: false, error: null })}
                  className="mt-4 px-6 py-2.5 rounded-xl text-xs font-mono font-bold uppercase text-black bg-[var(--accent)] hover:opacity-90"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 font-mono text-xs">
                {status.error && (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{status.error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[var(--text-muted)] uppercase tracking-wider mb-2">Operator Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alex Mercer"
                      className="w-full px-4 py-3 rounded-xl bg-[var(--primary)] border border-[var(--border)] text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[var(--text-muted)] uppercase tracking-wider mb-2">Comms Address (Email)</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alex@domain.com"
                      className="w-full px-4 py-3 rounded-xl bg-[var(--primary)] border border-[var(--border)] text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[var(--text-muted)] uppercase tracking-wider mb-2">Subject Header</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Order #1042 Delivery Inquiry"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--primary)] border border-[var(--border)] text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[var(--text-muted)] uppercase tracking-wider mb-2">Transmission Body</label>
                  <textarea
                    required
                    rows="5"
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide full details regarding your question or order..."
                    className="w-full px-4 py-3 rounded-xl bg-[var(--primary)] border border-[var(--border)] text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status.loading}
                  className="w-full py-3.5 px-6 rounded-xl font-bold font-mono text-xs uppercase tracking-wider text-black bg-[var(--accent)] hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  {status.loading ? (
                    'Transmitting Packet...'
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Dispatch Transmission
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
