import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlist, toggleWishlist, addToCart } = useShop();

  const handleMoveToCart = (item) => {
    addToCart(item, 'Standard', 'Default', 1);
    toggleWishlist(item);
  };

  return (
    <div className="wishlist-page container">
      <div className="wishlist-header text-center">
        <div className="flex items-center justify-center gap-2">
          <Heart size={28} color="var(--color-accent)" fill="var(--color-accent)" />
          <h1>MY WISHLIST</h1>
        </div>
        <p className="subtitle mt-2">{wishlist.length} Saved Luxury Pieces</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="empty-wishlist text-center p-12 mt-8 border border-border">
          <p className="text-muted mb-4">Your wishlist is currently empty.</p>
          <Link to="/products" className="btn-primary">EXPLORE THE SHOWROOM</Link>
        </div>
      ) : (
        <div className="wishlist-grid grid-3 mt-8">
          {wishlist.map(item => (
            <div key={item.id} className="wishlist-card flex-col">
              <div className="card-img-wrap">
                <Link to={`/product/${item.id}`}>
                  <img src={item.image} alt={item.title} />
                </Link>
                <button 
                  className="remove-heart-btn" 
                  onClick={() => toggleWishlist(item)}
                  title="Remove from wishlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="card-body p-4 flex-col flex-1 justify-between">
                <div>
                  <span className="subtitle">{item.subtitle || item.category}</span>
                  <Link to={`/product/${item.id}`}>
                    <h3 className="title">{item.title}</h3>
                  </Link>
                  <div className="price mt-2">${item.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={() => handleMoveToCart(item)} 
                    className="btn-primary flex items-center justify-center gap-2 flex-1 text-xs text-center"
                  >
                    <ShoppingBag size={14} /> MOVE TO CART
                  </button>
                  <Link to={`/product/${item.id}`} className="btn-secondary text-xs flex items-center justify-center px-3" title="View details">
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
