import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Package, 
  DollarSign, 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  AlertTriangle, 
  TrendingUp, 
  Truck, 
  Tag, 
  X,
  Sparkles,
  Search,
  Filter,
  CreditCard
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import './Admin.css';

const Admin = () => {
  const { products, categories, brands, availableCoupons } = useShop();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'orders'
  const [adminProducts, setAdminProducts] = useState(products);
  const [adminOrders, setAdminOrders] = useState([
    {
      id: 'ord-101',
      order_number: 'KUKU-892104',
      client_name: 'Kartikey Sharma',
      final_amount: 12500.00,
      status: 'Shipped',
      payment_method: 'Razorpay Online',
      payment_status: 'Paid',
      date: '2026-08-28'
    },
    {
      id: 'ord-102',
      order_number: 'KUKU-749102',
      client_name: 'Ananya Mehta',
      final_amount: 890.00,
      status: 'Delivered',
      payment_method: 'Card',
      payment_status: 'Paid',
      date: '2026-08-25'
    },
    {
      id: 'ord-103',
      order_number: 'KUKU-639108',
      client_name: 'Vikram Singhania',
      final_amount: 3400.00,
      status: 'Packed',
      payment_method: 'COD',
      payment_status: 'Pending',
      date: '2026-08-29'
    }
  ]);

  // Order Filters State
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState('ALL');

  // Product Add Modal State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [brand, setBrand] = useState('KuKu Atelier');
  const [category, setCategory] = useState('Men');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [sizesInput, setSizesInput] = useState('S, M, L, XL');
  const [colorsInput, setColorsInput] = useState('Obsidian Black, Midnight Silver');

  const [productSuccess, setProductSuccess] = useState(false);

  useEffect(() => {
    const fetchSupabaseOrders = async () => {
      try {
        const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          setAdminOrders(data);
        }
      } catch (e) {}
    };
    fetchSupabaseOrders();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const newProd = {
      id: 'p-' + Date.now(),
      title,
      subtitle,
      brand,
      category,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price),
      discountPercent: originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0,
      stock: parseInt(stock),
      image: imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      description,
      sizes: sizesInput.split(',').map(s => s.trim()),
      colors: colorsInput.split(',').map(c => c.trim()),
      rating: 5.0,
      reviewsCount: 1,
      created_at: new Date().toISOString()
    };

    try {
      await supabase.from('products').insert([{
        title: newProd.title,
        subtitle: newProd.subtitle,
        price: newProd.price,
        category: newProd.category,
        image: newProd.image,
        description: newProd.description
      }]);
    } catch (err) {}

    setAdminProducts([newProd, ...adminProducts]);
    setShowAddProductModal(false);
    setProductSuccess(true);
    setTimeout(() => setProductSuccess(false), 2500);

    // Reset Form
    setTitle('');
    setSubtitle('');
    setPrice('');
    setOriginalPrice('');
    setImageUrl('');
    setDescription('');
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Delete this product from showroom catalog?')) {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (e) {}
      setAdminProducts(adminProducts.filter(p => p.id !== id));
    }
  };

  const handleUpdateOrderStatus = async (orderNumber, newStatus) => {
    setAdminOrders(prev => prev.map(o => o.order_number === orderNumber ? { ...o, status: newStatus } : o));
    try {
      await supabase.from('orders').update({ status: newStatus }).eq('order_number', orderNumber);
    } catch (e) {}
  };

  // Analytics Metrics
  const totalRevenue = adminOrders.reduce((sum, o) => sum + (parseFloat(o.final_amount) || 0), 0);
  const pendingOrdersCount = adminOrders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const pendingPaymentsCount = adminOrders.filter(o => o.payment_status?.toLowerCase() === 'pending').length;
  const codOrdersCount = adminOrders.filter(o => o.payment_method?.toUpperCase().includes('COD')).length;
  const lowStockCount = adminProducts.filter(p => p.stock <= 5).length;

  const filteredAdminOrders = adminOrders.filter(o => {
    const matchesSearch = !orderSearch.trim() || 
      o.order_number.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.client_name?.toLowerCase().includes(orderSearch.toLowerCase());
    
    const matchesStatus = orderStatusFilter === 'ALL' || o.status === orderStatusFilter;
    const matchesPayment = orderPaymentFilter === 'ALL' || 
      (orderPaymentFilter === 'PAID' && o.payment_status?.toLowerCase() === 'paid') ||
      (orderPaymentFilter === 'PENDING' && o.payment_status?.toLowerCase() === 'pending');

    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <div className="admin-page-container container">
      {/* Header */}
      <div className="admin-header flex justify-between items-end pb-4 border-b border-border mb-8">
        <div>
          <span className="text-xs text-accent tracking-widest uppercase">EXECUTIVE CONSOLE</span>
          <h1 className="admin-title mt-1 flex items-center gap-3">
            <BarChart3 size={24} color="var(--color-accent)" /> KUKU KART MASTER ADMIN
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-success font-mono font-bold flex items-center gap-1">
            ● PRODUCTION CLOUD ONLINE
          </span>
        </div>
      </div>

      {productSuccess && (
        <div className="p-3 bg-surface border border-accent text-accent text-xs mb-6 flex items-center gap-2">
          <Check size={16} /> New luxury masterpiece published to live showroom catalog!
        </div>
      )}

      {/* Tabs */}
      <div className="admin-nav-tabs flex gap-4 border-b border-border mb-8 text-xs font-heading tracking-widest">
        <button 
          className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          ANALYTICS OVERVIEW
        </button>
        <button 
          className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          SHOWROOM INVENTORY ({adminProducts.length})
        </button>
        <button 
          className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          ORDER FULFILLMENT ({adminOrders.length})
        </button>
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="overview-tab-content flex-col gap-8">
          
          {/* Stats Cards */}
          <div className="admin-stats-grid grid-4 gap-6">
            <div className="stat-card p-5 border border-border bg-surface flex-col justify-between">
              <span className="text-10 text-muted uppercase tracking-wider">TOTAL GROSS REVENUE</span>
              <strong className="stat-value text-2xl font-mono text-accent mt-2">
                ${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}
              </strong>
              <span className="text-10 text-success flex items-center gap-1 mt-2">
                <TrendingUp size={12} /> +18.4% this week
              </span>
            </div>

            <div className="stat-card p-5 border border-border bg-surface flex-col justify-between">
              <span className="text-10 text-muted uppercase tracking-wider">ACTIVE ORDERS</span>
              <strong className="stat-value text-2xl font-mono text-white mt-2">
                {pendingOrdersCount} In Fulfillment
              </strong>
              <span className="text-10 text-muted mt-2">Total orders: {adminOrders.length}</span>
            </div>

            <div className="stat-card p-5 border border-border bg-surface flex-col justify-between">
              <span className="text-10 text-muted uppercase tracking-wider">COD DOORSTEP ORDERS</span>
              <strong className="stat-value text-2xl font-mono text-white mt-2">
                {codOrdersCount} Orders
              </strong>
              <span className="text-10 text-muted mt-2">Pending cash collection</span>
            </div>

            <div className="stat-card p-5 border border-border bg-surface flex-col justify-between">
              <span className="text-10 text-muted uppercase tracking-wider">INVENTORY ALERTS</span>
              <strong className="stat-value text-2xl font-mono text-error mt-2">
                {lowStockCount} Low Stock
              </strong>
              <span className="text-10 text-error flex items-center gap-1 mt-2">
                <AlertTriangle size={12} /> Immediate restock needed
              </span>
            </div>
          </div>

          {/* Revenue Bar Graph */}
          <div className="analytics-chart-box p-6 border border-border bg-surface mt-6">
            <h3 className="text-xs font-heading tracking-widest text-white pb-3 border-b border-border mb-6">
              WEEKLY REVENUE CADENCE ($ USD)
            </h3>

            <div className="bar-chart-flex flex justify-between items-end h-48 pt-6">
              {[
                { day: 'Mon', rev: 45000, height: '40%' },
                { day: 'Tue', rev: 68000, height: '60%' },
                { day: 'Wed', rev: 92000, height: '80%' },
                { day: 'Thu', rev: 78000, height: '70%' },
                { day: 'Fri', rev: 115000, height: '100%' },
                { day: 'Sat', rev: 89000, height: '75%' },
                { day: 'Sun', rev: 62000, height: '55%' }
              ].map(d => (
                <div key={d.day} className="chart-bar-item flex-col items-center gap-2 flex-1">
                  <span className="text-10 text-accent font-mono">${(d.rev / 1000).toFixed(0)}k</span>
                  <div className="chart-bar w-12 bg-accent" style={{ height: d.height, minHeight: '10px' }} />
                  <span className="text-10 text-muted uppercase">{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="products-tab-content flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-heading tracking-widest text-white">
              SHOWROOM INVENTORY ({adminProducts.length} Pieces)
            </h3>
            <button 
              onClick={() => setShowAddProductModal(true)}
              className="btn-primary text-xs flex items-center gap-2 py-2 px-4 font-bold"
            >
              <Plus size={14} /> PUBLISH NEW PRODUCT
            </button>
          </div>

          <div className="admin-table-wrapper border border-border bg-surface">
            <table className="admin-table w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border text-accent">
                  <th className="p-3">ITEM</th>
                  <th className="p-3">BRAND</th>
                  <th className="p-3">CATEGORY</th>
                  <th className="p-3 text-right">PRICE</th>
                  <th className="p-3 text-center">STOCK</th>
                  <th className="p-3 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="text-muted">
                {adminProducts.map(p => (
                  <tr key={p.id} className="border-b border-border hover:bg-bg">
                    <td className="p-3 flex items-center gap-3">
                      <img src={p.image} alt={p.title} className="w-10 h-10 object-cover border border-border" />
                      <strong className="text-white">{p.title}</strong>
                    </td>
                    <td className="p-3">{p.brand}</td>
                    <td className="p-3 text-white font-bold">{p.category}</td>
                    <td className="p-3 text-right text-accent font-mono font-bold">${p.price.toLocaleString()}</td>
                    <td className="p-3 text-center">
                      <span className={`stock-pill text-10 ${p.stock <= 5 ? 'low' : ''}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button 
                        onClick={() => handleDeleteProduct(p.id)}
                        className="text-error hover:underline p-1"
                        title="Delete Product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. ORDERS TAB (SEARCH & STATUS FILTERS) */}
      {activeTab === 'orders' && (
        <div className="orders-tab-content flex-col">
          
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h3 className="text-xs font-heading tracking-widest text-white">
              CLIENT ORDERS FULFILLMENT ({filteredAdminOrders.length})
            </h3>

            {/* Filter controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 border border-border p-1 bg-surface">
                <Search size={14} className="text-muted" />
                <input 
                  type="text" 
                  placeholder="Search order ID or client..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="bg-transparent border-none text-xs text-white outline-none w-48"
                />
              </div>

              <select 
                value={orderStatusFilter} 
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="status-select-admin text-xs"
              >
                <option value="ALL">All Order Statuses</option>
                <option value="Order Placed">Order Placed</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Packed">Packed</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <select 
                value={orderPaymentFilter} 
                onChange={(e) => setOrderPaymentFilter(e.target.value)}
                className="status-select-admin text-xs"
              >
                <option value="ALL">All Payments</option>
                <option value="PAID">Paid Only</option>
                <option value="PENDING">Pending (COD)</option>
              </select>
            </div>
          </div>

          <div className="admin-table-wrapper border border-border bg-surface">
            <table className="admin-table w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border text-accent">
                  <th className="p-3">ORDER ID</th>
                  <th className="p-3">CLIENT</th>
                  <th className="p-3 text-right">AMOUNT</th>
                  <th className="p-3">PAYMENT</th>
                  <th className="p-3">PAY STATUS</th>
                  <th className="p-3">ORDER STATUS</th>
                  <th className="p-3 text-right">UPDATE STATUS</th>
                </tr>
              </thead>
              <tbody className="text-muted">
                {filteredAdminOrders.map(o => (
                  <tr key={o.order_number} className="border-b border-border hover:bg-bg">
                    <td className="p-3 font-mono font-bold text-white">#{o.order_number}</td>
                    <td className="p-3 text-white">{o.client_name}</td>
                    <td className="p-3 text-right text-accent font-mono font-bold">${o.final_amount.toLocaleString()}</td>
                    <td className="p-3">{o.payment_method}</td>
                    <td className="p-3">
                      <span className={`text-10 font-bold ${o.payment_status?.toLowerCase() === 'paid' ? 'text-success' : 'text-accent'}`}>
                        {o.payment_status?.toUpperCase() || 'PAID'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`status-pill text-10 ${o.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <select 
                        value={o.status} 
                        onChange={(e) => handleUpdateOrderStatus(o.order_number, e.target.value)}
                        className="status-select-admin text-10"
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="location-modal-overlay flex items-center justify-center">
          <div className="location-modal-card p-6 bg-surface border border-accent max-w-xl w-full text-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-heading tracking-wider text-white">PUBLISH LUXURY ACQUISITION</h3>
              <button onClick={() => setShowAddProductModal(false)}><X size={18} /></button>
            </div>

            <form onSubmit={handleAddProduct} className="flex-col gap-3">
              <div className="form-group flex-col">
                <label className="text-accent mb-1">PRODUCT TITLE</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Royal Tourbillon Chronometer" required />
              </div>

              <div className="form-group flex-col">
                <label className="text-accent mb-1">SUBTITLE</label>
                <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="e.g. Limited Edition Horology" required />
              </div>

              <div className="flex gap-3">
                <div className="form-group flex-1 flex-col">
                  <label className="text-accent mb-1">BRAND / ATELIER</label>
                  <select value={brand} onChange={(e) => setBrand(e.target.value)}>
                    {brands.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="form-group flex-1 flex-col">
                  <label className="text-accent mb-1">CATEGORY</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="form-group flex-1 flex-col">
                  <label className="text-accent mb-1">PRICE ($ USD)</label>
                  <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="2400.00" required />
                </div>
                <div className="form-group flex-1 flex-col">
                  <label className="text-accent mb-1">ORIGINAL MRP ($)</label>
                  <input type="number" step="0.01" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder="3000.00" />
                </div>
                <div className="form-group flex-1 flex-col">
                  <label className="text-accent mb-1">STOCK QTY</label>
                  <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
                </div>
              </div>

              <div className="form-group flex-col">
                <label className="text-accent mb-1">IMAGE URL (HIGH-RES)</label>
                <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://images.unsplash.com/..." required />
              </div>

              <div className="form-group flex-col">
                <label className="text-accent mb-1">DESCRIPTION</label>
                <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Bespoke craftsmanship details..." required />
              </div>

              <button type="submit" className="btn-primary mt-3 w-full py-3 font-bold">
                PUBLISH TO LIVE SHOWROOM
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
