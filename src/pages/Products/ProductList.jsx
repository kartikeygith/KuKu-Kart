import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Filter, 
  Grid3X3, 
  List, 
  SlidersHorizontal, 
  Star, 
  Heart, 
  ShoppingBag, 
  Check, 
  X, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatINR } from '../../utils/helpers';
import './ProductList.css';

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories, brands, toggleWishlist, isInWishlist, addToCart } = useShop();

  const urlCategory = searchParams.get('category') || 'All';
  const urlBrand = searchParams.get('brand') || 'All';
  const urlSearch = searchParams.get('search') || '';

  // Local filter states
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [selectedBrand, setSelectedBrand] = useState(urlBrand);
  const [priceRange, setPriceRange] = useState(100000);
  const [minRating, setMinRating] = useState(0);
  const [minDiscount, setMinDiscount] = useState(0);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'price_low' | 'price_high' | 'rating' | 'discount'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [addedIds, setAddedIds] = useState({});

  useEffect(() => {
    if (urlCategory) setSelectedCategory(urlCategory);
  }, [urlCategory]);

  useEffect(() => {
    if (urlBrand) setSelectedBrand(urlBrand);
  }, [urlBrand]);

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.sizes?.[0] || 'Standard', product.colors?.[0] || 'Default', 1);
    setAddedIds(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds(prev => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedBrand('All');
    setPriceRange(100000);
    setMinRating(0);
    setMinDiscount(0);
    setOnlyInStock(false);
    setSearchParams({});
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category
      if (selectedCategory !== 'All' && p.category?.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      // Brand
      if (selectedBrand !== 'All' && p.brand?.toLowerCase() !== selectedBrand.toLowerCase()) return false;
      // Search
      if (urlSearch && !p.title.toLowerCase().includes(urlSearch.toLowerCase()) && 
          !(p.subtitle && p.subtitle.toLowerCase().includes(urlSearch.toLowerCase())) &&
          !(p.brand && p.brand.toLowerCase().includes(urlSearch.toLowerCase())) &&
          !(p.category && p.category.toLowerCase().includes(urlSearch.toLowerCase()))) {
        return false;
      }
      // Price
      if (p.price > priceRange) return false;
      // Rating
      if (minRating > 0 && p.rating < minRating) return false;
      // Discount
      if (minDiscount > 0 && (p.discountPercent || 0) < minDiscount) return false;
      // Stock
      if (onlyInStock && p.stock <= 0) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_low') return a.price - b.price;
      if (sortBy === 'price_high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') return (b.discountPercent || 0) - (a.discountPercent || 0);
      return 0;
    });
  }, [products, selectedCategory, selectedBrand, urlSearch, priceRange, minRating, minDiscount, onlyInStock, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="products-page">
      {/* Banner */}
      <div className="catalog-header container flex justify-between items-center">
        <div>
          <span className="text-xs text-accent tracking-widest uppercase font-bold">KUKU KART SHOWROOM</span>
          <h1 className="catalog-title mt-1">
            {urlSearch ? `RESULTS FOR "${urlSearch.toUpperCase()}"` : selectedCategory === 'All' ? 'ALL COLLECTIONS & ATELIERS' : selectedCategory.toUpperCase()}
          </h1>
          <p className="text-xs text-muted mt-1">
            Showing {filteredProducts.length} certified products in Indian Rupees
          </p>
        </div>

        {/* View & Sort Bar */}
        <div className="catalog-controls flex items-center gap-4">
          <div className="flex items-center gap-1 border border-border bg-surface p-1 rounded">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <Grid3X3 size={16} />
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <List size={16} />
            </button>
          </div>

          <div className="sort-box flex items-center gap-2">
            <label className="text-10 text-muted uppercase">SORT BY:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="discount">Discount Percentage</option>
            </select>
          </div>
        </div>
      </div>

      <div className="catalog-layout container flex gap-8 py-8">
        
        {/* Left Filter Sidebar */}
        <aside className="filter-sidebar">
          <div className="flex justify-between items-center pb-3 border-b border-border mb-4">
            <span className="font-heading text-xs tracking-wider flex items-center gap-2 text-white">
              <SlidersHorizontal size={14} color="var(--color-accent)" /> FILTERS
            </span>
            <button onClick={resetFilters} className="text-10 text-accent flex items-center gap-1">
              <RotateCcw size={10} /> CLEAR ALL
            </button>
          </div>

          {/* 1. Category Filter */}
          <div className="filter-group mb-6">
            <h4 className="filter-label">CATEGORIES</h4>
            <ul className="filter-list flex-col gap-1 mt-2">
              <li 
                className={`filter-item ${selectedCategory === 'All' ? 'active' : ''}`}
                onClick={() => { setSelectedCategory('All'); setCurrentPage(1); }}
              >
                All Collections
              </li>
              {categories.map(cat => (
                <li 
                  key={cat.id} 
                  className={`filter-item ${selectedCategory.toLowerCase() === cat.name.toLowerCase() ? 'active' : ''}`}
                  onClick={() => { setSelectedCategory(cat.name); setCurrentPage(1); }}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          </div>

          {/* 2. Brand Filter */}
          <div className="filter-group mb-6">
            <h4 className="filter-label">BRAND / ATELIER</h4>
            <div className="filter-list flex-col gap-1 mt-2 max-h-48 overflow-y-auto">
              <li 
                className={`filter-item ${selectedBrand === 'All' ? 'active' : ''}`}
                onClick={() => { setSelectedBrand('All'); setCurrentPage(1); }}
              >
                All Brands
              </li>
              {brands.map(brand => (
                <li 
                  key={brand} 
                  className={`filter-item ${selectedBrand === brand ? 'active' : ''}`}
                  onClick={() => { setSelectedBrand(brand); setCurrentPage(1); }}
                >
                  {brand}
                </li>
              ))}
            </div>
          </div>

          {/* 3. Price Range Slider (INR) */}
          <div className="filter-group mb-6">
            <div className="flex justify-between items-center">
              <h4 className="filter-label">PRICE CEILING</h4>
              <span className="text-xs text-accent font-bold">{formatINR(priceRange)}</span>
            </div>
            <input 
              type="range" 
              min="500" 
              max="100000" 
              step="500"
              value={priceRange} 
              onChange={(e) => { setPriceRange(parseFloat(e.target.value)); setCurrentPage(1); }}
              className="price-slider w-full mt-2"
            />
            <div className="flex justify-between text-10 text-muted mt-1">
              <span>₹500</span>
              <span>₹1,00,000</span>
            </div>
          </div>

          {/* 4. Customer Rating */}
          <div className="filter-group mb-6">
            <h4 className="filter-label">MINIMUM RATING</h4>
            <div className="flex gap-1 mt-2">
              {[4, 4.5, 4.8].map(r => (
                <button 
                  key={r} 
                  className={`rating-pill-btn ${minRating === r ? 'active' : ''}`}
                  onClick={() => setMinRating(minRating === r ? 0 : r)}
                >
                  {r}★+
                </button>
              ))}
            </div>
          </div>

          {/* 5. Discount Percentage */}
          <div className="filter-group mb-6">
            <h4 className="filter-label">MINIMUM DISCOUNT</h4>
            <div className="flex flex-wrap gap-1 mt-2">
              {[15, 20, 30].map(d => (
                <button 
                  key={d} 
                  className={`rating-pill-btn ${minDiscount === d ? 'active' : ''}`}
                  onClick={() => setMinDiscount(minDiscount === d ? 0 : d)}
                >
                  {d}% OFF+
                </button>
              ))}
            </div>
          </div>

          {/* 6. Availability */}
          <div className="filter-group mb-6">
            <label className="flex items-center gap-2 text-xs text-muted cursor-pointer">
              <input 
                type="checkbox" 
                checked={onlyInStock} 
                onChange={(e) => setOnlyInStock(e.target.checked)} 
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Product Grid / List */}
        <main className="catalog-products-area flex-1">
          {paginatedProducts.length === 0 ? (
            <div className="no-products p-12 text-center border border-border bg-surface">
              <h3 className="text-sm font-heading tracking-widest text-white mb-2">NO MATCHING PRODUCTS FOUND</h3>
              <p className="text-xs text-muted mb-6">Try adjusting your filters or search keywords.</p>
              <button onClick={resetFilters} className="btn-secondary text-xs">RESET ALL FILTERS</button>
            </div>
          ) : (
            <>
              <div className={`products-container ${viewMode === 'grid' ? 'grid-view' : 'list-view'}`}>
                {paginatedProducts.map(product => {
                  const wishlisted = isInWishlist(product.id);
                  const isAdded = addedIds[product.id];

                  return (
                    <div className="product-card-wrap flex-col" key={product.id}>
                      <div className="product-media relative">
                        <Link to={`/product/${product.id}`}>
                          <img src={product.image} alt={product.title} loading="lazy" />
                        </Link>
                        
                        <button 
                          className={`wishlist-btn-card ${wishlisted ? 'active' : ''}`}
                          onClick={() => toggleWishlist(product)}
                          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        >
                          <Heart size={16} fill={wishlisted ? 'var(--color-accent)' : 'none'} color={wishlisted ? 'var(--color-accent)' : '#fff'} />
                        </button>

                        {product.discountPercent > 0 && (
                          <span className="card-discount-badge">{product.discountPercent}% OFF</span>
                        )}

                        <div className="card-hover-actions flex items-center justify-center gap-2">
                          <Link to={`/product/${product.id}`} className="btn-explore-card">
                            EXPLORE
                          </Link>
                          <button 
                            className="btn-add-card flex items-center gap-1"
                            onClick={(e) => handleQuickAdd(e, product)}
                          >
                            {isAdded ? <Check size={14} /> : <ShoppingBag size={14} />}
                            <span>{isAdded ? 'ADDED' : 'ADD'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="product-details p-4 flex-col flex-1 justify-between">
                        <div>
                          <div className="flex justify-between items-center text-10 text-muted">
                            <span className="uppercase tracking-wider">{product.brand}</span>
                            <span className="flex items-center gap-1 text-accent"><Star size={10} fill="currentColor" /> {product.rating}</span>
                          </div>
                          <Link to={`/product/${product.id}`}>
                            <h3 className="item-title mt-1">{product.title}</h3>
                          </Link>
                          <p className="item-subtitle text-xs text-muted mt-1">{product.subtitle}</p>
                        </div>

                        <div className="price-row flex justify-between items-baseline mt-4 pt-3 border-t border-border">
                          <div className="flex items-baseline gap-2">
                            <span className="price-amount font-bold text-accent">{formatINR(product.price)}</span>
                            {product.originalPrice && <span className="mrp-amount text-xs text-muted line-through">{formatINR(product.originalPrice)}</span>}
                          </div>
                          <span className="text-10 text-muted">{product.stock > 0 ? `${product.stock} in stock` : 'Sold out'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination-bar flex justify-center items-center gap-2 mt-12">
                  {[...Array(totalPages).keys()].map(i => (
                    <button 
                      key={i + 1} 
                      className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                      onClick={() => { setCurrentPage(i + 1); window.scrollTo({ top: 120, behavior: 'smooth' }); }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductList;
