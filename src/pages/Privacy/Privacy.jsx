import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';
import './Privacy.css';

const Privacy = () => {
  return (
    <div className="privacy-page-container container">
      {/* Header */}
      <div className="privacy-header pb-4 border-b border-border mb-8">
        <span className="text-xs text-accent tracking-widest uppercase flex items-center gap-1 font-semibold">
          <ShieldCheck size={14} /> TRUST & LEGAL STANDARDS
        </span>
        <h1 className="privacy-title mt-1">PRIVACY & DATA POLICY</h1>
        <p className="text-xs text-muted mt-1">
          Effective Date: August 2026 • Compliant with Indian IT Act 2000 and Digital Personal Data Protection Act (DPDPA)
        </p>
      </div>

      <div className="privacy-content max-w-4xl mx-auto flex-col gap-8 text-xs leading-relaxed text-muted">
        
        {/* Section 1 */}
        <div className="privacy-card p-6 border border-border bg-surface">
          <h2 className="section-heading text-sm font-heading tracking-wider text-white mb-3 flex items-center gap-2">
            <Lock size={16} color="var(--color-accent)" /> 1. COMMITMENT TO DATA PRIVACY
          </h2>
          <p className="mb-2">
            At <strong>KuKu Kart India Private Limited</strong> (&quot;KuKu Kart&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), protecting our clients&apos; private personal information is a foundational pillar of our bespoke commerce experience. We do not monetize, rent, or sell your identifiable information to any third parties.
          </p>
          <p>
            This Privacy Policy explains how we collect, process, store, and safeguard your data when you visit our website, register a client suite account, place an order, or communicate with our concierge desk.
          </p>
        </div>

        {/* Section 2 */}
        <div className="privacy-card p-6 border border-border bg-surface">
          <h2 className="section-heading text-sm font-heading tracking-wider text-white mb-3 flex items-center gap-2">
            <FileText size={16} color="var(--color-accent)" /> 2. INFORMATION WE COLLECT
          </h2>
          <ul className="list-disc pl-5 flex-col gap-2">
            <li>
              <strong className="text-white">Account & Identification Data:</strong> Full name, verified email address, contact telephone number, and encrypted password credentials.
            </li>
            <li>
              <strong className="text-white">Shipping & Delivery Details:</strong> Physical delivery addresses, residential landmarks, PIN codes, and city designations necessary for white-glove courier fulfillment.
            </li>
            <li>
              <strong className="text-white">Transaction & Payment Records:</strong> Order summaries, selected payment mode (UPI, Net Banking, Credit/Debit Card, or Cash on Delivery), and Razorpay transaction references. <em>Note: KuKu Kart never stores raw debit/credit card numbers or CVVs on our servers. All online payments are handled directly by PCI-DSS compliant gateways.</em>
            </li>
            <li>
              <strong className="text-white">Device & Interaction Analytics:</strong> Browser type, operating system default theme preferences (Dark Mode / Light Mode), and diagnostic crash logs to maintain flawless application uptime.
            </li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="privacy-card p-6 border border-border bg-surface">
          <h2 className="section-heading text-sm font-heading tracking-wider text-white mb-3 flex items-center gap-2">
            <Eye size={16} color="var(--color-accent)" /> 3. PURPOSE OF DATA USAGE
          </h2>
          <p className="mb-2">We utilize collected customer data strictly for the following operational objectives:</p>
          <div className="grid-2 gap-3 mt-3">
            <div className="p-3 border border-border bg-bg flex items-start gap-2">
              <CheckCircle2 size={16} className="text-success shrink-0 mt-0.5" />
              <span>Order fulfillment, packaging, automated AWB generation, and doorstep courier tracking updates.</span>
            </div>
            <div className="p-3 border border-border bg-bg flex items-start gap-2">
              <CheckCircle2 size={16} className="text-success shrink-0 mt-0.5" />
              <span>Identity verification, fraud prevention, and COD captcha confirmation security checks.</span>
            </div>
            <div className="p-3 border border-border bg-bg flex items-start gap-2">
              <CheckCircle2 size={16} className="text-success shrink-0 mt-0.5" />
              <span>Client concierge assistance, return ticket resolution, and GST invoice delivery.</span>
            </div>
            <div className="p-3 border border-border bg-bg flex items-start gap-2">
              <CheckCircle2 size={16} className="text-success shrink-0 mt-0.5" />
              <span>Device preference synchronization (Dark/Light aesthetic themes and saved cart bag items).</span>
            </div>
          </div>
        </div>

        {/* Section 4 */}
        <div className="privacy-card p-6 border border-border bg-surface">
          <h2 className="section-heading text-sm font-heading tracking-wider text-white mb-3">
            4. DATA PROTECTION & 256-BIT ENCRYPTION
          </h2>
          <p className="mb-2">
            All client interactions across KuKu Kart are encrypted in transit using industry-standard <strong>Transport Layer Security (TLS 1.3 / 256-bit SSL)</strong>.
          </p>
          <p>
            User authentication sessions are securely signed and verified cryptographically via Supabase Postgres Row-Level Security (RLS), guaranteeing that customers can access only their own individual order archives and personal profile data.
          </p>
        </div>

        {/* Section 5 */}
        <div className="privacy-card p-6 border border-border bg-surface">
          <h2 className="section-heading text-sm font-heading tracking-wider text-white mb-3">
            5. YOUR RIGHTS & DATA CONTROL
          </h2>
          <p className="mb-3">Under Indian digital privacy laws, you possess comprehensive rights over your personal data:</p>
          <ul className="list-disc pl-5 flex-col gap-1">
            <li>Right to access and review your complete profile data via the Client Suite.</li>
            <li>Right to update or rectify inaccurate mobile numbers, names, or addresses.</li>
            <li>Right to request complete account and data erasure by contacting our concierge desk.</li>
          </ul>
        </div>

        {/* Section 6 */}
        <div className="privacy-card p-6 border border-border bg-surface">
          <h2 className="section-heading text-sm font-heading tracking-wider text-white mb-3">
            6. PRIVACY OFFICER & CONTACT
          </h2>
          <p className="mb-2">
            For questions, data access requests, or grievance redressal, please contact our designated Grievance Officer:
          </p>
          <div className="p-4 border border-border bg-bg flex-col gap-1 text-white">
            <strong>Grievance & Privacy Officer</strong>
            <span className="text-muted">KuKu Kart India Private Limited</span>
            <span className="text-muted">Email: <strong>privacy@kukukart.in</strong></span>
            <span className="text-muted">Concierge Desk: <strong>+91 98765 43210</strong></span>
            <span className="text-muted">Headquarters: Connaught Place, New Delhi, India - 110001</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Privacy;
