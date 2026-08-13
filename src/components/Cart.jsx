import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import './Cart.css';

const Cart = () => {
  const [items, setItems] = useState([
    {
      id: '1',
      title: 'THE CHRONOGRAPH',
      subtitle: 'Limited Edition Timepiece',
      price: 12500.00,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
      quantity: 1
    }
  ]);

  const updateQuantity = (id, newQty) => {
    setItems(items.map(item => item.id === id ? { ...item, quantity: parseInt(newQty) } : item));
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="luxury-cart-page container">
      <div className="cart-header text-center">
        <h1>YOUR SELECTION</h1>
        <p className="subtitle mt-2">Review your exclusive items before completing the acquisition.</p>
      </div>

      <div className="cart-content flex gap-8 mt-8">
        {/* Left: Items */}
        <div className="cart-items-section flex-col flex-1">
          {items.length === 0 ? (
            <div className="empty-cart flex-col items-center justify-center p-8 border border-border">
              <p className="mb-4 text-muted">Your selection is currently empty.</p>
              <Link to="/products" className="btn-secondary">Explore Collection</Link>
            </div>
          ) : (
            <div className="items-list flex-col gap-4">
              {items.map(item => (
                <div className="luxury-cart-item flex gap-6" key={item.id}>
                  <div className="item-image">
                    <img src={item.image} alt={item.title} />
                  </div>
                  <div className="item-details flex-col justify-center flex-1">
                    <span className="item-subtitle">{item.subtitle}</span>
                    <Link to={`/product/${item.id}`} className="item-title">{item.title}</Link>
                    
                    <div className="item-actions flex items-center gap-6 mt-4">
                      <div className="qty-selector flex items-center gap-2">
                        <span className="text-xs text-muted">QTY:</span>
                        <select 
                          value={item.quantity} 
                          onChange={(e) => updateQuantity(item.id, e.target.value)}
                        >
                          {[1,2,3,4,5].map(x => (
                            <option key={x} value={x}>{x}</option>
                          ))}
                        </select>
                      </div>
                      <button className="remove-btn flex items-center gap-1" onClick={() => removeItem(item.id)}>
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

        {/* Right: Summary */}
        {items.length > 0 && (
          <div className="cart-summary-section">
            <div className="summary-card p-6">
              <h3 className="summary-title mb-6">ORDER SUMMARY</h3>
              
              <div className="summary-row flex justify-between mb-4">
                <span className="text-muted">Subtotal</span>
                <span>${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
              <div className="summary-row flex justify-between mb-4">
                <span className="text-muted">Complimentary Shipping</span>
                <span>$0.00</span>
              </div>
              
              <hr className="divider my-4" />
              
              <div className="summary-row total flex justify-between mb-8">
                <span>TOTAL</span>
                <span className="total-price">${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>

              <Link to="/checkout" className="btn-primary w-full text-center">PROCEED TO CHECKOUT</Link>
              
              <div className="secure-checkout mt-4 text-center text-xs text-muted">
                Secure encrypted checkout processing.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
