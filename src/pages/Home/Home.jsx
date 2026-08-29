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
  Sparkles
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import './Home.css';

const HERO_SLIDES = [
  {
    id: 1,
    title: 'THE AUTUMN COUTURE',
    subtitle: 'Bespoke Cashmere & Haute Tailoring',
    tag: 'PRIVATE PRIVILEGE DROP',
    buttonText: 'EXPLORE MENSWEAR',
    link: '/products?category=Men',
    image: 'https://images.unsplash.com/photo-1544022613-e87ce7526edb?w=1600&q=80'
  },
  {
    id: 2,
    title: 'ACOUSTIC SUPREMACY',
    subtitle: 'Planar Magnetic Studio Series',
    tag: 'LIMITED RUN OF 500',
    buttonText: 'EXPERIENCE SOUND',
    link: '/products?category=Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&q=80'
  },
  {
    id: 3,
    title: 'THE SOVEREIGN TIMEPIECES',
    subtitle: 'Handcrafted Swiss Tourbillons',
    tag: 'COMPLIMENTARY INSURED COURIER',
    buttonText: 'VIEW HOROLOGY',
    link: '/products?category=Accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&q=80'
  }
];

const Home = () => {
  const { products, categories, brands, toggleWishlist, isInWishlist, addToCart } = useShop();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide carousel every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const dealProducts = products.filter(p => p.isDealOfTheDay || p.discountPercent >= 18).slice(0, 4);
  const trendingProducts = products.filter(p => p.isTrending || p.isFeatured).slice(0, 4);

  return (
    <div className="luxury-home-page">
      {/* 1. Hero Carousel */}
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
              <div className="flex gap-4 mt-6">
                <Link to={slide.link} className="btn-primary flex items-center gap-2">
                  {slide.buttonText} <ArrowRight size={16} />
                </Link>
                <Link to="/products" className="btn-secondary">
                  VIEW ALL COLLECTIONS
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Controls */}
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

      {/* 2. Privilege Benefits Bar */}
      <section className="benefits-bar container flex justify-between items-center py-6 border-b border-border">
        <div className="benefit-item flex items-center gap-3">
          <Truck size={22} color="var(--color-accent)" />
          <div className="flex-col">
            <strong className="text-xs text-white">Complimentary Delivery</strong>
            <span className="text-10 text-muted">Direct white-glove courier</span>
          </div>
        </div>
        <div className="benefit-item flex items-center gap-3">
          <ShieldCheck size={22} color="var(--color-accent)" />
          <div className="flex-col">
            <strong className="text-xs text-white">100% Certified Authentic</strong>
            <span className="text-10 text-muted">Direct from master ateliers</span>
          </div>
        </div>
        <div className="benefit-item flex items-center gap-3">
          <RotateCcw size={22} color="var(--color-accent)" />
          <div className="flex-col">
            <strong className="text-xs text-white">30-Day Privilege Return</strong>
            <span className="text-10 text-muted">Effortless doorstep exchange</span>
          </div>
        </div>
        <div className="benefit-item flex items-center gap-3">
          <Headphones size={22} color="var(--color-accent)" />
          <div className="flex-col">
            <strong className="text-xs text-white">24/7 Private Concierge</strong>
            <span className="text-10 text-muted">Dedicated client advisors</span>
          </div>
        </div>
      </section>

      {/* 3. Categories Showcase (Like Myntra / JioMart Categories Grid) */}
      <section className="categories-section container py-12">
        <div className="section-header flex justify-between items-end mb-8">
          <div>
            <span className="text-xs text-accent tracking-widest uppercase">CURATED REALMS</span>
            <h2 className="section-heading mt-1">EXPLORE BY CATEGORY</h2>
          </div>
          <Link to="/products" className="view-all-link flex items-center gap-1 text-xs text-muted hover:text-accent">
            ALL COLLECTIONS <ArrowRight size={14} />
          </Link>
        </div>

        <div className="categories-grid grid-8">
          {categories.map(cat => (
            <Link to={`/products?category=${cat.name}`} key={cat.id} className="category-card flex-col items-center">
              <div className="category-img-wrap">
                <img src={cat.image} alt={cat.name} />
              </div>
              <span className="category-name mt-3">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Deals of the Day (With Countdown Timer) */}
      <section className="deals-section container py-12 border-t border-border">
        <div className="section-header flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-2">
              <Flame size={18} color="#ff4444" />
              <span className="text-xs text-error tracking-widest font-bold uppercase">LIMITED PRIVILEGES</span>
            </div>
            <h2 className="section-heading mt-1">DEALS OF THE DAY</h2>
          </div>
          <div className="deals-timer flex items-center gap-2 p-2 border border-border bg-surface text-xs">
            <Clock size={14} color="var(--color-accent)" />
            <span>ENDS IN: <strong className="text-accent">06h : 42m : 18s</strong></span>
          </div>
        </div>

        <div className="products-showcase-grid grid-4 gap-6">
          {dealProducts.map(p => {
            const wishlisted = isInWishlist(p.id);
            return (
              <div key={p.id} className="luxury-product-card flex-col">
                <div className="card-media relative">
                  <Link to={`/product/${p.id}`}>
                    <img src={p.image} alt={p.title} />
                  </Link>
                  <button 
                    className={`card-heart-btn ${wishlisted ? 'active' : ''}`}
                    onClick={() => toggleWishlist(p)}
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
                      <span className="final-price font-bold">${p.price.toLocaleString()}</span>
                      {p.originalPrice && <span className="mrp-price text-xs text-muted line-through">${p.originalPrice.toLocaleString()}</span>}
                    </div>
                    <button 
                      onClick={() => addToCart(p, p.sizes?.[0] || 'Standard', p.colors?.[0] || 'Default', 1)}
                      className="add-cart-mini-btn"
                      title="Add to Selection"
                    >
                      <ShoppingBag size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Trending Masterpieces */}
      <section className="trending-section container py-12 border-t border-border">
        <div className="section-header flex justify-between items-end mb-8">
          <div>
            <span className="text-xs text-accent tracking-widest uppercase">MOST COVETED</span>
            <h2 className="section-heading mt-1">TRENDING MASTERPIECES</h2>
          </div>
          <Link to="/products" className="view-all-link flex items-center gap-1 text-xs text-muted hover:text-accent">
            SHOWROOM <ArrowRight size={14} />
          </Link>
        </div>

        <div className="products-showcase-grid grid-4 gap-6">
          {trendingProducts.map(p => {
            const wishlisted = isInWishlist(p.id);
            return (
              <div key={p.id} className="luxury-product-card flex-col">
                <div className="card-media relative">
                  <Link to={`/product/${p.id}`}>
                    <img src={p.image} alt={p.title} />
                  </Link>
                  <button 
                    className={`card-heart-btn ${wishlisted ? 'active' : ''}`}
                    onClick={() => toggleWishlist(p)}
                  >
                    <Heart size={16} fill={wishlisted ? 'var(--color-accent)' : 'none'} color={wishlisted ? 'var(--color-accent)' : '#fff'} />
                  </button>
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
                      <span className="final-price font-bold">${p.price.toLocaleString()}</span>
                      {p.originalPrice && <span className="mrp-price text-xs text-muted line-through">${p.originalPrice.toLocaleString()}</span>}
                    </div>
                    <button 
                      onClick={() => addToCart(p, p.sizes?.[0] || 'Standard', p.colors?.[0] || 'Default', 1)}
                      className="add-cart-mini-btn"
                    >
                      <ShoppingBag size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Brand Spotlight */}
      <section className="brands-section container py-12 border-t border-border">
        <h3 className="text-xs text-accent tracking-widest text-center uppercase mb-6">FEATURED LUXURY ATELIERS</h3>
        <div className="brands-row flex justify-between items-center flex-wrap gap-4">
          {brands.map(b => (
            <Link to={`/products?brand=${encodeURIComponent(b)}`} key={b} className="brand-pill p-3 border border-border bg-surface text-xs text-muted hover:text-accent hover:border-accent">
              {b}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
