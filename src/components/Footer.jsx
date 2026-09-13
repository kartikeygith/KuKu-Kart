import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Headphones, Lock } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="luxury-footer">
      <div className="footer-top container">
        <div className="footer-brand">
          <h2 className="footer-logo">KUKU KART</h2>
          <p className="footer-tagline">Excellence. Authenticity. Unrivaled E-Commerce.</p>
          <p className="text-xs text-muted max-w-sm mt-3">
            KuKu Kart is India's premier online destination for luxury couture, precision horology, audiophile acoustics, and curated living.
          </p>
        </div>

        <div className="footer-links-grid">
          <div className="footer-col">
            <h4>COLLECTIONS</h4>
            <ul>
              <li><Link to="/products?category=Men">Men's Fashion</Link></li>
              <li><Link to="/products?category=Women">Women's Haute Couture</Link></li>
              <li><Link to="/products?category=Electronics">Audiophile Electronics</Link></li>
              <li><Link to="/products?category=Accessories">Timepieces & Horology</Link></li>
              <li><Link to="/products?category=Footwear">Italian Footwear</Link></li>
              <li><Link to="/products?category=Grocery">Artisanal Gourmet</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>CLIENT CONCIERGE</h4>
            <ul>
              <li><Link to="/orders">Track My Order (AWB)</Link></li>
              <li><Link to="/wishlist">My Saved Wishlist</Link></li>
              <li><Link to="/profile">Saved Addresses</Link></li>
              <li><Link to="/contact">15-Day Return Policy</Link></li>
              <li><Link to="/contact">Express Shipping Policy</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>SECURITY & LEGAL</h4>
            <ul>
              <li><Link to="/contact">About KuKu Kart India</Link></li>
              <li><Link to="/contact">Privacy & Data Policy</Link></li>
              <li><Link to="/contact">Terms of Commerce</Link></li>
              <li><Link to="/admin">Executive Merchant Console</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>SUPPORT (INDIA)</h4>
            <ul>
              <li><Link to="/contact">concierge@kukukart.in</Link></li>
              <li><Link to="/contact">+91 98765 43210 (Toll Free)</Link></li>
              <li><Link to="/contact">Connaught Place, New Delhi</Link></li>
              <li><Link to="/contact">24/7 Client Help Desk</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom container flex justify-between items-center flex-wrap gap-4 pt-6 border-t border-border">
        <p className="copyright text-xs text-muted">
          © 2026 KuKu Kart India Private Limited. All Rights Reserved. Prices displayed in Indian Rupees (₹ INR).
        </p>
        <div className="payment-badges flex items-center gap-2 flex-wrap text-10">
          <span className="pay-badge font-bold text-accent">⚡ RAZORPAY</span>
          <span className="pay-badge font-bold">UPI</span>
          <span className="pay-badge">GPAY</span>
          <span className="pay-badge">PHONEPE</span>
          <span className="pay-badge">RUPAY</span>
          <span className="pay-badge">VISA</span>
          <span className="pay-badge">MASTERCARD</span>
          <span className="pay-badge font-bold text-success">COD AVAILABLE</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
