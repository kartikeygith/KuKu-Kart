import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Tag, 
  Check, 
  X, 
  ShieldCheck, 
  ArrowRight, 
  Heart, 
  ShoppingBag, 
  Truck, 
  Sparkles,
  Info
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatCurrency } from '../../utils/helpers';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    removeFromCart, 
    updateCartQty, 
    toggleWishlist,
    cartMRP,
    cartSubtotal, 
    discountOnMRP,
    discountAmount, 
    deliveryFee,
    platformFee,
    cartTotal, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon, 
    couponError,
    availableCoupons,
    deliveryCity,
    deliveryPincode
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [showCouponsDrawer, setShowCouponsDrawer] = useState(false);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      const success = applyCoupon(couponInput);
      if (success) setCouponInput('');
    }
  };

  const handleMoveToWishlist = (item) => {
    toggleWishlist(item);
    removeFromCart(item.id, item.size, item.color);
  };

  return (
    <div className="cart-page-container container">
      {/* Header */}
      <div className="cart-header-section flex justify-between items-end pb-4 border-b border-border mb-8">
        <div>
          <span className="text-xs text-accent tracking-widest uppercase">ACQUISITION SUMMARY</span>
          <h1 className="cart-main-title mt-1">YOUR SHOPPING BAG ({cart.reduce((sum, i) => sum + i.quantity, 0)})</h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <Truck size={14} color="var(--color-accent)" />
          <span>Delivering to: <strong className="text-white">{deliveryCity} - {deliveryPincode}</strong></span>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart-state p-16 text-center border border-border bg-surface flex-col items-center">
          <ShoppingBag size={48} color="var(--color-accent)" className="mb-4" />
          <h2 className="text-lg font-heading tracking-widest text-white mb-2">YOUR SHOPPING BAG IS EMPTY</h2>
          <p className="text-xs text-muted max-w-md mx-auto mb-8">
            Explore our curated collections of luxury couture, precision timepieces, and flagship acoustics.
          </p>
          <div className="flex gap-4">
            <Link to="/products" className="btn-primary">EXPLORE SHOWROOM</Link>
            <Link to="/wishlist" className="btn-secondary">VIEW WISHLIST</Link>
          </div>
        </div>
      ) : (
        <div className="cart-grid-layout flex gap-8">
          
          {/* Left Column: Cart Items List */}
          <div className="cart-items-column flex-col flex-1 gap-4">
            {/* Free Delivery Banner */}
            <div className="free-shipping-bar p-3 bg-surface border border-border flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-white">
                <Sparkles size={14} color="var(--color-accent)" />
                <strong>Complimentary Express White-Glove Delivery</strong> unlocked!
              </span>
              <span className="text-accent font-bold">FREE ($0.00)</span>
            </div>

            {/* List */}
            <div className="cart-items-wrapper flex-col gap-4">
              {cart.map((item, idx) => (
                <div 
                  key={`${item.id}-${item.size}-${item.color}-${idx}`}
                  className="cart-item-card p-4 border border-border bg-surface flex gap-5"
                >
                  <div className="cart-item-thumb">
                    <Link to={`/product/${item.id}`}>
                      <img src={item.image} alt={item.title} />
                    </Link>
                  </div>

                  <div className="cart-item-details flex-col justify-between flex-1">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-10 text-muted uppercase tracking-wider">{item.subtitle || 'KUKU LUXURY'}</span>
                          <Link to={`/product/${item.id}`}>
                            <h3 className="cart-item-title mt-1">{item.title}</h3>
                          </Link>
                        </div>
                        <div className="cart-item-pricing text-right">
                          <span className="item-final-price font-bold text-accent">
                            ${(item.price * item.quantity).toLocaleString()}
                          </span>
                          {item.originalPrice && (
                            <span className="item-mrp text-xs text-muted block line-through">
                              ${(item.originalPrice * item.quantity).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Size & Color Tags */}
                      <div className="cart-item-variants flex gap-4 mt-2 text-xs">
                        {item.size && (
                          <span className="variant-pill">Size: <strong className="text-white">{item.size}</strong></span>
                        )}
                        {item.color && (
                          <span className="variant-pill">Finish: <strong className="text-white">{item.color}</strong></span>
                        )}
                      </div>
                    </div>

                    {/* Actions & Quantity */}
                    <div className="cart-item-bottom-bar flex justify-between items-center mt-4 pt-3 border-t border-border">
                      <div className="quantity-stepper flex items-center">
                        <button 
                          className="stepper-btn"
                          onClick={() => updateCartQty(item.id, item.quantity - 1, item.size, item.color)}
                        >
                          -
                        </button>
                        <span className="stepper-qty">{item.quantity}</span>
                        <button 
                          className="stepper-btn"
                          onClick={() => updateCartQty(item.id, item.quantity + 1, item.size, item.color)}
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-4 text-xs">
                        <button 
                          onClick={() => handleMoveToWishlist(item)}
                          className="text-muted hover:text-accent flex items-center gap-1"
                        >
                          <Heart size={13} /> Move to Wishlist
                        </button>
                        <button 
                          onClick={() => removeFromCart(item.id, item.size, item.color)}
                          className="text-muted hover:text-error flex items-center gap-1"
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Coupons & Price Bill Summary (Like Myntra / JioMart) */}
          <div className="cart-sidebar-column flex-col">
            {/* 1. Coupons Box */}
            <div className="coupon-box-card p-5 border border-border bg-surface mb-5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-heading tracking-wider flex items-center gap-2 text-white">
                  <Tag size={14} color="var(--color-accent)" /> COUPONS & PRIVILEGES
                </span>
                <button 
                  onClick={() => setShowCouponsDrawer(!showCouponsDrawer)}
                  className="text-10 text-accent underline cursor-pointer"
                >
                  {showCouponsDrawer ? 'Close Offers' : 'View Offers (4)'}
                </button>
              </div>

              {appliedCoupon ? (
                <div className="coupon-applied-pill p-3 border border-success bg-bg flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Check size={16} color="#00c851" />
                    <div>
                      <span className="font-bold text-xs text-accent">{appliedCoupon.code}</span>
                      <span className="text-10 block text-muted">{appliedCoupon.desc}</span>
                    </div>
                  </div>
                  <button onClick={removeCoupon} className="text-10 text-error font-bold">
                    REMOVE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="coupon-form flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter Coupon Code (e.g. KUKU500)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="coupon-input-field flex-1"
                  />
                  <button type="submit" className="btn-secondary text-xs px-3">APPLY</button>
                </form>
              )}

              {couponError && <p className="text-error text-xs mt-2">{couponError}</p>}

              {/* Coupons Drawer */}
              {showCouponsDrawer && (
                <div className="coupons-drawer-list flex-col gap-2 mt-4 pt-3 border-t border-border">
                  {availableCoupons.map(c => (
                    <div key={c.code} className="coupon-option-item p-3 border border-border bg-bg flex justify-between items-center">
                      <div>
                        <strong className="text-accent text-xs block">{c.code}</strong>
                        <span className="text-10 text-muted">{c.desc}</span>
                      </div>
                      <button 
                        className="btn-secondary text-10 py-1 px-2"
                        onClick={() => applyCoupon(c.code)}
                      >
                        APPLY
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Bill Breakdown Summary (Myntra Standard) */}
            <div className="bill-summary-card p-6 border border-border bg-surface">
              <h3 className="summary-heading text-xs font-heading tracking-widest text-white pb-3 border-b border-border mb-4">
                PRICE DETAILS ({cart.reduce((sum, i) => sum + i.quantity, 0)} Items)
              </h3>

              <div className="price-breakdown-row flex justify-between text-xs mb-3">
                <span className="text-muted">Total MRP</span>
                <span>${cartMRP.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>

              {discountOnMRP > 0 && (
                <div className="price-breakdown-row flex justify-between text-xs mb-3 text-success">
                  <span>Discount on MRP</span>
                  <span>-${discountOnMRP.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
              )}

              {discountAmount > 0 && (
                <div className="price-breakdown-row flex justify-between text-xs mb-3 text-success">
                  <span>Privilege Coupon ({appliedCoupon?.code})</span>
                  <span>-${discountAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
              )}

              <div className="price-breakdown-row flex justify-between text-xs mb-3">
                <span className="text-muted">Convenience & Delivery Fee</span>
                <span className="text-accent font-bold">FREE</span>
              </div>

              <hr className="divider my-4" />

              <div className="total-payable-row flex justify-between items-baseline mb-6">
                <strong className="text-white text-sm font-heading tracking-wider">TOTAL AMOUNT</strong>
                <strong className="text-accent text-xl font-bold font-mono">
                  ${cartTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}
                </strong>
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="btn-primary w-full py-4 font-bold tracking-widest flex items-center justify-center gap-2"
              >
                PLACE ORDER <ArrowRight size={16} />
              </button>

              <div className="security-guarantee-note flex items-center justify-center gap-2 mt-4 text-10 text-muted">
                <ShieldCheck size={14} color="var(--color-accent)" /> 256-bit Encrypted SSL Checkout
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;
