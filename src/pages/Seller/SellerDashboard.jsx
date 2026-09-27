import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Store, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  AlertCircle, 
  MapPin, 
  Search, 
  ArrowUpRight, 
  Truck, 
  Clock, 
  Save, 
  ShieldCheck,
  Eye
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { formatINR } from '../../utils/helpers';
import './SellerDashboard.css';

const SellerDashboard = () => {
  const { products, categories, merchantSettings, updateMerchantSettings } = useShop();
  const { user, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'add' | 'orders' | 'settings'
  const [sellerProducts, setSellerProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');

  // Add / Edit Product Modal / Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formBrand, setFormBrand] = useState(user?.full_name || 'Atelier Exclusive');
  const [formCategory, setFormCategory] = useState('Men');
  const [formPrice, setFormPrice] = useState('');
  const [formOriginalPrice, setFormOriginalPrice] = useState('');
  const [formStock, setFormStock] = useState('15');
  const [formImage, setFormImage] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStatusMsg, setFormStatusMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Orders State
  const [sellerOrders, setSellerOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Warehouse / Pickup Settings State
  const [storeName, setStoreName] = useState(merchantSettings?.warehouseName || `${user?.full_name || 'Seller'}'s Boutique`);
  const [pickupAddress, setPickupAddress] = useState(merchantSettings?.pickupAddress || '');
  const [pickupCity, setPickupCity] = useState(merchantSettings?.pickupCity || '');
  const [pickupPincode, setPickupPincode] = useState(merchantSettings?.pickupPincode || '');
  const [merchantPhone, setMerchantPhone] = useState(user?.phone || merchantSettings?.merchantPhone || '');
  const [pickupSlot, setPickupSlot] = useState(merchantSettings?.pickupSlot || 'Morning (10:00 AM - 1:00 PM)');
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Load products owned by this seller from Supabase and Context
  const loadSellerProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data) {
        // If admin, they see all; if seller, they see their products or products where seller_id is user.id
        const owned = data.filter(p => p.seller_id === user?.id || (isAdmin && !p.seller_id));
        // If seller hasn't added any yet, let them view their owned or seed a welcome item
        setSellerProducts(owned.length > 0 ? owned : data.slice(0, 5));
      } else {
        setSellerProducts(products.slice(0, 5));
      }
    } catch (e) {
      setSellerProducts(products.slice(0, 5));
    } finally {
      setLoading(false);
    }
  };

  // Load orders containing items for this seller
  const loadSellerOrders = async () => {
    setLoadingOrders(true);
    try {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        setSellerOrders(data);
      }
    } catch (e) {
      console.warn('Orders fetch fallback', e);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    loadSellerProducts();
    loadSellerOrders();
  }, [user]);

  // Handle Create / Edit Product
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatusMsg('');

    const priceNum = parseFloat(formPrice);
    const origPriceNum = parseFloat(formOriginalPrice) || priceNum;
    const stockNum = parseInt(formStock, 10) || 10;
    const discount = origPriceNum > priceNum ? Math.round(((origPriceNum - priceNum) / origPriceNum) * 100) : 0;

    const prodId = isEditing ? editingId : `sp_${Date.now()}`;
    const productPayload = {
      id: prodId,
      title: formTitle.trim(),
      subtitle: formSubtitle.trim() || 'Direct from Certified Merchant',
      brand: formBrand.trim(),
      category: formCategory,
      price: priceNum,
      original_price: origPriceNum,
      discount_percent: discount,
      stock: stockNum,
      image: formImage.trim() || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      description: formDescription.trim() || 'Authentic artisan product.',
      seller_id: user?.id,
      seller_name: user?.full_name || 'Verified Merchant',
      created_at: new Date().toISOString()
    };

    try {
      const { error } = await supabase.from('products').upsert([productPayload]);
      if (error) {
        console.warn('Supabase product upsert notice:', error);
      }

      setSellerProducts(prev => {
        const filtered = prev.filter(p => p.id !== prodId);
        return [productPayload, ...filtered];
      });

      setFormStatusMsg(isEditing ? 'Product updated successfully!' : 'Product listed in KuKu Kart catalog!');
      setTimeout(() => {
        setFormStatusMsg('');
        resetForm();
        setActiveTab('products');
      }, 1500);
    } catch (err) {
      setFormStatusMsg('Error saving product: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (product) => {
    setIsEditing(true);
    setEditingId(product.id);
    setFormTitle(product.title || '');
    setFormSubtitle(product.subtitle || '');
    setFormBrand(product.brand || '');
    setFormCategory(product.category || 'Men');
    setFormPrice(product.price?.toString() || '');
    setFormOriginalPrice((product.original_price || product.price)?.toString() || '');
    setFormStock((product.stock || 10).toString());
    setFormImage(product.image || '');
    setFormDescription(product.description || '');
    setActiveTab('add');
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to remove this product from your inventory?')) {
      try {
        await supabase.from('products').delete().eq('id', productId);
      } catch (e) {}
      setSellerProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormTitle('');
    setFormSubtitle('');
    setFormPrice('');
    setFormOriginalPrice('');
    setFormStock('15');
    setFormImage('');
    setFormDescription('');
  };

  // Update Inventory inline
  const handleUpdateStock = async (productId, newStock) => {
    const val = parseInt(newStock, 10);
    if (isNaN(val) || val < 0) return;
    setSellerProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: val } : p));
    try {
      await supabase.from('products').update({ stock: val }).eq('id', productId);
    } catch (e) {}
  };

  // Save Warehouse / Pickup Settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateMerchantSettings({
      warehouseName: storeName,
      pickupAddress,
      pickupCity,
      pickupPincode,
      merchantPhone,
      pickupSlot
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  // Filtered Products
  const displayedProducts = sellerProducts.filter(p => {
    const matchCat = filterCategory === 'ALL' || p.category === filterCategory;
    const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCat && matchSearch;
  });

  const totalInventory = sellerProducts.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
  const totalValue = sellerProducts.reduce((sum, p) => sum + ((Number(p.price) || 0) * (Number(p.stock) || 0)), 0);

  return (
    <div className="seller-dashboard-container container">
      {/* Header */}
      <div className="seller-header flex justify-between items-end pb-4 border-b border-border mb-8">
        <div>
          <span className="text-xs text-accent tracking-widest uppercase flex items-center gap-1 font-semibold">
            <Store size={14} /> MERCHANT ATELIER CONSOLE
          </span>
          <h1 className="seller-title mt-1 flex items-center gap-3">
            SELLER DASHBOARD
          </h1>
          <p className="text-xs text-muted mt-1">
            Merchant: <strong>{user?.full_name || 'Bespoke Seller'}</strong> • ID: <code>{user?.id?.slice(0, 8)}</code>
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/products" className="btn-secondary text-xs flex items-center gap-1" target="_blank">
            <Eye size={14} /> View Live Store <ArrowUpRight size={12} />
          </Link>
          <button 
            onClick={() => { resetForm(); setActiveTab('add'); }}
            className="btn-primary text-xs flex items-center gap-1 font-bold"
          >
            <Plus size={14} /> LIST NEW PRODUCT
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="seller-tabs-bar flex border-b border-border mb-8 gap-2 overflow-x-auto">
        <button 
          className={`seller-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <TrendingUp size={16} /> Overview
        </button>
        <button 
          className={`seller-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <Package size={16} /> My Products ({sellerProducts.length})
        </button>
        <button 
          className={`seller-tab-btn ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => { if (!isEditing) resetForm(); setActiveTab('add'); }}
        >
          <Plus size={16} /> {isEditing ? 'Edit Product' : 'Add Product'}
        </button>
        <button 
          className={`seller-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <Truck size={16} /> Customer Orders ({sellerOrders.length})
        </button>
        <button 
          className={`seller-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <MapPin size={16} /> Pickup & Warehouse Settings
        </button>
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="overview-tab-content flex-col gap-8">
          <div className="stats-cards-grid grid-4 gap-4">
            <div className="stat-card p-6 border border-border bg-surface">
              <span className="text-10 text-muted uppercase tracking-wider block mb-1">TOTAL PRODUCTS</span>
              <strong className="text-2xl font-heading text-white">{sellerProducts.length}</strong>
              <span className="text-xs text-accent mt-2 block">Active in catalog</span>
            </div>
            <div className="stat-card p-6 border border-border bg-surface">
              <span className="text-10 text-muted uppercase tracking-wider block mb-1">UNITS IN STOCK</span>
              <strong className="text-2xl font-heading text-white">{totalInventory}</strong>
              <span className="text-xs text-success mt-2 block">Available inventory</span>
            </div>
            <div className="stat-card p-6 border border-border bg-surface">
              <span className="text-10 text-muted uppercase tracking-wider block mb-1">INVENTORY WORTH</span>
              <strong className="text-2xl font-heading text-white">{formatINR(totalValue)}</strong>
              <span className="text-xs text-muted mt-2 block">At retail prices</span>
            </div>
            <div className="stat-card p-6 border border-border bg-surface">
              <span className="text-10 text-muted uppercase tracking-wider block mb-1">FULFILLMENT HUB</span>
              <strong className="text-lg font-heading text-white truncate block">{merchantSettings?.pickupCity || 'Delhi NCR'}</strong>
              <span className="text-xs text-accent mt-2 block flex items-center gap-1">
                <ShieldCheck size={12} /> Delhivery Express Partnered
              </span>
            </div>
          </div>

          {/* Quick Product Health */}
          <div className="seller-card p-6 border border-border bg-surface mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="card-heading text-xs font-heading tracking-widest text-white">
                RECENTLY LISTED PRODUCTS
              </h3>
              <button onClick={() => setActiveTab('products')} className="text-xs text-accent hover:underline flex items-center gap-1">
                View All ({sellerProducts.length}) →
              </button>
            </div>
            <div className="table-responsive">
              <table className="seller-table w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 px-2">PRODUCT</th>
                    <th className="py-3 px-2">CATEGORY</th>
                    <th className="py-3 px-2">PRICE</th>
                    <th className="py-3 px-2">STOCK</th>
                    <th className="py-3 px-2 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {sellerProducts.slice(0, 5).map(prod => (
                    <tr key={prod.id} className="border-b border-border">
                      <td className="py-3 px-2 flex items-center gap-3">
                        <img src={prod.image} alt={prod.title} className="w-10 h-10 object-cover border border-border" />
                        <div>
                          <strong className="text-white block truncate max-w-xs">{prod.title}</strong>
                          <span className="text-10 text-muted">{prod.brand}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2">{prod.category}</td>
                      <td className="py-3 px-2 font-bold text-accent">{formatINR(prod.price)}</td>
                      <td className="py-3 px-2">
                        <span className={`stock-badge ${prod.stock < 5 ? 'low-stock' : 'in-stock'}`}>
                          {prod.stock} units
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <button onClick={() => handleEditClick(prod)} className="p-1 hover:text-accent mr-2">
                          <Edit3 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. MY PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="products-tab-content flex-col gap-6">
          <div className="filters-bar flex justify-between items-center gap-4 flex-wrap mb-4">
            <div className="search-wrap relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-3 text-muted" />
              <input 
                type="text" 
                placeholder="Search by title or brand..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 py-2 border border-border bg-bg text-xs w-full text-white"
              />
            </div>
            <div className="flex gap-2">
              <select 
                value={filterCategory} 
                onChange={(e) => setFilterCategory(e.target.value)}
                className="py-2 px-3 border border-border bg-bg text-xs text-white"
              >
                <option value="ALL">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="seller-card p-6 border border-border bg-surface">
            <div className="table-responsive">
              <table className="seller-table w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 px-2">PRODUCT INFO</th>
                    <th className="py-3 px-2">CATEGORY</th>
                    <th className="py-3 px-2">PRICE</th>
                    <th className="py-3 px-2">ORIGINAL (MRP)</th>
                    <th className="py-3 px-2">STOCK ADJUST</th>
                    <th className="py-3 px-2 text-right">MANAGE</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedProducts.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-muted">
                        No products found matching your search.
                      </td>
                    </tr>
                  ) : (
                    displayedProducts.map(prod => (
                      <tr key={prod.id} className="border-b border-border">
                        <td className="py-3 px-2 flex items-center gap-3">
                          <img src={prod.image} alt={prod.title} className="w-12 h-12 object-cover border border-border" />
                          <div>
                            <strong className="text-white block truncate max-w-sm">{prod.title}</strong>
                            <span className="text-10 text-muted">{prod.brand} • SKU: {prod.id}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2">{prod.category}</td>
                        <td className="py-3 px-2 font-bold text-accent">{formatINR(prod.price)}</td>
                        <td className="py-3 px-2 text-muted line-through">
                          {prod.original_price ? formatINR(prod.original_price) : formatINR(prod.price)}
                        </td>
                        <td className="py-3 px-2">
                          <input 
                            type="number" 
                            min="0" 
                            className="stock-inline-input w-20 py-1 px-2 border border-border bg-bg text-xs text-white" 
                            defaultValue={prod.stock || 10}
                            onBlur={(e) => handleUpdateStock(prod.id, e.target.value)}
                          />
                        </td>
                        <td className="py-3 px-2 text-right">
                          <div className="flex gap-2 justify-end">
                            <button 
                              onClick={() => handleEditClick(prod)} 
                              className="btn-secondary text-10 py-1 px-2 flex items-center gap-1"
                              title="Edit product details"
                            >
                              <Edit3 size={12} /> Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(prod.id)} 
                              className="text-error p-1 hover:opacity-80"
                              title="Remove from inventory"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. ADD / EDIT PRODUCT TAB */}
      {activeTab === 'add' && (
        <div className="add-product-container max-w-3xl mx-auto">
          <div className="seller-card p-8 border border-border bg-surface">
            <h3 className="card-heading text-xs font-heading tracking-widest text-white pb-3 border-b border-border mb-6">
              {isEditing ? 'EDIT PRODUCT DETAILS' : 'LIST NEW PRODUCT IN STOREFRONT'}
            </h3>

            <form onSubmit={handleSaveProduct} className="flex-col gap-4 text-xs">
              <div className="grid-2 gap-4">
                <div className="form-group flex-col">
                  <label className="text-accent mb-1 font-semibold">PRODUCT TITLE *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Royal Tourbillon Timepiece" 
                    value={formTitle} 
                    onChange={(e) => setFormTitle(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group flex-col">
                  <label className="text-accent mb-1 font-semibold">BRAND / ATELIER *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. KuKu Private Label" 
                    value={formBrand} 
                    onChange={(e) => setFormBrand(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="grid-2 gap-4">
                <div className="form-group flex-col">
                  <label className="text-accent mb-1 font-semibold">CATEGORY *</label>
                  <select 
                    value={formCategory} 
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="py-2 px-3 border border-border bg-bg text-xs text-white"
                  >
                    <option value="Men">Men's Fashion</option>
                    <option value="Women">Women's Fashion</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Accessories">Accessories & Watches</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Beauty">Beauty & Wellness</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Grocery">Grocery & Gourmet</option>
                  </select>
                </div>
                <div className="form-group flex-col">
                  <label className="text-accent mb-1 font-semibold">SUBTITLE / TAGLINE</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Handcrafted Rose Gold Edition" 
                    value={formSubtitle} 
                    onChange={(e) => setFormSubtitle(e.target.value)} 
                  />
                </div>
              </div>

              <div className="grid-3 gap-4">
                <div className="form-group flex-col">
                  <label className="text-accent mb-1 font-semibold">SELLING PRICE (₹ INR) *</label>
                  <input 
                    type="number" 
                    placeholder="2499" 
                    value={formPrice} 
                    onChange={(e) => setFormPrice(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group flex-col">
                  <label className="text-accent mb-1 font-semibold">MRP / ORIGINAL PRICE (₹)</label>
                  <input 
                    type="number" 
                    placeholder="3999" 
                    value={formOriginalPrice} 
                    onChange={(e) => setFormOriginalPrice(e.target.value)} 
                  />
                </div>
                <div className="form-group flex-col">
                  <label className="text-accent mb-1 font-semibold">INITIAL STOCK UNITS *</label>
                  <input 
                    type="number" 
                    placeholder="15" 
                    value={formStock} 
                    onChange={(e) => setFormStock(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="form-group flex-col">
                <label className="text-accent mb-1 font-semibold">IMAGE URL *</label>
                <input 
                  type="url" 
                  placeholder="https://images.unsplash.com/photo-..." 
                  value={formImage} 
                  onChange={(e) => setFormImage(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group flex-col">
                <label className="text-accent mb-1 font-semibold">DESCRIPTION</label>
                <textarea 
                  rows="3" 
                  placeholder="Describe material, specifications, craftsmanship..." 
                  value={formDescription} 
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="p-3 border border-border bg-bg text-xs text-white"
                />
              </div>

              {formStatusMsg && (
                <p className="text-xs text-accent font-semibold flex items-center gap-1">
                  <Check size={14} /> {formStatusMsg}
                </p>
              )}

              <div className="flex gap-4 pt-4 border-t border-border mt-2">
                <button type="submit" className="btn-primary py-3 px-8 font-bold flex-1" disabled={isSubmitting}>
                  {isSubmitting ? 'SAVING...' : (isEditing ? 'UPDATE PRODUCT' : 'PUBLISH TO STORE')}
                </button>
                {isEditing && (
                  <button type="button" onClick={resetForm} className="btn-secondary py-3 px-6">
                    CANCEL
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="orders-tab-content flex-col gap-6">
          <div className="seller-card p-6 border border-border bg-surface">
            <h3 className="card-heading text-xs font-heading tracking-widest text-white pb-3 border-b border-border mb-4">
              CUSTOMER ORDERS FOR FULFILLMENT ({sellerOrders.length})
            </h3>
            <div className="table-responsive">
              <table className="seller-table w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 px-2">ORDER #</th>
                    <th className="py-3 px-2">CUSTOMER</th>
                    <th className="py-3 px-2">AMOUNT</th>
                    <th className="py-3 px-2">PAYMENT</th>
                    <th className="py-3 px-2">STATUS</th>
                    <th className="py-3 px-2">COURIER</th>
                  </tr>
                </thead>
                <tbody>
                  {sellerOrders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-muted">
                        No orders recorded yet.
                      </td>
                    </tr>
                  ) : (
                    sellerOrders.map(ord => (
                      <tr key={ord.id} className="border-b border-border">
                        <td className="py-3 px-2 font-mono text-accent">
                          <Link to={`/orders/${ord.order_number}`} className="hover:underline">
                            {ord.order_number}
                          </Link>
                        </td>
                        <td className="py-3 px-2">
                          <strong className="text-white block">{ord.client_name}</strong>
                          <span className="text-10 text-muted">{ord.client_phone}</span>
                        </td>
                        <td className="py-3 px-2 font-bold">{formatINR(ord.final_amount)}</td>
                        <td className="py-3 px-2">
                          <span className="type-badge text-10">{ord.payment_method}</span>
                        </td>
                        <td className="py-3 px-2">
                          <span className="stock-badge in-stock">{ord.status}</span>
                        </td>
                        <td className="py-3 px-2 text-muted">
                          {ord.courier_partner || 'Delhivery Express'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. WAREHOUSE & PICKUP SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="seller-card p-8 border border-border bg-surface max-w-2xl mx-auto">
          <h3 className="card-heading text-xs font-heading tracking-widest text-white pb-3 border-b border-border mb-6 flex items-center gap-2">
            <MapPin size={16} color="var(--color-accent)" /> SELLER PICKUP ADDRESS & COURIER SETTINGS
          </h3>
          <p className="text-xs text-muted mb-6">
            Courier delivery partners (Delhivery, Blue Dart, DTDC) dispatch delivery executives to this warehouse address to pick up packages packed by your store.
          </p>

          <form onSubmit={handleSaveSettings} className="flex-col gap-4 text-xs">
            <div className="form-group flex-col">
              <label className="text-accent mb-1 font-semibold">STORE / WAREHOUSE NAME</label>
              <input 
                type="text" 
                value={storeName} 
                onChange={(e) => setStoreName(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group flex-col">
              <label className="text-accent mb-1 font-semibold">DOORSTEP PICKUP ADDRESS</label>
              <textarea 
                rows="2" 
                value={pickupAddress} 
                onChange={(e) => setPickupAddress(e.target.value)} 
                placeholder="Plot / Unit number, Industrial Area / Street" 
                required 
                className="p-3 border border-border bg-bg text-xs text-white"
              />
            </div>

            <div className="grid-2 gap-4">
              <div className="form-group flex-col">
                <label className="text-accent mb-1 font-semibold">CITY / REGION</label>
                <input 
                  type="text" 
                  value={pickupCity} 
                  onChange={(e) => setPickupCity(e.target.value)} 
                  placeholder="e.g. Gurugram, Delhi NCR" 
                  required 
                />
              </div>
              <div className="form-group flex-col">
                <label className="text-accent mb-1 font-semibold">PICKUP PINCODE</label>
                <input 
                  type="text" 
                  maxLength="6" 
                  value={pickupPincode} 
                  onChange={(e) => setPickupPincode(e.target.value.replace(/\D/g, ''))} 
                  placeholder="122002" 
                  required 
                />
              </div>
            </div>

            <div className="grid-2 gap-4">
              <div className="form-group flex-col">
                <label className="text-accent mb-1 font-semibold">DISPATCH MANAGER PHONE</label>
                <input 
                  type="tel" 
                  value={merchantPhone} 
                  onChange={(e) => setMerchantPhone(e.target.value)} 
                  placeholder="+91 9876543210" 
                  required 
                />
              </div>
              <div className="form-group flex-col">
                <label className="text-accent mb-1 font-semibold">DAILY PICKUP SLOT</label>
                <select 
                  value={pickupSlot} 
                  onChange={(e) => setPickupSlot(e.target.value)}
                  className="py-2 px-3 border border-border bg-bg text-xs text-white"
                >
                  <option value="Morning (10:00 AM - 1:00 PM)">Morning (10:00 AM - 1:00 PM)</option>
                  <option value="Afternoon (2:00 PM - 5:00 PM)">Afternoon (2:00 PM - 5:00 PM)</option>
                  <option value="Evening (5:00 PM - 8:00 PM)">Evening (5:00 PM - 8:00 PM)</option>
                </select>
              </div>
            </div>

            {settingsSaved && (
              <p className="text-xs text-success flex items-center gap-1 font-bold">
                <Check size={14} /> Pickup address and fulfillment settings saved.
              </p>
            )}

            <button type="submit" className="btn-primary py-3 font-bold mt-2">
              SAVE WAREHOUSE & PICKUP SETTINGS
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
