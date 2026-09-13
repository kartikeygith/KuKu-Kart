import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Heart, 
  Star, 
  CheckCircle, 
  MapPin, 
  ShoppingBag, 
  Check, 
  Ruler, 
  X, 
  MessageSquare,
  Sparkles,
  Share2,
  Plus,
  Zap
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { getEstimatedDelivery, INDIAN_CITIES_PINCODES, formatINR } from '../../utils/helpers';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    products, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    deliveryPincode, 
    setDeliveryPincode,
    addToRecentlyViewed,
    recentlyViewed 
  } = useShop();

  const product = products.find(p => p.id === id) || products[0];

  const [selectedImage, setSelectedImage] = useState(product?.image);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'Standard');
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || 'Default');
  const [pincodeInput, setPincodeInput] = useState(deliveryPincode || '110001');
  const [pincodeMessage, setPincodeMessage] = useState(null);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewsList, setReviewsList] = useState([
    {
      id: 'rev-1',
      name: 'Vikramaditya Singhania',
      location: 'New Delhi',
      rating: 5,
      title: 'Flawless Imperial Craftsmanship',
      comment: 'Unbelievable hand-finished perfection. The packaging and presentation reflect true luxury. Arrived within 24 hours via express white-glove courier.',
      date: '2 days ago',
      verified: true
    },
    {
      id: 'rev-2',
      name: 'Ananya Mehta',
      location: 'Mumbai',
      rating: 5,
      title: 'Exceeded Haute Expectations',
      comment: 'The drape and materials feel sublime. Sizing is exact according to the atelier chart. Truly a signature acquisition.',
      date: '1 week ago',
      verified: true
    }
  ]);

  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setSelectedSize(product.sizes?.[0] || 'Standard');
      setSelectedColor(product.colors?.[0] || 'Default');
      addToRecentlyViewed(product);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [id, product]);

  const isWishlisted = isInWishlist(product?.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, 1);
    setToastMessage(`Added ${product.title} to your bag!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, 1);
    navigate('/checkout');
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (INDIAN_CITIES_PINCODES[pincodeInput]) {
      setDeliveryPincode(pincodeInput);
      const hub = INDIAN_CITIES_PINCODES[pincodeInput];
      setPincodeMessage({
        success: true,
        text: `Express courier available to ${hub.city} by ${getEstimatedDelivery(hub.standardDays)} (Free Delivery)`
      });
    } else if (/^[1-9][0-9]{5}$/.test(pincodeInput)) {
      setDeliveryPincode(pincodeInput);
      setPincodeMessage({
        success: true,
        text: `Insured delivery available by ${getEstimatedDelivery(2)} (Free Delivery on ₹999+)`
      });
    } else {
      setPincodeMessage({
        success: false,
        text: 'Please enter a valid 6-digit Indian PIN code.'
      });
    }
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    const newRev = {
      id: 'rev-' + Date.now(),
      name: 'Kartikey Sharma',
      location: 'New Delhi',
      rating: reviewRating,
      title: reviewTitle || 'Signature Acquisition',
      comment: reviewComment,
      date: 'Just now',
      verified: true
    };
    setReviewsList([newRev, ...reviewsList]);
    setShowReviewModal(false);
    setReviewTitle('');
    setReviewComment('');
    setToastMessage('Review submitted successfully!');
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Frequently Bought Together Bundle Item
  const bundleItem = products.find(p => p.id !== product?.id && p.category === (product?.category === 'Men' ? 'Accessories' : 'Footwear')) || products[2];
  const bundleTotal = (product?.price || 0) + (bundleItem?.price || 0);

  const handleAddBundle = () => {
    addToCart(product, selectedSize, selectedColor, 1);
    if (bundleItem) {
      addToCart(bundleItem, bundleItem.sizes?.[0] || 'Standard', bundleItem.colors?.[0] || 'Default', 1);
    }
    setToastMessage('Curated bundle added to your shopping bag!');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const similarProducts = products.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 4);
  const otherRecent = recentlyViewed.filter(p => p.id !== product?.id).slice(0, 4);

  return (
    <div className="pdp-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="pdp-toast flex items-center gap-2">
          <Check size={16} color="#00c851" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Nav Back */}
      <div className="pdp-top-nav container flex justify-between items-center py-4">
        <Link to="/products" className="back-link flex items-center gap-2 text-xs text-muted hover:text-accent">
          <ArrowLeft size={14} /> BACK TO SHOWROOM
        </Link>
        <div className="flex items-center gap-3">
          <button 
            className={`wishlist-btn-pdp flex items-center gap-2 text-xs ${isWishlisted ? 'active' : ''}`}
            onClick={() => toggleWishlist(product)}
          >
            <Heart size={16} fill={isWishlisted ? 'var(--color-accent)' : 'none'} color="var(--color-accent)" />
            <span>{isWishlisted ? 'SAVED IN WISHLIST' : 'ADD TO WISHLIST'}</span>
          </button>
        </div>
      </div>

      <div className="pdp-main-content container flex gap-12 py-8">
        
        {/* Left: Gallery & Zoom Preview */}
        <div className="pdp-gallery-area flex-1">
          <div 
            className="main-zoom-box relative overflow-hidden"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <img 
              src={selectedImage} 
              alt={product?.title} 
              className={`main-pdp-img ${isZoomed ? 'zoomed' : ''}`} 
              style={isZoomed ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` } : {}}
            />
            {product?.discountPercent > 0 && (
              <span className="pdp-floating-discount">{product.discountPercent}% OFF</span>
            )}
            <span className="zoom-hint-badge text-10">Hover to Zoom</span>
          </div>

          {/* Thumbnails */}
          <div className="thumbnails-row flex gap-3 mt-4">
            {[product?.image, product?.image, product?.image].map((img, i) => (
              <div 
                key={i} 
                className={`thumb-box ${selectedImage === img ? 'active' : ''}`}
                onClick={() => setSelectedImage(img)}
              >
                <img src={img} alt={`View ${i + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Info, Variant Selector & Actions */}
        <div className="pdp-info-area flex-1 flex-col">
          <div className="brand-header flex justify-between items-center">
            <span className="atelier-badge uppercase tracking-widest text-accent text-xs font-bold">
              {product?.brand || 'KUKU ATELIER'}
            </span>
            <span className="text-10 text-muted font-mono">SKU: KK-{product?.id.toUpperCase()}</span>
          </div>

          <h1 className="pdp-product-title mt-2">{product?.title}</h1>
          <p className="pdp-product-subtitle text-muted text-sm mt-1">{product?.subtitle}</p>

          {/* Rating Badge */}
          <div className="pdp-rating-row flex items-center gap-3 my-4 pb-4 border-b border-border flex-wrap">
            <div className="flex items-center gap-1 bg-surface px-2.5 py-1 border border-border text-xs text-white rounded">
              <span className="font-bold">{product?.rating}</span>
              <Star size={12} fill="var(--color-accent)" color="var(--color-accent)" />
            </div>
            <span className="text-xs text-muted">| {product?.reviewsCount || 128} Verified Ratings</span>
            <span className="text-xs text-success font-semibold flex items-center gap-1">
              <CheckCircle size={13} /> {product?.stock > 0 ? 'In Stock & Ready for Dispatch' : 'Limited Inventory'}
            </span>
          </div>

          {/* Price Box in INR */}
          <div className="pdp-price-section my-2">
            <div className="flex items-baseline gap-3">
              <span className="pdp-final-price font-bold text-accent">{formatINR(product?.price)}</span>
              {product?.originalPrice && (
                <span className="pdp-mrp-price text-muted text-sm line-through">{formatINR(product?.originalPrice)}</span>
              )}
              {product?.discountPercent > 0 && (
                <span className="pdp-discount-pill text-xs font-bold">SAVE {product?.discountPercent}%</span>
              )}
            </div>
            <span className="text-10 text-muted block mt-1">Inclusive of all taxes. Free express shipping above ₹999</span>
          </div>

          {/* Size Selector */}
          {product?.sizes && product.sizes.length > 0 && (
            <div className="variant-block my-4">
              <div className="flex justify-between items-center mb-2">
                <span className="variant-label text-xs uppercase font-bold tracking-wider text-white">
                  SELECT SIZE: <span className="text-accent">{selectedSize}</span>
                </span>
                <button 
                  onClick={() => setShowSizeChart(true)}
                  className="size-chart-link text-xs text-accent flex items-center gap-1"
                >
                  <Ruler size={14} /> Size Chart
                </button>
              </div>

              <div className="size-buttons-row flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button 
                    key={size} 
                    className={`pdp-size-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selector */}
          {product?.colors && product.colors.length > 0 && (
            <div className="variant-block my-4">
              <span className="variant-label text-xs uppercase font-bold tracking-wider text-white block mb-2">
                COLOR / FINISH: <span className="text-accent">{selectedColor}</span>
              </span>
              <div className="color-buttons-row flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button 
                    key={color} 
                    className={`pdp-color-btn ${selectedColor === color ? 'active' : ''}`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pincode Estimator */}
          <div className="pincode-estimator-card p-4 border border-border bg-surface my-4 rounded">
            <span className="text-xs font-heading tracking-wider flex items-center gap-2 text-white mb-2">
              <MapPin size={14} color="var(--color-accent)" /> CHECK DELIVERY AVAILABILITY
            </span>
            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <input 
                type="text" 
                maxLength="6"
                placeholder="Enter 6-digit PIN code (e.g. 110001)"
                value={pincodeInput}
                onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                className="pincode-input flex-1"
              />
              <button type="submit" className="btn-secondary text-xs px-4 font-bold">CHECK</button>
            </form>
            {pincodeMessage && (
              <p className={`text-xs mt-2 ${pincodeMessage.success ? 'text-success' : 'text-error'}`}>
                {pincodeMessage.text}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pdp-actions-row flex gap-4 my-6">
            <button 
              onClick={handleAddToCart} 
              className="btn-secondary flex-1 text-center py-4 font-bold tracking-wider flex items-center justify-center gap-2"
            >
              <ShoppingBag size={18} /> ADD TO CART
            </button>
            <button 
              onClick={handleBuyNow} 
              className="btn-primary flex-1 text-center py-4 font-bold tracking-wider flex items-center justify-center gap-2"
            >
              <Zap size={18} /> BUY NOW
            </button>
          </div>

          {/* Guarantee Badges */}
          <div className="pdp-perks-grid grid-2 gap-3 pt-6 border-t border-border">
            <div className="flex items-center gap-3">
              <Truck size={20} color="var(--color-accent)" />
              <div className="flex-col">
                <strong className="text-xs text-white">Express Delivery</strong>
                <span className="text-10 text-muted">Free shipping on orders above ₹999</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw size={20} color="var(--color-accent)" />
              <div className="flex-col">
                <strong className="text-xs text-white">15-Day Returns</strong>
                <span className="text-10 text-muted">Doorstep exchange available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Bought Together Bundle */}
      {bundleItem && (
        <section className="bundle-section container py-10 border-t border-border">
          <div className="p-6 border border-border bg-surface rounded">
            <h3 className="text-xs font-heading tracking-widest text-accent uppercase mb-4">
              FREQUENTLY BOUGHT TOGETHER
            </h3>
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div className="flex items-center gap-4 flex-wrap">
                {/* Main Product */}
                <div className="flex items-center gap-3">
                  <img src={product?.image} alt={product?.title} className="w-16 h-16 object-cover border border-border rounded" />
                  <div className="flex-col text-xs">
                    <strong className="text-white">{product?.title}</strong>
                    <span className="text-accent font-bold">{formatINR(product?.price)}</span>
                  </div>
                </div>

                <Plus size={18} color="var(--color-accent)" />

                {/* Bundle Accessory */}
                <div className="flex items-center gap-3">
                  <img src={bundleItem.image} alt={bundleItem.title} className="w-16 h-16 object-cover border border-border rounded" />
                  <div className="flex-col text-xs">
                    <strong className="text-white">{bundleItem.title}</strong>
                    <span className="text-accent font-bold">{formatINR(bundleItem.price)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-10 text-muted block">Bundle Total:</span>
                  <strong className="text-accent text-lg font-mono font-bold">{formatINR(bundleTotal)}</strong>
                </div>
                <button 
                  onClick={handleAddBundle}
                  className="btn-primary text-xs py-3 px-5 font-bold flex items-center gap-2"
                >
                  <ShoppingBag size={14} /> ADD BOTH TO BAG
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Description & Specifications Section */}
      <section className="pdp-details-section container py-12 border-t border-border">
        <h2 className="section-title text-center mb-8">PRODUCT STORY & SPECIFICATIONS</h2>
        <div className="details-card p-8 border border-border bg-surface max-w-4xl mx-auto rounded">
          <p className="description-text leading-relaxed text-sm text-gray-300 mb-8">
            {product?.description || 'Mastercrafted with obsessive precision and attention to detail. Every contour, seam, and component represents the pinnacle of luxury design.'}
          </p>

          <h4 className="spec-heading text-xs text-accent tracking-widest uppercase mb-4 font-bold">
            TECHNICAL SPECIFICATIONS
          </h4>
          <div className="specs-table grid-2 gap-4 text-xs">
            <div className="spec-row p-3 border border-border flex justify-between">
              <span className="text-muted">Brand Atelier:</span>
              <span className="text-white font-bold">{product?.brand}</span>
            </div>
            <div className="spec-row p-3 border border-border flex justify-between">
              <span className="text-muted">Category Realm:</span>
              <span className="text-white font-bold">{product?.category}</span>
            </div>
            <div className="spec-row p-3 border border-border flex justify-between">
              <span className="text-muted">Authenticity Guarantee:</span>
              <span className="text-white font-bold">100% Certified Original</span>
            </div>
            <div className="spec-row p-3 border border-border flex justify-between">
              <span className="text-muted">Origin / Craftsmanship:</span>
              <span className="text-white font-bold">Handcrafted & Quality Inspected</span>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="reviews-section container py-12 border-t border-border">
        <div className="flex justify-between items-center mb-8">
          <div>
            <span className="text-xs text-accent tracking-widest uppercase font-bold">AUTHENTIC FEEDBACK</span>
            <h2 className="section-title mt-1">VERIFIED CLIENT REVIEWS ({reviewsList.length})</h2>
          </div>
          <button onClick={() => setShowReviewModal(true)} className="btn-secondary text-xs flex items-center gap-2">
            <MessageSquare size={14} /> WRITE A REVIEW
          </button>
        </div>

        <div className="reviews-grid grid-2 gap-6">
          {reviewsList.map(rev => (
            <div key={rev.id} className="review-card p-6 border border-border bg-surface flex-col rounded">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <strong className="text-sm text-white block">{rev.name}</strong>
                  <span className="text-10 text-muted">{rev.location} • {rev.date}</span>
                </div>
                {rev.verified && (
                  <span className="verified-badge text-10 text-success flex items-center gap-1">
                    <CheckCircle size={12} /> Verified Buyer
                  </span>
                )}
              </div>
              <div className="flex text-accent my-2">
                {[...Array(rev.rating).keys()].map(x => (
                  <Star key={x} size={14} fill="currentColor" />
                ))}
              </div>
              <h4 className="review-title text-sm text-white font-bold mb-1">{rev.title}</h4>
              <p className="review-comment text-xs text-muted leading-relaxed">{rev.comment}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <section className="similar-products container py-12 border-t border-border">
          <h2 className="section-title text-center mb-8">SIMILAR PRODUCTS</h2>
          <div className="products-showcase-grid grid-4 gap-6">
            {similarProducts.map(p => (
              <div key={p.id} className="luxury-product-card flex-col">
                <div className="card-media relative">
                  <Link to={`/product/${p.id}`}>
                    <img src={p.image} alt={p.title} />
                  </Link>
                </div>
                <div className="card-info p-4 flex-col flex-1 justify-between">
                  <div>
                    <span className="text-10 text-muted uppercase">{p.brand}</span>
                    <Link to={`/product/${p.id}`}>
                      <h4 className="product-title mt-1">{p.title}</h4>
                    </Link>
                  </div>
                  <div className="price-box mt-3 font-bold text-accent">{formatINR(p.price)}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recently Viewed Products */}
      {otherRecent.length > 0 && (
        <section className="recently-viewed container py-12 border-t border-border">
          <h2 className="section-title text-center mb-8">RECENTLY VIEWED</h2>
          <div className="products-showcase-grid grid-4 gap-6">
            {otherRecent.map(p => (
              <div key={p.id} className="luxury-product-card flex-col">
                <div className="card-media relative">
                  <Link to={`/product/${p.id}`}>
                    <img src={p.image} alt={p.title} />
                  </Link>
                </div>
                <div className="card-info p-4 flex-col flex-1 justify-between">
                  <div>
                    <span className="text-10 text-muted uppercase">{p.brand}</span>
                    <Link to={`/product/${p.id}`}>
                      <h4 className="product-title mt-1">{p.title}</h4>
                    </Link>
                  </div>
                  <div className="price-box mt-3 font-bold text-accent">{formatINR(p.price)}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="location-modal-overlay flex items-center justify-center">
          <div className="location-modal-card p-6 bg-surface border border-accent max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-heading tracking-wider text-white">STANDARD SIZING MATRIX</h3>
              <button onClick={() => setShowSizeChart(false)}><X size={18} /></button>
            </div>
            <table className="size-table w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-accent">
                  <th className="p-2">SIZE</th>
                  <th className="p-2">CHEST (IN)</th>
                  <th className="p-2">SHOULDER (IN)</th>
                  <th className="p-2">LENGTH (IN)</th>
                </tr>
              </thead>
              <tbody className="text-muted">
                <tr className="border-b border-border"><td className="p-2 text-white">S (38)</td><td className="p-2">38.0</td><td className="p-2">17.5</td><td className="p-2">28.0</td></tr>
                <tr className="border-b border-border"><td className="p-2 text-white">M (40)</td><td className="p-2">40.0</td><td className="p-2">18.0</td><td className="p-2">29.0</td></tr>
                <tr className="border-b border-border"><td className="p-2 text-white">L (42)</td><td className="p-2">42.0</td><td className="p-2">18.5</td><td className="p-2">30.0</td></tr>
                <tr><td className="p-2 text-white">XL (44)</td><td className="p-2">44.0</td><td className="p-2">19.0</td><td className="p-2">31.0</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="location-modal-overlay flex items-center justify-center">
          <div className="location-modal-card p-6 bg-surface border border-accent max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-heading tracking-wider text-white">SUBMIT CLIENT REVIEW</h3>
              <button onClick={() => setShowReviewModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleAddReview} className="flex-col gap-4">
              <div>
                <label className="text-xs text-accent block mb-1">RATING</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star} 
                      type="button" 
                      onClick={() => setReviewRating(star)}
                      className="text-accent cursor-pointer"
                    >
                      <Star size={20} fill={star <= reviewRating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group flex-col">
                <label className="text-xs text-accent">REVIEW TITLE</label>
                <input 
                  type="text" 
                  value={reviewTitle} 
                  onChange={(e) => setReviewTitle(e.target.value)} 
                  placeholder="e.g. Excellent Product"
                  required 
                  className="p-2 bg-bg border border-border text-white text-xs"
                />
              </div>

              <div className="form-group flex-col">
                <label className="text-xs text-accent">FEEDBACK</label>
                <textarea 
                  rows="4" 
                  value={reviewComment} 
                  onChange={(e) => setReviewComment(e.target.value)} 
                  placeholder="Describe the quality, fit, and delivery experience..."
                  required 
                  className="p-2 bg-bg border border-border text-white text-xs"
                />
              </div>

              <button type="submit" className="btn-primary mt-2 w-full py-3 font-bold">
                SUBMIT VERIFIED REVIEW
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
