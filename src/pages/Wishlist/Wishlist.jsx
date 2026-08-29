import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlist, toggleWishlist, addToCart } = useShop();

  const handleMoveToCart = (item) => {
    addToCart(item, item.sizes?.[0] || 'Standard', item.colors?.[0] || 'Default', 1);
    toggleWishlist(item);
  };

  const handleMoveAllToCart = () => {
    wishlist.forEach(item => {
      addToCart(item, item.sizes?.[0] || 'Standard', item.colors?.[0] || 'Default', 1);
    });
  };

  return (
    <div className="wishlist-page-container container">
      {/* Header */}
      <div className="wishlist-header flex justify-between items-end pb-4 border-b border-border mb-8">
        <div>
          <span className="text-xs text-accent tracking-widest uppercase">PRIVATE SELECTION</span>
          <h1 className="wishlist-title mt-1 flex items-center gap-3">
            <Heart size={24} color="var(--color-accent)" fill="var(--color-accent)" />
            MY WISHLIST ({wishlist.length} Items)
          </h1>
        </div>
        {wishlist.length > 0 && (
          <button 
            onClick={handleMoveAllToCart}
            className="btn-secondary text-xs flex items-center gap-2"
          >
            <ShoppingBag size={14} /> MOVE ALL TO BAG
          </button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="empty-wishlist-box p-16 text-center border border-border bg-surface flex-col items-center">
          <Heart size={48} color="var(--color-accent)" className="mb-4" />
          <h2 className="text-lg font-heading tracking-widest text-white mb-2">YOUR WISHLIST IS EMPTY</h2>
          <p className="text-xs text-muted max-w-md mx-auto mb-8">
            Bookmark your favorite haute couture garments, timepieces, and acoustic masterpieces to purchase later.
          </p>
          <Link to="/products" className="btn-primary">EXPLORE SHOWROOM</Link>
        </div>
      ) : (
        <div className="wishlist-items-grid grid-4 gap-6">
          {wishlist.map(item => (
            <div key={item.id} className="wishlist-card flex-col border border-border bg-surface">
              <div className="wishlist-media relative">
                <Link to={`/product/${item.id}`}>
                  <img src={item.image} alt={item.title} />
                </Link>
                <button 
                  className="wishlist-delete-btn"
                  onClick={() => toggleWishlist(item)}
                  title="Remove from wishlist"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="wishlist-info p-4 flex-col flex-1 justify-between">
                <div>
                  <span className="text-10 text-muted uppercase tracking-wider">{item.brand || item.category}</span>
                  <Link to={`/product/${item.id}`}>
                    <h4 className="wishlist-item-name mt-1">{item.title}</h4>
                  </Link>
                  <div className="price-tag-wishlist mt-2 font-bold text-accent">
                    ${item.price.toLocaleString()}
                  </div>
                </div>

                <div className="wishlist-card-actions flex gap-2 mt-4 pt-3 border-t border-border">
                  <button 
                    onClick={() => handleMoveToCart(item)}
                    className="btn-primary flex-1 py-2 text-xs flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={13} /> MOVE TO BAG
                  </button>
                  <Link to={`/product/${item.id}`} className="btn-secondary px-3 flex items-center justify-center">
                    <ArrowRight size={13} />
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
