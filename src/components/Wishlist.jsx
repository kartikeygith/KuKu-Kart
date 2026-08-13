import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import './Wishlist.css';
import { MOCK_PRODUCTS } from './ProductList';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState(MOCK_PRODUCTS.slice(0, 2));

  const removeItem = (id) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
  };

  return (
    <div className="wishlist-page container">
      <div className="wishlist-header text-center">
        <div className="flex items-center justify-center gap-2">
          <Heart size={28} color="var(--color-accent)" fill="var(--color-accent)" />
          <h1>MY WISHLIST</h1>
        </div>
        <p className="subtitle mt-2">{wishlistItems.length} Saved Luxury Items</p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="empty-wishlist text-center p-12 mt-8 border border-border">
          <p className="text-muted mb-4">Your wishlist is currently empty.</p>
          <Link to="/products" className="btn-primary">EXPLORE COLLECTION</Link>
        </div>
      ) : (
        <div className="wishlist-grid grid-3 mt-8">
          {wishlistItems.map(item => (
            <div key={item.id} className="wishlist-card flex-col">
              <div className="card-img-wrap">
                <img src={item.image} alt={item.title} />
                <button className="remove-heart-btn" onClick={() => removeItem(item.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="card-body p-4 flex-col flex-1 justify-between">
                <div>
                  <span className="subtitle">{item.subtitle}</span>
                  <h3 className="title">{item.title}</h3>
                  <div className="price mt-2">${item.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                </div>
                <Link to="/cart" className="btn-secondary flex items-center justify-center gap-2 mt-4 text-center">
                  <ShoppingBag size={16} /> MOVE TO CART
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
