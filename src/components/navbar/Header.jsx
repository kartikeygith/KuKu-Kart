import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  ShoppingBag, 
  User, 
  Menu, 
  Heart, 
  Package, 
  MapPin, 
  Bell, 
  X, 
  ShieldCheck, 
  LogOut, 
  Settings, 
  Truck, 
  ChevronDown, 
  Check 
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import { INDIAN_CITIES_PINCODES } from '../../utils/helpers';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    products, 
    categories, 
    cartCount, 
    wishlistCount, 
    notifications, 
    unreadNotifCount, 
    markAllNotificationsRead,
    deliveryPincode,
    deliveryCity,
    setDeliveryPincode,
    setDeliveryCity 
  } = useShop();

  const { user, isAuthenticated, isAdmin, isDeliveryPartner, logout, switchRole } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const [pincodeInput, setPincodeInput] = useState(deliveryPincode);
  const [pincodeError, setPincodeError] = useState('');

  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchFocused(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifDropdown(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUserDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setShowMobileMenu(false);
  }, [location]);

  const searchResults = searchQuery.trim() === '' ? [] : products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.subtitle && p.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
  ).slice(0, 6);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchFocused(false);
    }
  };

  const handlePincodeSubmit = (e) => {
    e.preventDefault();
    if (INDIAN_CITIES_PINCODES[pincodeInput]) {
      setDeliveryPincode(pincodeInput);
      setDeliveryCity(INDIAN_CITIES_PINCODES[pincodeInput].city);
      setShowLocationModal(false);
      setPincodeError('');
    } else if (/^[1-9][0-9]{5}$/.test(pincodeInput)) {
      setDeliveryPincode(pincodeInput);
      setDeliveryCity('India');
      setShowLocationModal(false);
      setPincodeError('');
    } else {
      setPincodeError('Please enter a valid 6-digit Indian pincode.');
    }
  };

  return (
    <>
      <header className={`luxury-header ${scrolled ? 'scrolled' : ''}`}>
        {/* Top Strip (Like JioMart / Myntra top bar) */}
        <div className="header-top-strip container flex justify-between items-center text-xs">
          <div className="flex items-center gap-4">
            <button 
              className="location-btn flex items-center gap-1 text-muted hover:text-accent"
              onClick={() => setShowLocationModal(true)}
            >
              <MapPin size={12} color="var(--color-accent)" />
              <span>Deliver to <strong>{deliveryCity} {deliveryPincode}</strong></span>
              <ChevronDown size={10} />
            </button>
            <span className="divider-dot">•</span>
            <span className="text-muted">Complimentary Insured Shipping on All Orders</span>
          </div>

          <div className="flex items-center gap-4 text-muted">
            {isAdmin && <span className="badge-role admin">Admin Mode</span>}
            {isDeliveryPartner && <span className="badge-role delivery">Delivery Partner</span>}
            <Link to="/orders" className="hover:text-accent">Track Order</Link>
            <span className="divider-dot">•</span>
            <Link to="/profile" className="hover:text-accent">Concierge</Link>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="header-inner container flex items-center justify-between">
          
          {/* Left: Mobile Menu & Category Links */}
          <div className="header-left flex items-center gap-6">
            <button className="icon-btn hidden-desktop" onClick={() => setShowMobileMenu(!showMobileMenu)}>
              <Menu size={24} />
            </button>
            <nav className="desktop-nav flex gap-5">
              <Link to="/products" className="nav-link">ALL</Link>
              <Link to="/products?category=Men" className="nav-link">MEN</Link>
              <Link to="/products?category=Women" className="nav-link">WOMEN</Link>
              <Link to="/products?category=Electronics" className="nav-link">ELECTRONICS</Link>
              <Link to="/products?category=Accessories" className="nav-link">ACCESSORIES</Link>
              {isAdmin && (
                <Link to="/admin" className="nav-link admin-link">ADMIN PANEL</Link>
              )}
              {isDeliveryPartner && (
                <Link to="/delivery" className="nav-link delivery-link">DELIVERY PORTAL</Link>
              )}
            </nav>
          </div>

          {/* Center: Logo */}
          <div className="header-center">
            <Link to="/" className="luxury-logo">
              KUKU KART
            </Link>
          </div>

          {/* Right: Search, Notifications, Wishlist, User, Cart */}
          <div className="header-right flex items-center gap-4">
            
            {/* Live Search Bar */}
            <div className="search-container relative hidden-mobile" ref={searchRef}>
              <form className="luxury-search-form" onSubmit={handleSearch}>
                <input 
                  type="text" 
                  placeholder="Search 50+ luxury items, brands..." 
                  className="luxury-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                />
                {searchQuery && (
                  <button type="button" className="clear-search-btn" onClick={() => setSearchQuery('')}>
                    <X size={14} />
                  </button>
                )}
                <button type="submit" className="icon-btn">
                  <Search size={18} />
                </button>
              </form>

              {/* Instant Search Suggestions */}
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
                        <span className="suggestion-subtitle">{item.brand} • ${item.price.toLocaleString()}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Center */}
            <div className="relative" ref={notifRef}>
              <button 
                className="icon-btn relative" 
                onClick={() => { setShowNotifDropdown(!showNotifDropdown); markAllNotificationsRead(); }}
                title="Notifications"
              >
                <Bell size={20} />
                {unreadNotifCount > 0 && (
                  <span className="badge-count notif-badge">{unreadNotifCount}</span>
                )}
              </button>

              {showNotifDropdown && (
                <div className="header-dropdown notif-dropdown p-4">
                  <div className="flex justify-between items-center pb-2 border-b border-border mb-3">
                    <span className="font-heading text-xs tracking-wider text-accent">NOTIFICATIONS</span>
                    <span className="text-xs text-muted">{notifications.length} updates</span>
                  </div>
                  <div className="notif-list flex-col gap-2 max-h-60 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className="notif-item p-2 border border-border bg-surface flex-col">
                        <span className="font-bold text-xs text-white">{n.title}</span>
                        <span className="text-xs text-muted mt-1">{n.message}</span>
                        <span className="text-10 text-accent mt-1">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link to="/wishlist" className="icon-btn relative" title="My Wishlist">
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="badge-count wishlist-badge">{wishlistCount}</span>
              )}
            </Link>

            {/* Orders */}
            <Link to="/orders" className="icon-btn" title="Track Orders">
              <Package size={20} />
            </Link>

            {/* User Profile / Role Dropdown */}
            <div className="relative" ref={userRef}>
              {isAuthenticated ? (
                <button 
                  className="icon-btn user-avatar-btn flex items-center gap-1"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                >
                  <User size={20} />
                </button>
              ) : (
                <Link to="/login" className="btn-primary text-xs py-1 px-3">
                  LOGIN
                </Link>
              )}

              {showUserDropdown && isAuthenticated && (
                <div className="header-dropdown user-dropdown p-4">
                  <div className="user-info-box pb-3 border-b border-border mb-3">
                    <strong className="text-white text-sm block">{user.full_name || 'Client'}</strong>
                    <span className="text-xs text-muted block">{user.email}</span>
                    <span className="role-tag mt-1 block">{user.role.toUpperCase()}</span>
                  </div>

                  <div className="flex-col gap-2 text-xs">
                    <Link to="/profile" className="dropdown-link p-1 block">My Profile & Addresses</Link>
                    <Link to="/orders" className="dropdown-link p-1 block">My Orders & Invoices</Link>
                    <Link to="/wishlist" className="dropdown-link p-1 block">Private Wishlist</Link>
                    
                    {/* Demo Role Switcher */}
                    <div className="role-switcher-box pt-2 border-t border-border mt-2">
                      <span className="text-10 text-muted block mb-1">SWITCH ROLE (DEMO):</span>
                      <div className="flex gap-1">
                        <button 
                          className={`role-btn ${user.role === 'customer' ? 'active' : ''}`}
                          onClick={() => switchRole('customer')}
                        >
                          Customer
                        </button>
                        <button 
                          className={`role-btn ${user.role === 'admin' ? 'active' : ''}`}
                          onClick={() => switchRole('admin')}
                        >
                          Admin
                        </button>
                        <button 
                          className={`role-btn ${user.role === 'delivery_partner' ? 'active' : ''}`}
                          onClick={() => switchRole('delivery_partner')}
                        >
                          Delivery
                        </button>
                      </div>
                    </div>

                    <button 
                      onClick={logout} 
                      className="dropdown-link text-error flex items-center gap-1 pt-2 border-t border-border mt-2 w-full text-left"
                    >
                      <LogOut size={12} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Cart */}
            <Link to="/cart" className="icon-btn relative cart-icon-btn" title="Shopping Cart">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="badge-count cart-badge">{cartCount}</span>
              )}
            </Link>

          </div>
        </div>
      </header>

      {/* Delivery Location Pincode Modal */}
      {showLocationModal && (
        <div className="location-modal-overlay flex items-center justify-center">
          <div className="location-modal-card p-6 bg-surface border border-accent">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-heading tracking-wider flex items-center gap-2">
                <MapPin size={16} color="var(--color-accent)" /> SELECT DELIVERY LOCATION
              </h3>
              <button onClick={() => setShowLocationModal(false)} className="text-muted hover:text-white">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-muted mb-4">
              Enter your Indian Postal Pincode to view accurate concierge delivery timelines.
            </p>

            <form onSubmit={handlePincodeSubmit} className="flex gap-2 mb-4">
              <input 
                type="text" 
                maxLength="6"
                placeholder="e.g. 110001, 400001"
                value={pincodeInput}
                onChange={(e) => setPincodeInput(e.target.value)}
                className="pincode-modal-input flex-1"
                required
              />
              <button type="submit" className="btn-primary text-xs px-4">APPLY</button>
            </form>

            {pincodeError && <p className="text-error text-xs mb-3">{pincodeError}</p>}

            <div className="popular-cities mt-3 pt-3 border-t border-border">
              <span className="text-10 text-muted block mb-2">POPULAR HUBS:</span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(INDIAN_CITIES_PINCODES).map(([pin, info]) => (
                  <button 
                    key={pin}
                    type="button"
                    className="city-pill-btn text-xs"
                    onClick={() => {
                      setDeliveryPincode(pin);
                      setDeliveryCity(info.city);
                      setShowLocationModal(false);
                    }}
                  >
                    {info.city} ({pin})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {showMobileMenu && (
        <div className="mobile-drawer-overlay">
          <div className="mobile-drawer p-6 bg-surface">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
              <span className="luxury-logo text-lg">KUKU KART</span>
              <button onClick={() => setShowMobileMenu(false)}><X size={24} /></button>
            </div>

            <nav className="flex-col gap-4 text-sm font-heading tracking-widest">
              <Link to="/products" className="py-2 border-b border-border block">ALL COLLECTIONS</Link>
              <Link to="/products?category=Men" className="py-2 border-b border-border block">MEN</Link>
              <Link to="/products?category=Women" className="py-2 border-b border-border block">WOMEN</Link>
              <Link to="/products?category=Electronics" className="py-2 border-b border-border block">ELECTRONICS</Link>
              <Link to="/products?category=Accessories" className="py-2 border-b border-border block">ACCESSORIES</Link>
              <Link to="/wishlist" className="py-2 border-b border-border block flex justify-between">
                <span>WISHLIST</span>
                <span className="text-accent">({wishlistCount})</span>
              </Link>
              <Link to="/orders" className="py-2 border-b border-border block">MY ORDERS</Link>
              {isAdmin && <Link to="/admin" className="py-2 text-accent block">ADMIN PANEL</Link>}
              {isDeliveryPartner && <Link to="/delivery" className="py-2 text-accent block">DELIVERY PORTAL</Link>}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
