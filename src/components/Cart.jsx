import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Tag, Check, X, ShieldCheck, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    removeFromCart, 
    updateCartQty, 
    cartSubtotal, 
    discountAmount, 
    cartTotal, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon, 
    couponError,
    availableCoupons
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [showCouponsModal, setShowCouponsModal] = useState(false);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      const success = applyCoupon(couponInput);
      if (success) setCouponInput('');
    }
  };

  return (
    <div className="luxury-cart-page container">
      <div className="cart-header text-center">
        <h1>YOUR SELECTION</h1>
        <p className="subtitle mt-2">Review your exclusive items before completing the acquisition.</p>
      </div>

      <div className="cart-content flex gap-8 mt-8">
        {/* Left: Items */}
        <div className="cart-items-section flex-col flex-1">
          {cart.length === 0 ? (
            <div className="empty-cart flex-col items-center justify-center p-12 border border-border">
              <p className="mb-4 text-muted">Your acquisition cart is currently empty.</p>
              <Link to="/products" className="btn-primary">EXPLORE THE SHOWROOM</Link>
            </div>
          ) : (
            <div className="items-list flex-col gap-4">
              {cart.map((item, idx) => (
                <div className="luxury-cart-item flex gap-6" key={`${item.id}-${item.size}-${item.color}-${idx}`}>
                  <div className="item-image">
                    <Link to={`/product/${item.id}`}>
                      <img src={item.image} alt={item.title} />
                    </Link>
                  </div>
                  <div className="item-details flex-col justify-center flex-1">
                    <span className="item-subtitle">{item.subtitle || 'EXCLUSIVE'}</span>
                    <Link to={`/product/${item.id}`} className="item-title">{item.title}</Link>
                    
                    <div className="item-meta flex gap-4 mt-1 text-xs text-muted">
                      {item.size && <span>Size: <strong className="text-white">{item.size}</strong></span>}
                      {item.color && <span>Finish: <strong className="text-white">{item.color}</strong></span>}
                    </div>

                    <div className="item-actions flex items-center gap-6 mt-4">
                      <div className="qty-control flex items-center">
                        <button 
                          className="qty-btn" 
                          onClick={() => updateCartQty(item.id, item.quantity - 1, item.size, item.color)}
                        >
                          -
                        </button>
                        <span className="qty-number">{item.quantity}</span>
                        <button 
                          className="qty-btn" 
                          onClick={() => updateCartQty(item.id, item.quantity + 1, item.size, item.color)}
                        >
                          +
                        </button>
                      </div>

                      <button 
                        className="remove-btn flex items-center gap-1" 
                        onClick={() => removeFromCart(item.id, item.size, item.color)}
                      >
                        <Trash2 size={14} /> <span className="text-xs">REMOVE</span>
                      </button>
                    </div>
                  </div>
                  <div className="item-price flex items-center">
                    ${(item.price * item.quantity).toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Summary & Promo Code (Like Myntra / Ajio) */}
        {cart.length > 0 && (
          <div className="cart-summary-section">
            {/* Promo Code Box */}
            <div className="coupon-box-card p-6 mb-6">
              <h4 className="coupon-title flex items-center gap-2 mb-3">
                <Tag size={16} color="var(--color-accent)" /> APPLY PROMO COUPON
              </h4>

              {appliedCoupon ? (
                <div className="applied-coupon-pill flex justify-between items-center p-3">
                  <div className="flex items-center gap-2">
                    <Check size={16} color="#00c851" />
                    <div>
                      <span className="font-bold text-xs text-accent">{appliedCoupon.code}</span>
                      <span className="text-xs block text-muted">Applied successfully</span>
                    </div>
                  </div>
                  <button onClick={removeCoupon} className="remove-coupon-btn text-xs text-error">
                    REMOVE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="coupon-form flex gap-2">
                  <input 
                    type="text" 
                    placeholder="e.g. KUKU500, LUXURY20" 
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="coupon-input flex-1"
                  />
                  <button type="submit" className="btn-secondary text-xs">APPLY</button>
                </form>
              )}

              {couponError && (
                <p className="coupon-error-text text-xs text-error mt-2">{couponError}</p>
              )}

              <button 
                className="view-available-coupons-btn text-xs mt-3 text-accent"
                onClick={() => setShowCouponsModal(!showCouponsModal)}
              >
                {showCouponsModal ? 'Hide active coupons' : 'View active luxury coupons (3)'}
              </button>

              {showCouponsModal && (
                <div className="available-coupons-list mt-3 flex-col gap-2">
                  {availableCoupons.map(c => (
                    <div key={c.code} className="coupon-item-mini p-2 border border-border flex justify-between items-center">
                      <div>
                        <strong className="text-accent text-xs block">{c.code}</strong>
                        <span className="text-muted text-xs">{c.desc}</span>
                      </div>
                      <button 
                        className="btn-secondary text-xs py-1 px-2"
                        onClick={() => applyCoupon(c.code)}
                      >
                        USE
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="summary-card p-6">
              <h3 className="summary-title mb-6">ORDER SUMMARY</h3>
              <div className="summary-row flex justify-between mb-3">
                <span className="text-muted">Item Subtotal</span>
                <span>${cartSubtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>

              {discountAmount > 0 && (
                <div className="summary-row flex justify-between mb-3 text-success">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>-${discountAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
              )}

              <div className="summary-row flex justify-between mb-4">
                <span className="text-muted">Complimentary Shipping</span>
                <span className="text-accent">FREE</span>
              </div>

              <hr className="divider my-4" />

              <div className="summary-row total flex justify-between mb-6">
                <span>PAYABLE TOTAL</span>
                <span className="total-price">${cartTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>

              <Link to="/checkout" className="btn-primary w-full text-center flex items-center justify-center gap-2">
                PROCEED TO CHECKOUT <ArrowRight size={16} />
              </Link>

              <div className="secure-checkout mt-4 text-center text-xs text-muted flex items-center justify-center gap-1">
                <ShieldCheck size={14} color="var(--color-accent)" /> 256-bit SSL encrypted checkout
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
