import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  CheckCircle, 
  Send, 
  HelpCircle,
  Headphones
} from 'lucide-react';
import './Contact.css';

const FAQS = [
  {
    q: 'What payment methods do you accept?',
    a: 'We support all major Indian payment methods through official Razorpay checkout: UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, Mastercard, RuPay, Amex), Net Banking across 50+ banks, and Cash on Delivery (COD).'
  },
  {
    q: 'How fast is delivery?',
    a: 'Metropolitan cities (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata) receive express delivery within 24-48 hours. Other cities across India receive orders in 2-4 business days.'
  },
  {
    q: 'Is Cash on Delivery (COD) available everywhere?',
    a: 'Yes! COD is supported across 19,000+ Indian postal PIN codes without any additional surcharge.'
  },
  {
    q: 'How can I track my order?',
    a: 'You can visit the "Orders" page anytime from the navigation bar. Once your order is shipped, you will see real-time updates and the courier tracking AWB link.'
  },
  {
    q: 'What is your return & exchange policy?',
    a: 'We offer an easy 15-day return and exchange guarantee. If you are not completely satisfied, our concierge courier will arrange a doorstep pickup at no cost to you.'
  }
];

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="contact-page-container container">
      
      {/* Header */}
      <div className="contact-header text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs text-accent tracking-widest uppercase font-bold flex items-center justify-center gap-2 mb-2">
          <Headphones size={14} /> 24/7 CLIENT CONCIERGE & SUPPORT
        </span>
        <h1 className="contact-title text-3xl font-heading text-white">WE ARE AT YOUR SERVICE</h1>
        <p className="text-xs text-muted mt-2">
          Have an inquiry about an order, bespoke styling, or payment options? Reach out to our dedicated support team in India.
        </p>
      </div>

      <div className="contact-layout-grid flex gap-12 mb-16">
        
        {/* Left: Contact Channels */}
        <div className="contact-info-column flex-col flex-1 gap-6">
          
          <div className="contact-card p-6 border border-border bg-surface rounded">
            <h3 className="text-xs font-heading tracking-widest text-white pb-3 border-b border-border mb-4 flex items-center gap-2">
              <Mail size={16} color="var(--color-accent)" /> DIRECT SUPPORT CHANNELS
            </h3>

            <div className="flex-col gap-4 text-xs">
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-accent mt-0.5" />
                <div>
                  <strong className="text-white block">Email Support</strong>
                  <a href="mailto:concierge@kukukart.in" className="text-muted hover:text-accent">
                    concierge@kukukart.in
                  </a>
                  <span className="text-10 text-muted block mt-0.5">Average response time: &lt; 2 hours</span>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-border">
                <Phone size={18} className="text-accent mt-0.5" />
                <div>
                  <strong className="text-white block">Phone & WhatsApp Support</strong>
                  <span className="text-white font-mono block">+91 98765 43210 / 1800-KUKU-KART</span>
                  <span className="text-10 text-muted block mt-0.5">Toll-Free All India (10:00 AM – 8:00 PM IST)</span>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-border">
                <Clock size={18} className="text-accent mt-0.5" />
                <div>
                  <strong className="text-white block">Business Hours</strong>
                  <span className="text-muted block">Monday – Saturday: 9:30 AM to 8:30 PM IST</span>
                  <span className="text-muted block">Sunday: 10:00 AM to 5:00 PM IST</span>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-border">
                <MapPin size={18} className="text-accent mt-0.5" />
                <div>
                  <strong className="text-white block">Registered Headquarters</strong>
                  <span className="text-muted block">KuKu Kart India Private Limited</span>
                  <span className="text-muted block">Barakhamba Road, Connaught Place, New Delhi - 110001</span>
                </div>
              </div>
            </div>
          </div>

          <div className="trust-box p-5 border border-border bg-surface rounded text-xs flex items-center gap-3">
            <ShieldCheck size={28} color="var(--color-accent)" />
            <div>
              <strong className="text-white block">100% Client Satisfaction Guaranteed</strong>
              <span className="text-10 text-muted">All inquiries are handled by dedicated senior shopping advisors.</span>
            </div>
          </div>

        </div>

        {/* Right: Message Form */}
        <div className="contact-form-column flex-1">
          <div className="contact-form-card p-8 border border-border bg-surface rounded">
            <h3 className="text-xs font-heading tracking-widest text-white pb-3 border-b border-border mb-6">
              SEND US A MESSAGE
            </h3>

            {submitted ? (
              <div className="p-6 border border-success bg-bg text-center rounded flex-col items-center">
                <CheckCircle size={32} color="#00c851" className="mb-2" />
                <strong className="text-white text-sm block">MESSAGE DELIVERED TO CONCIERGE</strong>
                <p className="text-xs text-muted mt-1">
                  Thank you for contacting us. One of our specialists will respond via email or phone within 2 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex-col gap-4 text-xs">
                <div className="flex gap-4">
                  <div className="form-group flex-1 flex-col">
                    <label className="text-accent mb-1 font-bold">YOUR NAME *</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="e.g. Kartikey Sharma"
                      required 
                      className="p-3 bg-bg border border-border text-white text-xs rounded"
                    />
                  </div>
                  <div className="form-group flex-1 flex-col">
                    <label className="text-accent mb-1 font-bold">MOBILE NUMBER *</label>
                    <input 
                      type="tel" 
                      maxLength="10"
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} 
                      placeholder="9876543210"
                      required 
                      className="p-3 bg-bg border border-border text-white text-xs rounded font-mono"
                    />
                  </div>
                </div>

                <div className="form-group flex-col">
                  <label className="text-accent mb-1 font-bold">EMAIL ADDRESS *</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="client@gmail.com"
                    required 
                    className="p-3 bg-bg border border-border text-white text-xs rounded"
                  />
                </div>

                <div className="form-group flex-col">
                  <label className="text-accent mb-1 font-bold">SUBJECT</label>
                  <select 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)} 
                    className="p-3 bg-bg border border-border text-white text-xs rounded"
                  >
                    <option value="Order Tracking">Order Status & Delivery Inquiries</option>
                    <option value="Product Details">Product Specification / Sizing Help</option>
                    <option value="Payment Question">Payment & Razorpay Gateway Assistance</option>
                    <option value="Returns">Returns, Refunds & Exchanges</option>
                    <option value="General">Other Concierge Requests</option>
                  </select>
                </div>

                <div className="form-group flex-col">
                  <label className="text-accent mb-1 font-bold">MESSAGE *</label>
                  <textarea 
                    rows="5" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    placeholder="Please provide details about your inquiry..."
                    required 
                    className="p-3 bg-bg border border-border text-white text-xs rounded"
                  />
                </div>

                <button type="submit" className="btn-primary py-3.5 font-bold tracking-widest flex items-center justify-center gap-2">
                  <Send size={15} /> SEND CONCIERGE MESSAGE
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

      {/* FAQ Accordion Section */}
      <section className="faq-section py-12 border-t border-border">
        <h2 className="section-heading text-center mb-8">FREQUENTLY ASKED QUESTIONS</h2>
        <div className="faq-list max-w-3xl mx-auto flex-col gap-3">
          {FAQS.map((faq, i) => (
            <div 
              key={i} 
              className="faq-item p-4 border border-border bg-surface rounded cursor-pointer transition-all"
              onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
            >
              <div className="flex justify-between items-center text-xs font-bold text-white">
                <span className="flex items-center gap-2">
                  <HelpCircle size={15} color="var(--color-accent)" /> {faq.q}
                </span>
                <span className="text-accent text-sm font-mono">{openFaq === i ? '−' : '+'}</span>
              </div>
              {openFaq === i && (
                <p className="text-xs text-muted mt-3 pt-3 border-t border-border leading-relaxed">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Contact;
