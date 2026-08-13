import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductList.css';

// Using high-end aesthetic products
export const MOCK_PRODUCTS = [
  {
    id: '1',
    title: 'THE CHRONOGRAPH',
    subtitle: 'Limited Edition Timepiece',
    price: 12500.00,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    category: 'Watches'
  },
  {
    id: '2',
    title: 'AURA ACOUSTICS',
    subtitle: 'Studio-grade Wireless Audio',
    price: 890.00,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80',
    category: 'Audio'
  },
  {
    id: '3',
    title: 'OBSIDIAN LAPTOP',
    subtitle: 'Next-generation computing',
    price: 3400.00,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    category: 'Tech'
  },
  {
    id: '4',
    title: 'STEALTH KEYBOARD',
    subtitle: 'Tactile perfection',
    price: 450.00,
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80',
    category: 'Tech'
  }
];

const ProductList = () => {
  const [filter, setFilter] = useState('All');

  return (
    <div className="luxury-catalog">
      <div className="catalog-header flex-col items-center justify-center">
        <h1>THE COLLECTION</h1>
        <p>Precision engineered for the elite.</p>
      </div>

      <div className="catalog-container container flex">
        {/* Minimalist Sidebar */}
        <aside className="catalog-sidebar">
          <h3>CATEGORIES</h3>
          <ul className="luxury-filter">
            <li className={filter === 'All' ? 'active' : ''} onClick={() => setFilter('All')}>ALL</li>
            <li className={filter === 'Watches' ? 'active' : ''} onClick={() => setFilter('Watches')}>TIMEPIECES</li>
            <li className={filter === 'Audio' ? 'active' : ''} onClick={() => setFilter('Audio')}>ACOUSTICS</li>
            <li className={filter === 'Tech' ? 'active' : ''} onClick={() => setFilter('Tech')}>TECHNOLOGY</li>
          </ul>
        </aside>

        {/* Product Grid */}
        <main className="catalog-main">
          <div className="luxury-grid">
            {MOCK_PRODUCTS.filter(p => filter === 'All' || p.category === filter).map(product => (
              <div className="luxury-card" key={product.id}>
                <Link to={`/product/${product.id}`} className="card-image-wrap">
                  <img src={product.image} alt={product.title} />
                  <div className="quick-view">EXPLORE</div>
                </Link>
                <div className="card-info flex justify-between items-end">
                  <div className="flex-col">
                    <span className="subtitle">{product.subtitle}</span>
                    <Link to={`/product/${product.id}`} className="title">{product.title}</Link>
                  </div>
                  <div className="price">${product.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductList;
