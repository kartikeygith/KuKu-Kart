import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Truck, Heart, Star, CheckCircle, MapPin } from 'lucide-react';
import './ProductDetail.css';
import { MOCK_PRODUCTS } from './ProductList';

const ProductDetail = () => {
  const { id } = useParams();
  const product = MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0];
  const [mainImage, setMainImage] = useState(product.image);

  // Myntra Features State
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Obsidian Black');
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const checkPincode = (e) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setPincodeStatus({ success: true, text: `Express delivery available to PIN ${pincode} by Tomorrow!` });
    } else {
      setPincodeStatus({ success: false, text: 'Please enter a valid 6-digit postal pincode.' });
    }
  };

  return (
    <div className="luxury-pdp">
      <div className="pdp-nav container flex items-center justify-between">
        <Link to="/products" className="back-link flex items-center gap-2">
          <ArrowLeft size={16} /> BACK TO COLLECTION
        </Link>
        <button 
          className={`wishlist-icon-btn flex items-center gap-2 ${isWishlisted ? 'active' : ''}`}
          onClick={() => setIsWishlisted(!isWishlisted)}
        >
          <Heart size={18} fill={isWishlisted ? 'var(--color-accent)' : 'none'} color="var(--color-accent)" />
          <span>{isWishlisted ? 'SAVED TO WISHLIST' : 'ADD TO WISHLIST'}</span>
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
              <span className="text-xs text-muted">(128 Verified Buyer Reviews)</span>
            </div>

            <div className="pdp-price mb-6">
              ${product.price.toLocaleString(undefined, {minimumFractionDigits: 2})}
            </div>

            {/* Myntra Feature 1: Size Selector */}
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

            {/* Myntra Feature 2: Color Swatches */}
            <div className="variant-section mb-6">
              <label className="text-xs text-accent block mb-2">COLOR: {selectedColor.toUpperCase()}</label>
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

            {/* Myntra Feature 3: Pincode Delivery Checker */}
            <div className="pincode-checker-box p-4 border border-border mb-6">
              <label className="text-xs text-accent flex items-center gap-2 mb-2">
                <MapPin size={14} /> CHECK DELIVERY AVAILABILITY
              </label>
              <form onSubmit={checkPincode} className="flex gap-2">
                <input 
                  type="text" 
                  maxLength="6"
                  value={pincode} 
                  onChange={(e) => setPincode(e.target.value)} 
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

            <div className="pdp-actions flex-col gap-4">
              <Link to="/checkout" className="btn-primary w-full text-center">PROCEED TO BUY NOW</Link>
              <Link to="/cart" className="btn-secondary w-full text-center">ADD TO CART</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="reviews-section container py-12 border-t border-border mt-12">
        <h2 className="section-title mb-6">VERIFIED CLIENT REVIEWS</h2>
        <div className="reviews-grid grid-2 gap-6">
          <div className="review-card p-6 border border-border bg-surface">
            <div className="flex justify-between items-center mb-2">
              <span className="reviewer-name font-bold">Vikram S.</span>
              <span className="text-xs text-muted">Verified Buyer</span>
            </div>
            <div className="flex text-accent mb-2"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
            <p className="review-text text-sm">"Absolutely stunning craftsmanship. Delivered in less than 24 hours to Delhi. The packaging was immaculate."</p>
          </div>
          <div className="review-card p-6 border border-border bg-surface">
            <div className="flex justify-between items-center mb-2">
              <span className="reviewer-name font-bold">Ananya M.</span>
              <span className="text-xs text-muted">Verified Buyer</span>
            </div>
            <div className="flex text-accent mb-2"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
            <p className="review-text text-sm">"Top tier quality. The size fit is exact and the material feels unbelievable. Worth every rupee."</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
