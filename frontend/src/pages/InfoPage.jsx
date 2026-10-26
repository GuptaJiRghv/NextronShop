import React from 'react';
import { HelpCircle, Truck, Shield, Lock, FileText, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CONTENT = {
  faq: {
    title: 'Frequently Asked Questions',
    subtitle: 'Everything you need to know about Nextron hardware, orders, and protocols.',
    icon: HelpCircle,
    sections: [
      {
        q: 'What is Nextron Cybernetics?',
        a: 'Nextron is a bleeding-edge lifestyle & tech ecosystem creating custom mechanical interfaces, high-fidelity neural audio headsets, and portable cyberdecks for modern digital nomads.'
      },
      {
        q: 'How fast is dispatch and shipping?',
        a: 'Standard orders are dispatched within 24 hours. Express global air shipping takes 2-4 business days depending on your destination node.'
      },
      {
        q: 'Can I cancel or alter an order after checkout?',
        a: 'Orders enter our fulfillment queue immediately. If your order status is still "Pending", you can contact support to modify or cancel it.'
      },
      {
        q: 'Are custom firmware and open-source schematics supported?',
        a: 'Yes! Nextron products feature open APIs and unlockable bootloaders for approved developer hardware kits.'
      }
    ]
  },
  shipping: {
    title: 'Shipping & Delivery Protocols',
    subtitle: 'Global logistics network and encrypted dispatch information.',
    icon: Truck,
    sections: [
      {
        q: 'Worldwide Delivery Nodes',
        a: 'We ship to over 140 countries using carbon-offset express couriers with end-to-end telemetry and parcel tracking.'
      },
      {
        q: 'Customs, Duties & Taxes',
        a: 'All applicable import duties and VAT are calculated upfront at checkout so there are no unexpected customs delays.'
      },
      {
        q: 'Tracking Your Transmission',
        a: 'Upon dispatch, a tracking link is generated and pinned directly to your user profile and emailed to your address.'
      }
    ]
  },
  warranty: {
    title: 'Hardware Warranty & Replacement',
    subtitle: '2-Year Full Hardware Coverage on all Nextron core units.',
    icon: Shield,
    sections: [
      {
        q: 'Standard 24-Month Guarantee',
        a: 'Every retail unit is protected against manufacturing defects, internal component failures, and circuit anomalies for 24 continuous months.'
      },
      {
        q: 'Nextron Replacement Program',
        a: 'If a verified hardware fault occurs, we issue an advance replacement unit within 48 hours of ticket validation.'
      },
      {
        q: 'RMA Protocol',
        a: 'To initiate a return or warranty claim, submit a ticket via our Contact portal with your order identifier.'
      }
    ]
  },
  privacy: {
    title: 'Privacy & Data Encryption',
    subtitle: 'Zero-knowledge principles and minimal digital footprint.',
    icon: Lock,
    sections: [
      {
        q: 'Data Collection Policy',
        a: 'Nextron collects only essential telemetry and authentication data necessary to execute and fulfill your orders.'
      },
      {
        q: 'Third-Party Tracking',
        a: 'We do not sell, rent, or trade your personal data with third-party advertising exchanges. Ever.'
      },
      {
        q: 'Data Erasure Requests',
        a: 'You can request full deletion of your user account, cart states, and historical data at any time via support.'
      }
    ]
  },
  terms: {
    title: 'Terms of Service',
    subtitle: 'Operational regulations and usage agreements.',
    icon: FileText,
    sections: [
      {
        q: 'Account Integrity',
        a: 'Operators are responsible for maintaining confidentiality of credentials and all activities occurring under their identifier.'
      },
      {
        q: 'Catalogue Pricing & Availability',
        a: 'All prices are displayed in USD. Nextron reserves the right to adjust catalogue availability and promotional drops without prior notice.'
      },
      {
        q: 'Intellectual Property',
        a: 'All hardware designs, industrial aesthetics, and software architectures are proprietary assets of Nextron Technologies.'
      }
    ]
  }
};

const InfoPage = ({ pageKey = 'faq' }) => {
  const page = CONTENT[pageKey] || CONTENT.faq;
  const Icon = page.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-xl mx-auto mb-16">
        <div className="inline-flex p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-[var(--accent)] mb-4 shadow-lg shadow-[var(--accent)]/10">
          <Icon className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-mono tracking-tight uppercase mb-3">
          {page.title}
        </h1>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          {page.subtitle}
        </p>
      </div>

      <div className="space-y-4">
        {page.sections.map((sec, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-2 hover:border-[var(--accent)]/30 transition-colors"
          >
            <h3 className="font-mono text-sm font-bold text-[var(--text)] flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-[var(--accent)] flex-shrink-0" />
              {sec.q}
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed pl-6">
              {sec.a}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-16 p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-center space-y-3">
        <h4 className="font-mono text-sm font-bold uppercase">Still have questions?</h4>
        <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
          Our engineering support team is online and ready to assist with custom inquiries.
        </p>
        <Link
          to="/contact"
          className="inline-block mt-2 px-6 py-2.5 rounded-xl font-mono text-xs font-bold uppercase text-black bg-[var(--accent)] hover:opacity-90 transition-opacity"
        >
          Open Support Ticket
        </Link>
      </div>
    </div>
  );
};

export default InfoPage;
