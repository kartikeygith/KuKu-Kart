import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="luxury-footer">
      <div className="footer-top container">
        <div className="footer-brand">
          <h2 className="footer-logo">KUKU KART</h2>
          <p className="footer-tagline">Precision. Exclusivity. Performance.</p>
        </div>

        <div className="footer-links-grid">
          <div className="footer-col">
            <h4>EXPLORE</h4>
            <ul>
              <li><Link to="/products">New Collection</Link></li>
              <li><Link to="/products">Timepieces</Link></li>
              <li><Link to="/products">Acoustics</Link></li>
              <li><Link to="/products">Technology</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>CLIENT SERVICES</h4>
            <ul>
              <li><Link to="/orders">Track My Order</Link></li>
              <li><Link to="/wishlist">My Wishlist</Link></li>
              <li><Link to="/login">Account Access</Link></li>
              <li><a href="#">Return Policy</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>INFORMATION</h4>
            <ul>
              <li><a href="#">About KuKu Kart</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><Link to="/admin">Seller Dashboard</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>CONTACT</h4>
            <ul>
              <li><a href="mailto:support@kukukart.com">support@kukukart.com</a></li>
              <li><a href="#">+91 1800-KU-KART</a></li>
              <li><a href="#">Live Chat</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom container flex justify-between items-center">
        <p className="copyright">© 2026 KuKu Kart. All rights reserved.</p>
        <div className="payment-badges flex gap-3">
          <span className="pay-badge">UPI</span>
          <span className="pay-badge">VISA</span>
          <span className="pay-badge">MASTERCARD</span>
          <span className="pay-badge">COD</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
