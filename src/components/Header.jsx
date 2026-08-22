import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, Heart, Package, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { MOCK_PRODUCTS } from './ProductList';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const { cartCount, wishlistCount } = useShop();
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim() === '' ? [] : MOCK_PRODUCTS.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.subtitle && p.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/products');
      setSearchFocused(false);
    }
  };

  return (
    <header className={`luxury-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-inner container flex items-center justify-between">
        
        {/* Left: Navigation links */}
        <div className="header-left flex items-center gap-6">
          <button className="icon-btn hidden-desktop">
            <Menu size={24} />
          </button>
          <nav className="desktop-nav flex gap-6">
            <Link to="/products" className="nav-link">Collection</Link>
            <Link to="/products" className="nav-link">Masterpieces</Link>
            <Link to="/admin" className="nav-link admin-nav-link">Seller Panel</Link>
          </nav>
        </div>

        {/* Center: Brand Logo */}
        <div className="header-center">
          <Link to="/" className="luxury-logo">
            KUKU KART
          </Link>
        </div>

        {/* Right: Search, Wishlist, Orders, Account, Cart */}
        <div className="header-right flex items-center gap-5">
          {/* Live Search Bar with Auto-suggest */}
          <div className="search-container relative hidden-mobile" ref={searchRef}>
            <form className="luxury-search-form" onSubmit={handleSearch}>
              <input 
                type="text" 
                placeholder="Search collection..." 
                className="luxury-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
              />
              {searchQuery ? (
                <button type="button" className="clear-search-btn" onClick={() => setSearchQuery('')}>
                  <X size={14} />
                </button>
              ) : null}
              <button type="submit" className="icon-btn" aria-label="Search">
                <Search size={18} />
              </button>
            </form>

            {/* Instant Auto-Suggest Dropdown */}
            {searchFocused && searchResults.length > 0 && (
              <div className="search-dropdown-menu">
                <div className="dropdown-header">SUGGESTIONS ({searchResults.length})</div>
                {searchResults.map(item => (
                  <Link 
                    key={item.id} 
                    to={`/product/${item.id}`} 
                    className="search-suggestion-item flex items-center gap-3 p-3"
                    onClick={() => { setSearchFocused(false); setSearchQuery(''); }}
                  >
                    <img src={item.image} alt={item.title} className="suggestion-thumb" />
                    <div className="flex-col flex-1">
                      <span className="suggestion-title">{item.title}</span>
                      <span className="suggestion-subtitle">{item.category} • ${item.price.toLocaleString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          
          {/* Wishlist Link with Badge */}
          <Link to="/wishlist" className="icon-btn relative" title="My Wishlist">
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="badge-count wishlist-badge">{wishlistCount}</span>
            )}
          </Link>

          {/* Orders Link */}
          <Link to="/orders" className="icon-btn" title="Track Orders">
            <Package size={20} />
          </Link>

          {/* Account Login */}
          <Link to="/login" className="icon-btn hidden-mobile" title="Account Access">
            <User size={20} />
          </Link>
          
          {/* Cart with Live Count */}
          <Link to="/cart" className="icon-btn relative" title="Shopping Cart">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="badge-count cart-badge">{cartCount}</span>
            )}
          </Link>
        </div>

      </div>
    </header>
  );
};

export default Header;
