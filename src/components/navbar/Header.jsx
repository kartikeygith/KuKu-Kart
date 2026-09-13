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
  Check,
  Tag,
  Sparkles,
  LayoutDashboard,
  HelpCircle,
  PhoneCall
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import { INDIAN_CITIES_PINCODES, formatINR } from '../../utils/helpers';
import './Header.css';

const ANNOUNCEMENTS = [
  '🚚 Free Delivery on Orders Above ₹999',
  '🔥 Special Discounts Available: Use Code KUKU500 for ₹500 OFF',
  '🔒 100% Secure Payments via UPI, Cards, Net Banking & COD',
  '✨ Authentic Luxury & Direct Atelier Certifications'
];

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
  const [announcementIdx, setAnnouncementIdx] = useState(0);
  
  const [pincodeInput, setPincodeInput] = useState(deliveryPincode);
  const [pincodeError, setPincodeError] = useState('');

  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const userRef = useRef(null);

  // Rotating Announcement Bar
  useEffect(() => {
    const interval = setInterval(() => {
      setAnnouncementIdx(prev => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Detect query params for category highlights
  const queryParams = new URLSearchParams(location.search);
  const currentCategory = queryParams.get('category');
  const isAllProductsActive = location.pathname === '/products' && !currentCategory;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchFocused(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifDropdown(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUserDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setShowMobileMenu(false);
  }, [location]);

  // Debounced search results
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
      setPincodeError('Please enter a valid 6-digit Indian PIN code (e.g., 110001).');
    }
  };

  return (
    <>
      <header className={`luxury-header ${scrolled ? 'scrolled' : ''}`}>
        
        {/* 1. TOP ANNOUNCEMENT BAR (PART 3) */}
        <div className="announcement-bar">
          <div className="container flex items-center justify-between">
            <div className="announcement-ticker flex items-center gap-2">
              <span className="announcement-text transition-fade">
                {ANNOUNCEMENTS[announcementIdx]}
              </span>
            </div>
            
            <div className="announcement-right-links flex items-center gap-4 text-xs">
              <button 
                className="location-btn flex items-center gap-1 text-muted hover:text-accent"
                onClick={() => setShowLocationModal(true)}
              >
                <MapPin size={12} color="var(--color-accent)" />
                <span>Deliver to: <strong className="text-white">{deliveryCity} {deliveryPincode}</strong></span>
                <ChevronDown size={10} />
              </button>
              <span className="announcement-divider">•</span>
              <Link to="/contact" className="top-link hover:text-accent">Contact Support</Link>
            </div>
          </div>
        </div>

        {/* 2. MAIN HEADER (LOGO - SEARCH - WISHLIST - CART - ORDERS - USER) (PART 1 & 2) */}
        <div className="header-inner container flex items-center justify-between">
          
          {/* Mobile Hamburger Toggle & Brand Logo */}
          <div className="header-left flex items-center gap-4">
            <button 
              className="icon-btn mobile-toggle-btn hidden-desktop" 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label="Toggle navigation menu"
            >
              {showMobileMenu ? <X size={22} /> : <Menu size={22} />}
            </button>

            <Link to="/" className="luxury-logo">
              KUKU KART
            </Link>
          </div>

          {/* Search Bar with Instant Suggestions */}
          <div className="search-container relative hidden-mobile" ref={searchRef}>
            <form className="luxury-search-form" onSubmit={handleSearch}>
              <Search size={16} className="search-icon-prefix text-muted" />
              <input 
                type="text" 
                placeholder="Search products, categories, luxury couture..." 
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
            </form>

            {/* Instant Search Suggestions */}
            {searchFocused && (
              <div className="search-dropdown-menu">
                <div className="dropdown-header flex justify-between items-center">
                  <span>{searchResults.length > 0 ? `RESULTS FOR "${searchQuery}"` : 'POPULAR SEARCHES'}</span>
                  <span className="text-10 text-muted">Press Enter to view all</span>
                </div>
                {searchResults.length > 0 ? (
                  searchResults.map(item => (
                    <Link 
                      key={item.id} 
                      to={`/product/${item.id}`} 
                      className="search-suggestion-item flex items-center gap-3 p-3"
                      onClick={() => { setSearchFocused(false); setSearchQuery(''); }}
                    >
                      <img src={item.image} alt={item.title} className="suggestion-thumb" />
                      <div className="flex-col flex-1">
                        <span className="suggestion-title">{item.title}</span>
                        <span className="suggestion-subtitle">{item.brand} • {formatINR(item.price)}</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-3 popular-keywords flex flex-wrap gap-2">
                    {['Headphones', 'Cashmere', 'Tuxedo', 'Silk Saree', 'Watches', 'Oxford Shoes', 'Perfume'].map(kw => (
                      <button 
                        key={kw} 
                        type="button"
                        className="keyword-tag text-xs"
                        onClick={() => {
                          setSearchQuery(kw);
                          navigate(`/products?search=${encodeURIComponent(kw)}`);
                          setSearchFocused(false);
                        }}
                      >
                        {kw}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Items: Wishlist, Cart, Orders, User Suite (PART 2) */}
          <div className="header-action-group flex items-center gap-6">
            
            {/* Wishlist Link with Icon, Text & Badge */}
            <Link 
              to="/wishlist" 
              className={`header-action-item ${location.pathname === '/wishlist' ? 'active' : ''}`}
              title="My Wishlist"
            >
              <div className="action-icon-wrap relative">
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="badge-count wishlist-badge">{wishlistCount}</span>
                )}
              </div>
              <span className="action-label">Wishlist</span>
            </Link>

            {/* Cart Link with Icon, Text & Badge */}
            <Link 
              to="/cart" 
              className={`header-action-item ${location.pathname === '/cart' ? 'active' : ''}`}
              title="Shopping Cart"
            >
              <div className="action-icon-wrap relative">
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="badge-count cart-badge">{cartCount}</span>
                )}
              </div>
              <span className="action-label">Cart</span>
            </Link>

            {/* Orders Link with Icon & Text */}
            <Link 
              to="/orders" 
              className={`header-action-item ${location.pathname.startsWith('/orders') || location.pathname.startsWith('/account/orders') ? 'active' : ''}`}
              title="Track Orders"
            >
              <div className="action-icon-wrap relative">
                <Package size={20} />
              </div>
              <span className="action-label">Orders</span>
            </Link>

            {/* User Account / Suite Dropdown */}
            <div className="relative" ref={userRef}>
              <button 
                className="header-action-item user-action-btn"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                title="Client Profile"
              >
                <div className="action-icon-wrap">
                  <User size={20} />
                </div>
                <span className="action-label flex items-center gap-1">
                  {user?.full_name ? user.full_name.split(' ')[0] : 'Profile'}
                  <ChevronDown size={11} className="hidden-mobile" />
                </span>
              </button>

              {showUserDropdown && (
                <div className="header-dropdown user-dropdown p-4 flex-col gap-2">
                  <div className="pb-2 border-b border-border">
                    <strong className="text-white text-xs block truncate">{user?.full_name || 'Valued Client'}</strong>
                    <span className="text-10 text-muted block truncate">{user?.email || 'client@kukukart.in'}</span>
                    <span className="role-tag mt-2">{user?.role?.toUpperCase() || 'CUSTOMER'}</span>
                  </div>

                  <Link to="/profile" className="dropdown-link" onClick={() => setShowUserDropdown(false)}>
                    <User size={14} /> My Profile & Saved Addresses
                  </Link>

                  <Link to="/orders" className="dropdown-link" onClick={() => setShowUserDropdown(false)}>
                    <Package size={14} /> My Orders & Live Tracking
                  </Link>

                  <Link to="/wishlist" className="dropdown-link" onClick={() => setShowUserDropdown(false)}>
                    <Heart size={14} /> Wishlist ({wishlistCount})
                  </Link>

                  <Link to="/contact" className="dropdown-link" onClick={() => setShowUserDropdown(false)}>
                    <HelpCircle size={14} /> Concierge Help & Support
                  </Link>

                  {isAdmin && (
                    <Link to="/admin" className="dropdown-link text-accent" onClick={() => setShowUserDropdown(false)}>
                      <LayoutDashboard size={14} /> Admin Executive Portal
                    </Link>
                  )}

                  {isDeliveryPartner && (
                    <Link to="/delivery" className="dropdown-link text-success" onClick={() => setShowUserDropdown(false)}>
                      <Truck size={14} /> Delivery Partner Console
                    </Link>
                  )}

                  <div className="pt-2 border-t border-border mt-1">
                    <span className="text-10 text-muted uppercase block mb-1">Demo Role Switch:</span>
                    <div className="flex gap-1">
                      <button 
                        className={`role-btn ${user?.role === 'customer' ? 'active' : ''}`}
                        onClick={() => { switchRole('customer'); setShowUserDropdown(false); }}
                      >
                        Client
                      </button>
                      <button 
                        className={`role-btn ${user?.role === 'admin' ? 'active' : ''}`}
                        onClick={() => { switchRole('admin'); setShowUserDropdown(false); navigate('/admin'); }}
                      >
                        Admin
                      </button>
                      <button 
                        className={`role-btn ${user?.role === 'delivery_partner' ? 'active' : ''}`}
                        onClick={() => { switchRole('delivery_partner'); setShowUserDropdown(false); navigate('/delivery'); }}
                      >
                        Courier
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={() => { logout(); setShowUserDropdown(false); }} 
                    className="dropdown-link text-error pt-2 border-t border-border mt-1 w-full text-left"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* 3. CATEGORY NAVIGATION BAR (PART 1: Spaced flexbox, Responsive, Glowing Indicator) */}
        <div className="header-category-bar">
          <div className="container flex items-center justify-center">
            <nav className="category-nav-scroll flex items-center justify-center">
              
              <Link 
                to="/products" 
                className={`category-nav-item ${isAllProductsActive ? 'active' : ''}`}
              >
                <span className="category-nav-label">ALL</span>
                <span className="active-indicator"></span>
              </Link>

              <Link 
                to="/products?category=Men" 
                className={`category-nav-item ${currentCategory === 'Men' ? 'active' : ''}`}
              >
                <span className="category-nav-label">MEN</span>
                <span className="active-indicator"></span>
              </Link>

              <Link 
                to="/products?category=Women" 
                className={`category-nav-item ${currentCategory === 'Women' ? 'active' : ''}`}
              >
                <span className="category-nav-label">WOMEN</span>
                <span className="active-indicator"></span>
              </Link>

              <Link 
                to="/products?category=Electronics" 
                className={`category-nav-item ${currentCategory === 'Electronics' ? 'active' : ''}`}
              >
                <span className="category-nav-label">ELECTRONICS</span>
                <span className="active-indicator"></span>
              </Link>

              <Link 
                to="/products?category=Accessories" 
                className={`category-nav-item ${currentCategory === 'Accessories' ? 'active' : ''}`}
              >
                <span className="category-nav-label">ACCESSORIES</span>
                <span className="active-indicator"></span>
              </Link>

              <Link 
                to="/products?category=Footwear" 
                className={`category-nav-item ${currentCategory === 'Footwear' ? 'active' : ''}`}
              >
                <span className="category-nav-label">FOOTWEAR</span>
                <span className="active-indicator"></span>
              </Link>

              <Link 
                to="/products?category=Beauty" 
                className={`category-nav-item ${currentCategory === 'Beauty' ? 'active' : ''}`}
              >
                <span className="category-nav-label">BEAUTY</span>
                <span className="active-indicator"></span>
              </Link>

              <Link 
                to="/products?category=Home & Living" 
                className={`category-nav-item ${currentCategory === 'Home & Living' ? 'active' : ''}`}
              >
                <span className="category-nav-label">HOME</span>
                <span className="active-indicator"></span>
              </Link>

              <Link 
                to="/products?category=Grocery" 
                className={`category-nav-item ${currentCategory === 'Grocery' ? 'active' : ''}`}
              >
                <span className="category-nav-label">GROCERY</span>
                <span className="active-indicator"></span>
              </Link>

              {isAdmin && (
                <Link 
                  to="/admin" 
                  className={`category-nav-item admin-portal-tab ${location.pathname.startsWith('/admin') ? 'active' : ''}`}
                >
                  <span className="category-nav-label flex items-center gap-1">
                    <ShieldCheck size={12} /> ADMIN PANEL
                  </span>
                  <span className="active-indicator"></span>
                </Link>
              )}

              {isDeliveryPartner && (
                <Link 
                  to="/delivery" 
                  className={`category-nav-item delivery-portal-tab ${location.pathname.startsWith('/delivery') ? 'active' : ''}`}
                >
                  <span className="category-nav-label flex items-center gap-1">
                    <Truck size={12} /> COURIER PORTAL
                  </span>
                  <span className="active-indicator"></span>
                </Link>
              )}

            </nav>
          </div>
        </div>

      </header>

      {/* Mobile Drawer */}
      {showMobileMenu && (
        <div className="mobile-drawer-overlay flex" onClick={() => setShowMobileMenu(false)}>
          <div className="mobile-drawer bg-surface p-6 border-r border-border flex-col justify-between" onClick={(e) => e.stopPropagation()}>
            <div className="flex-col gap-6">
              
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="luxury-logo text-base">KUKU KART</span>
                <button onClick={() => setShowMobileMenu(false)} className="icon-btn">
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Search */}
              <form className="luxury-search-form" onSubmit={handleSearch}>
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="luxury-search-input w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="icon-btn">
                  <Search size={16} />
                </button>
              </form>

              {/* Mobile Category Links */}
              <div className="mobile-nav-list flex-col gap-1">
                <span className="text-10 text-accent uppercase tracking-widest block mb-2">COLLECTIONS</span>
                <Link to="/products" className="mobile-nav-item">ALL PRODUCTS</Link>
                <Link to="/products?category=Men" className="mobile-nav-item">MEN'S FASHION</Link>
                <Link to="/products?category=Women" className="mobile-nav-item">WOMEN'S FASHION</Link>
                <Link to="/products?category=Electronics" className="mobile-nav-item">ELECTRONICS</Link>
                <Link to="/products?category=Accessories" className="mobile-nav-item">ACCESSORIES</Link>
                <Link to="/products?category=Footwear" className="mobile-nav-item">FOOTWEAR</Link>
                <Link to="/products?category=Beauty" className="mobile-nav-item">BEAUTY & WELLNESS</Link>
                <Link to="/products?category=Home & Living" className="mobile-nav-item">HOME & LIVING</Link>
                <Link to="/products?category=Grocery" className="mobile-nav-item">GOURMET & GROCERY</Link>
              </div>

              {/* Mobile Client Links */}
              <div className="mobile-nav-list flex-col gap-1 pt-4 border-t border-border">
                <span className="text-10 text-muted uppercase tracking-widest block mb-2">QUICK LINKS</span>
                <Link to="/orders" className="mobile-nav-item">Track My Orders</Link>
                <Link to="/profile" className="mobile-nav-item">Profile & Addresses</Link>
                <Link to="/wishlist" className="mobile-nav-item">Wishlist ({wishlistCount})</Link>
                <Link to="/cart" className="mobile-nav-item">Shopping Bag ({cartCount})</Link>
                <Link to="/contact" className="mobile-nav-item">Customer Support</Link>
                {isAdmin && <Link to="/admin" className="mobile-nav-item text-accent font-bold">Admin Console</Link>}
              </div>

            </div>

            <div className="pt-4 border-t border-border text-10 text-muted">
              © 2026 KuKu Kart India. Precision E-Commerce.
            </div>
          </div>
        </div>
      )}

      {/* Pincode & Destination Selector Modal */}
      {showLocationModal && (
        <div className="location-modal-overlay flex items-center justify-center">
          <div className="location-modal-card p-6 bg-surface border border-accent">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-heading tracking-wider flex items-center gap-2">
                <MapPin size={16} color="var(--color-accent)" /> SELECT DELIVERY LOCATION
              </h3>
              <button onClick={() => setShowLocationModal(false)}><X size={18} /></button>
            </div>

            <form onSubmit={handlePincodeSubmit} className="flex gap-2 mb-4">
              <input 
                type="text" 
                maxLength="6"
                placeholder="Enter 6-digit Indian PIN code"
                value={pincodeInput}
                onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                className="pincode-modal-input flex-1"
                autoFocus
              />
              <button type="submit" className="btn-primary text-xs px-4">CHECK</button>
            </form>

            {pincodeError && <p className="text-error text-xs mb-3">{pincodeError}</p>}

            <span className="text-10 text-muted block mb-2">POPULAR HUBS:</span>
            <div className="quick-cities flex flex-wrap gap-2">
              {['110001', '400001', '560001', '700001', '600001', '500001', '380001', '411001'].map(pin => (
                <button 
                  key={pin}
                  type="button"
                  className="city-pill-btn text-10"
                  onClick={() => {
                    setDeliveryPincode(pin);
                    setDeliveryCity(INDIAN_CITIES_PINCODES[pin]?.city || 'India');
                    setShowLocationModal(false);
                  }}
                >
                  {INDIAN_CITIES_PINCODES[pin]?.city || pin} ({pin})
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
