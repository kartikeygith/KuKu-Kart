import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  Clock, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Headphones, 
  Star, 
  Heart, 
  ShoppingBag,
  Sparkles,
  Award,
  Zap,
  Tag,
  Check
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatINR } from '../../utils/helpers';
import './Home.css';

const HERO_SLIDES = [
  {
    id: 1,
    title: 'THE ROYAL FESTIVE SALE',
    subtitle: 'Up to 50% Off on Haute Couture & Pure Silk Attire',
    tag: 'FESTIVAL SPECIAL DROP',
    buttonText: 'SHOP FESTIVE ATTIRE',
    link: '/products?category=Women',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&q=80'
  },
  {
    id: 2,
    title: 'AUTUMN MENSWEAR LUXE',
    subtitle: 'Cashmere Overcoats, Velvet Tuxedos & Bespoke Linens',
    tag: 'NEW ARRIVALS 2026',
    buttonText: 'EXPLORE MENSWEAR',
    link: '/products?category=Men',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1600&q=80'
  },
  {
    id: 3,
    title: 'STUDIO ACOUSTICS & TECH',
    subtitle: 'Planar Magnetic Headphones & Pro OLED Workstations',
    tag: 'ELECTRONICS SHOWCASE',
    buttonText: 'EXPERIENCE SOUND',
    link: '/products?category=Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&q=80'
  },
  {
    id: 4,
    title: 'THE SOVEREIGN HOROLOGY',
    subtitle: 'Hand-Assembled Certified Swiss Tourbillons',
    tag: 'TIMEPIECE PRIVILEGE',
    buttonText: 'VIEW WATCHES',
    link: '/products?category=Accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&q=80'
  }
];

const Home = () => {
  const { products, categories, brands, toggleWishlist, isInWishlist, addToCart } = useShop();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [addedIds, setAddedIds] = useState({});

  // Real Countdown Timer for Deals of the Day
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto slide carousel every 6s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.sizes?.[0] || 'Standard', product.colors?.[0] || 'Default', 1);
    setAddedIds(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds(prev => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  // Curated product sections for homepage
  const dealProducts = products.filter(p => p.isDealOfTheDay || (p.discountPercent && p.discountPercent >= 25)).slice(0, 4);
  const trendingProducts = products.filter(p => p.isTrending || p.isFeatured).slice(0, 4);
  const newArrivals = products.filter(p => p.isNewArrival || p.id.startsWith('m5') || p.id.startsWith('w3') || p.id.startsWith('b2')).slice(0, 4);
  const bestSellers = products.filter(p => p.isBestSeller || p.rating >= 4.9).slice(0, 4);
  const topRated = products.filter(p => p.rating === 5.0).slice(0, 4);
  const recommended = products.slice(0, 4);

  const renderProductCard = (p) => {
    const wishlisted = isInWishlist(p.id);
    const isAdded = addedIds[p.id];

    return (
      <div key={p.id} className="luxury-product-card flex-col">
        <div className="card-media relative">
          <Link to={`/product/${p.id}`}>
            <img src={p.image} alt={p.title} loading="lazy" />
          </Link>
          <button 
            className={`card-heart-btn ${wishlisted ? 'active' : ''}`}
            onClick={() => toggleWishlist(p)}
            title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart size={16} fill={wishlisted ? 'var(--color-accent)' : 'none'} color={wishlisted ? 'var(--color-accent)' : '#fff'} />
          </button>
          {p.discountPercent > 0 && (
            <span className="discount-tag">{p.discountPercent}% OFF</span>
          )}
        </div>
        <div className="card-info p-4 flex-col flex-1 justify-between">
          <div>
            <span className="text-10 text-muted uppercase tracking-wider">{p.brand}</span>
            <Link to={`/product/${p.id}`}>
              <h4 className="product-title mt-1">{p.title}</h4>
            </Link>
            <div className="rating-row flex items-center gap-1 mt-1">
              <Star size={12} fill="var(--color-accent)" color="var(--color-accent)" />
              <span className="text-xs text-white">{p.rating}</span>
              <span className="text-10 text-muted">({p.reviewsCount})</span>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-border">
            <div className="price-box flex items-baseline gap-2">
              <span className="final-price font-bold">{formatINR(p.price)}</span>
              {p.originalPrice && <span className="mrp-price text-xs text-muted line-through">{formatINR(p.originalPrice)}</span>}
            </div>
            <button 
              onClick={(e) => handleQuickAdd(e, p)}
              className="add-cart-mini-btn flex items-center gap-1"
              title="Add to Cart"
            >
              {isAdded ? <Check size={14} color="#000" /> : <ShoppingBag size={14} />}
              <span className="hidden-mobile text-10">{isAdded ? 'ADDED' : 'ADD'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="luxury-home-page">
      
      {/* 1. HERO CAROUSEL */}
      <section className="hero-carousel relative overflow-hidden">
        {HERO_SLIDES.map((slide, idx) => (
          <div 
            key={slide.id} 
            className={`hero-slide flex items-center ${idx === currentSlide ? 'active' : ''}`}
          >
            <div className="hero-bg-overlay">
              <img src={slide.image} alt={slide.title} className="hero-bg-image" />
            </div>
            <div className="hero-content container flex-col">
              <span className="hero-tag flex items-center gap-2 mb-3">
                <Sparkles size={14} color="var(--color-accent)" /> {slide.tag}
              </span>
              <h1 className="hero-title">{slide.title}</h1>
              <p className="hero-subtitle">{slide.subtitle}</p>
              <div className="flex gap-4 mt-6 flex-wrap">
                <Link to={slide.link} className="btn-primary flex items-center gap-2 font-bold tracking-wider">
                  {slide.buttonText} <ArrowRight size={16} />
                </Link>
                <Link to="/products" className="btn-secondary font-bold tracking-wider">
                  VIEW ALL COLLECTIONS
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Arrows */}
        <button 
          className="carousel-arrow prev" 
          onClick={() => setCurrentSlide((currentSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          aria-label="Previous Slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          className="carousel-arrow next" 
          onClick={() => setCurrentSlide((currentSlide + 1) % HERO_SLIDES.length)}
          aria-label="Next Slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Pagination Dots */}
        <div className="carousel-dots flex justify-center gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button 
              key={i} 
              className={`dot ${i === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(i)}
            />
          ))}
        </div>
      </section>

      {/* 2. CUSTOMER TRUST BENEFITS BAR (PART 24) */}
      <section className="benefits-bar container flex justify-between items-center py-6 border-b border-border flex-wrap gap-4">
        <div className="benefit-item flex items-center gap-3">
          <Truck size={22} color="var(--color-accent)" />
          <div className="flex-col">
            <strong className="text-xs text-white">Free Express Delivery</strong>
            <span className="text-10 text-muted">On all orders above ₹999</span>
          </div>
        </div>
        <div className="benefit-item flex items-center gap-3">
          <ShieldCheck size={22} color="var(--color-accent)" />
          <div className="flex-col">
            <strong className="text-xs text-white">100% Certified Authentic</strong>
            <span className="text-10 text-muted">Direct from certified ateliers</span>
          </div>
        </div>
        <div className="benefit-item flex items-center gap-3">
          <RotateCcw size={22} color="var(--color-accent)" />
          <div className="flex-col">
            <strong className="text-xs text-white">15-Day Easy Returns</strong>
            <span className="text-10 text-muted">Hassle-free doorstep pickup</span>
          </div>
        </div>
        <div className="benefit-item flex items-center gap-3">
          <Headphones size={22} color="var(--color-accent)" />
          <div className="flex-col">
            <strong className="text-xs text-white">24/7 Client Concierge</strong>
            <span className="text-10 text-muted">Dedicated personal advisors</span>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT CATEGORIES SHOWCASE (PART 4) */}
      <section className="categories-section container py-12">
        <div className="section-header flex justify-between items-end mb-8">
          <div>
            <span className="text-xs text-accent tracking-widest uppercase font-bold">SHOP BY REALM</span>
            <h2 className="section-heading mt-1">CURATED COLLECTIONS</h2>
          </div>
          <Link to="/products" className="view-all-link flex items-center gap-1 text-xs text-muted hover:text-accent">
            ALL CATEGORIES <ArrowRight size={14} />
          </Link>
        </div>

        <div className="categories-grid grid-8">
          {categories.map(cat => (
            <Link to={`/products?category=${encodeURIComponent(cat.name)}`} key={cat.id} className="category-card flex-col items-center">
              <div className="category-img-wrap">
                <img src={cat.image} alt={cat.name} loading="lazy" />
              </div>
              <span className="category-name mt-3">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. BEST DEALS (WITH LIVE COUNTDOWN TIMER) */}
      <section className="deals-section container py-12 border-t border-border">
        <div className="section-header flex justify-between items-end mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Flame size={18} color="#ff4444" />
              <span className="text-xs text-error tracking-widest font-bold uppercase">LIMITED PRIVILEGES</span>
            </div>
            <h2 className="section-heading mt-1">DEALS OF THE DAY</h2>
          </div>
          
          {/* Live countdown timer */}
          <div className="deals-timer flex items-center gap-2 p-3 border border-border bg-surface text-xs rounded">
            <Clock size={16} color="var(--color-accent)" />
            <span>ENDS IN: <strong className="text-accent font-mono text-sm">
              {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
            </strong></span>
          </div>
        </div>

        <div className="products-showcase-grid grid-4 gap-6">
          {dealProducts.map(p => renderProductCard(p))}
        </div>
      </section>

      {/* 5. TRENDING NOW */}
      <section className="trending-section container py-12 border-t border-border">
        <div className="section-header flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-2">
              <Zap size={16} color="var(--color-accent)" />
              <span className="text-xs text-accent tracking-widest uppercase font-bold">MOST COVETED</span>
            </div>
            <h2 className="section-heading mt-1">TRENDING NOW</h2>
          </div>
          <Link to="/products" className="view-all-link flex items-center gap-1 text-xs text-muted hover:text-accent">
            VIEW ALL <ArrowRight size={14} />
          </Link>
        </div>

        <div className="products-showcase-grid grid-4 gap-6">
          {trendingProducts.map(p => renderProductCard(p))}
        </div>
      </section>

      {/* 6. NEW ARRIVALS */}
      <section className="new-arrivals-section container py-12 border-t border-border">
        <div className="section-header flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={16} color="var(--color-accent)" />
              <span className="text-xs text-accent tracking-widest uppercase font-bold">FRESH IN SHOWROOM</span>
            </div>
            <h2 className="section-heading mt-1">NEW ARRIVALS</h2>
          </div>
          <Link to="/products" className="view-all-link flex items-center gap-1 text-xs text-muted hover:text-accent">
            SEE NEWEST <ArrowRight size={14} />
          </Link>
        </div>

        <div className="products-showcase-grid grid-4 gap-6">
          {newArrivals.map(p => renderProductCard(p))}
        </div>
      </section>

      {/* 7. BEST SELLERS */}
      <section className="bestsellers-section container py-12 border-t border-border">
        <div className="section-header flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-2">
              <Award size={16} color="var(--color-accent)" />
              <span className="text-xs text-accent tracking-widest uppercase font-bold">CLIENT FAVORITES</span>
            </div>
            <h2 className="section-heading mt-1">BEST SELLERS</h2>
          </div>
          <Link to="/products" className="view-all-link flex items-center gap-1 text-xs text-muted hover:text-accent">
            SHOWROOM <ArrowRight size={14} />
          </Link>
        </div>

        <div className="products-showcase-grid grid-4 gap-6">
          {bestSellers.map(p => renderProductCard(p))}
        </div>
      </section>

      {/* 8. TOP RATED PRODUCTS */}
      <section className="top-rated-section container py-12 border-t border-border">
        <div className="section-header flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-2">
              <Star size={16} color="var(--color-accent)" fill="var(--color-accent)" />
              <span className="text-xs text-accent tracking-widest uppercase font-bold">5-STAR RATINGS</span>
            </div>
            <h2 className="section-heading mt-1">TOP RATED PRODUCTS</h2>
          </div>
          <Link to="/products" className="view-all-link flex items-center gap-1 text-xs text-muted hover:text-accent">
            EXPLORE ALL <ArrowRight size={14} />
          </Link>
        </div>

        <div className="products-showcase-grid grid-4 gap-6">
          {topRated.map(p => renderProductCard(p))}
        </div>
      </section>

      {/* 9. BRAND SPOTLIGHT */}
      <section className="brands-section container py-12 border-t border-border">
        <h3 className="text-xs text-accent tracking-widest text-center uppercase mb-6 font-bold">
          OFFICIAL ATELIERS & BRAND PARTNERS
        </h3>
        <div className="brands-row flex justify-center items-center flex-wrap gap-4">
          {brands.map(b => (
            <Link 
              to={`/products?brand=${encodeURIComponent(b)}`} 
              key={b} 
              className="brand-pill p-3 border border-border bg-surface text-xs text-muted hover:text-accent hover:border-accent"
            >
              {b}
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
