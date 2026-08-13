import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, Heart, Package } from 'lucide-react';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/products');
  };

  return (
    <header className={`luxury-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-inner container flex items-center justify-between">
        
        {/* Left: Menu & Search */}
        <div className="header-left flex items-center gap-6">
          <button className="icon-btn hidden-desktop">
            <Menu size={24} />
          </button>
          <nav className="desktop-nav flex gap-6">
            <Link to="/products" className="nav-link">Models</Link>
            <Link to="/products" className="nav-link">Lifestyle</Link>
            <Link to="/admin" className="nav-link" style={{ color: 'var(--color-accent)' }}>Admin Panel</Link>
          </nav>
        </div>

        {/* Center: Logo */}
        <div className="header-center">
          <Link to="/" className="luxury-logo">
            KUKU KART
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="header-right flex items-center gap-6">
          <form className="luxury-search-form hidden-mobile" onSubmit={handleSearch}>
            <input type="text" placeholder="Search..." className="luxury-search-input" />
            <button type="submit" className="icon-btn"><Search size={20} /></button>
          </form>
          
          <button className="icon-btn hidden-desktop"><Search size={24} /></button>
          
          <Link to="/wishlist" className="icon-btn" title="Wishlist">
            <Heart size={20} />
          </Link>

          <Link to="/orders" className="icon-btn" title="My Orders">
            <Package size={20} />
          </Link>

          <Link to="/login" className="icon-btn hidden-mobile" title="Account">
            <User size={20} />
          </Link>
          
          <Link to="/cart" className="icon-btn relative" title="Cart">
            <ShoppingBag size={20} />
            <span className="cart-dot"></span>
          </Link>
        </div>

      </div>
    </header>
  );
};

export default Header;
