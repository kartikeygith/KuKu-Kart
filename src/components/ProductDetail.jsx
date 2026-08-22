import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Truck, Heart, Star, CheckCircle, MapPin, ShoppingBag, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { MOCK_PRODUCTS } from './ProductList';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist, pincode, setPincode } = useShop();

  const product = MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0];
  const [mainImage, setMainImage] = useState(product.image);

  // Variants state
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Obsidian Black');
  const [inputPincode, setInputPincode] = useState(pincode || '');
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [addedNotice, setAddedNotice] = useState(false);

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, 1);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, 1);
    navigate('/checkout');
  };

  const checkPincode = (e) => {
    e.preventDefault();
    if (inputPincode.length === 6 && /^\d+$/.test(inputPincode)) {
      setPincode(inputPincode);
      setPincodeStatus({ success: true, text: `Complimentary Express delivery available to PIN ${inputPincode} by Tomorrow!` });
    } else {
      setPincodeStatus({ success: false, text: 'Please enter a valid 6-digit postal pincode.' });
    }
  };

  return (
    <div className="luxury-pdp">
      <div className="pdp-nav container flex items-center justify-between">
        <Link to="/products" className="back-link flex items-center gap-2">
          <ArrowLeft size={16} /> BACK TO SHOWROOM
        </Link>
        <button 
          className={`wishlist-icon-btn flex items-center gap-2 ${isWishlisted ? 'active' : ''}`}
          onClick={() => toggleWishlist(product)}
        >
          <Heart size={18} fill={isWishlisted ? 'var(--color-accent)' : 'none'} color="var(--color-accent)" />
          <span>{isWishlisted ? 'SAVED IN WISHLIST' : 'ADD TO WISHLIST'}</span>
        </button>
      </div>

      <div className="pdp-hero flex">
        {/* Left Image */}
        <div className="pdp-image-section">
          <div className="image-wrapper">
            <img src={mainImage} alt={product.title} className="pdp-main-image" />
          </div>
        </div>

        {/* Right Info */}
        <div className="pdp-info-section flex-col justify-center">
          <div className="pdp-info-content">
            <span className="pdp-subtitle">{product.subtitle}</span>
            <h1 className="pdp-title">{product.title}</h1>
            
            <div className="rating-badge flex items-center gap-2 mb-4">
              <div className="flex text-accent"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
              <span className="text-xs font-bold">4.9 / 5.0</span>
              <span className="text-xs text-muted">(128 Verified Client Reviews)</span>
            </div>

            <div className="pdp-price mb-6">
              ${product.price.toLocaleString(undefined, {minimumFractionDigits: 2})}
              {product.offer && <span className="pdp-offer-tag ml-3">{product.offer}</span>}
            </div>

            {/* Myntra / Ajio Feature 1: Size Selector */}
            <div className="variant-section mb-6">
              <label className="text-xs text-accent block mb-2">SELECT SIZE / EDITION</label>
              <div className="size-options flex gap-3">
                {['S', 'M', 'L', 'XL', 'TITANIUM EDITION'].map(size => (
                  <button 
                    key={size} 
                    className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Myntra / Ajio Feature 2: Color Swatches */}
            <div className="variant-section mb-6">
              <label className="text-xs text-accent block mb-2">FINISH: {selectedColor.toUpperCase()}</label>
              <div className="color-options flex gap-3">
                {['Obsidian Black', 'Midnight Silver', 'Royal Gold'].map(color => (
                  <button 
                    key={color} 
                    className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Myntra / Ajio Feature 3: Pincode Delivery Checker */}
            <div className="pincode-checker-box p-4 border border-border mb-6">
              <label className="text-xs text-accent flex items-center gap-2 mb-2">
                <MapPin size={14} /> CHECK ESTIMATED DELIVERY
              </label>
              <form onSubmit={checkPincode} className="flex gap-2">
                <input 
                  type="text" 
                  maxLength="6"
                  value={inputPincode} 
                  onChange={(e) => setInputPincode(e.target.value)} 
                  placeholder="Enter 6-digit Pincode (e.g. 110001)"
                  className="pincode-input flex-1" 
                />
                <button type="submit" className="btn-secondary text-xs">CHECK</button>
              </form>
              {pincodeStatus && (
                <div className={`pincode-result mt-2 text-xs flex items-center gap-1 ${pincodeStatus.success ? 'text-success' : 'text-error'}`}>
                  {pincodeStatus.success ? <CheckCircle size={14} /> : null} {pincodeStatus.text}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pdp-actions flex-col gap-4">
              <button onClick={handleBuyNow} className="btn-primary w-full text-center">
                PROCEED TO BUY NOW →
              </button>
              <button onClick={handleAddToCart} className="btn-secondary w-full text-center flex items-center justify-center gap-2">
                {addedNotice ? <Check size={16} /> : <ShoppingBag size={16} />}
                <span>{addedNotice ? 'ADDED TO YOUR SELECTION' : 'ADD TO CART'}</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pdp-features flex-col gap-4 mt-8">
              <div className="feature flex items-center gap-4">
                <Truck size={24} color="var(--color-accent)" />
                <div className="flex-col">
                  <span className="feature-title">Complimentary Insured Shipping</span>
                  <span className="feature-desc">Guaranteed secure transit with live GPS tracking.</span>
                </div>
              </div>
              <div className="feature flex items-center gap-4">
                <ShieldCheck size={24} color="var(--color-accent)" />
                <div className="flex-col">
                  <span className="feature-title">5-Year International Warranty</span>
                  <span className="feature-desc">Complete coverage & worldwide concierge service.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="reviews-section container py-12 border-t border-border mt-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="section-title">VERIFIED CLIENT REVIEWS</h2>
            <p className="text-muted text-sm mt-1">Authentic feedback from verified owners</p>
          </div>
          <div className="rating-overview flex items-center gap-3">
            <span className="rating-score">4.9</span>
            <div className="flex-col">
              <div className="flex text-accent"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
              <span className="text-xs text-muted">98% recommendation rate</span>
            </div>
          </div>
        </div>

        <div className="reviews-grid grid-2 gap-6">
          <div className="review-card p-6 border border-border bg-surface">
            <div className="flex justify-between items-center mb-2">
              <span className="reviewer-name font-bold">Vikramaditya S.</span>
              <span className="text-xs text-muted">Verified Owner • Delhi</span>
            </div>
            <div className="flex text-accent mb-2"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
            <p className="review-text text-sm">"Absolutely stunning craftsmanship. Delivered in less than 24 hours to Delhi. The packaging was immaculate and unboxing felt like a private event."</p>
          </div>
          <div className="review-card p-6 border border-border bg-surface">
            <div className="flex justify-between items-center mb-2">
              <span className="reviewer-name font-bold">Ananya M.</span>
              <span className="text-xs text-muted">Verified Owner • Mumbai</span>
            </div>
            <div className="flex text-accent mb-2"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
            <p className="review-text text-sm">"Top tier quality. The size fit is exact and the obsidian material feels unbelievable in hand. Worth every rupee."</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
