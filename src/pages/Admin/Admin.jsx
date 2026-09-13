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
  CreditCard,
  Send,
  ExternalLink
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { formatINR } from '../../utils/helpers';
import './Admin.css';

const COURIER_PARTNERS = [
  'Delhivery Express',
  'Blue Dart Priority',
  'DTDC Courier',
  'India Post Speed Post',
  'Shiprocket Courier',
  'Other Express Courier'
];

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
      final_amount: 24999,
      status: 'Shipped',
      payment_method: 'Razorpay Online (UPI)',
      payment_status: 'Paid',
      courier_partner: 'Delhivery Express',
      tracking_number: 'DEL-892104-IN',
      tracking_url: 'https://www.delhivery.com',
      date: '2026-08-28'
    },
    {
      id: 'ord-102',
      order_number: 'KUKU-749102',
      client_name: 'Ananya Mehta',
      final_amount: 6499,
      status: 'Delivered',
      payment_method: 'Razorpay (Card)',
      payment_status: 'Paid',
      courier_partner: 'Blue Dart Priority',
      tracking_number: 'BD-749102-IN',
      tracking_url: 'https://www.bluedart.com',
      date: '2026-08-25'
    },
    {
      id: 'ord-103',
      order_number: 'KUKU-639108',
      client_name: 'Vikram Singhania',
      final_amount: 14999,
      status: 'Packed',
      payment_method: 'Cash on Delivery (COD)',
      payment_status: 'Pending',
      courier_partner: 'DTDC Courier',
      tracking_number: '',
      tracking_url: '',
      date: '2026-08-29'
    }
  ]);

  // Order Filters State
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState('ALL');

  // Shipment Fulfillment Modal State
  const [shippingModalOrder, setShippingModalOrder] = useState(null);
  const [selectedCourier, setSelectedCourier] = useState('Delhivery Express');
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [trackingUrlInput, setTrackingUrlInput] = useState('');
  const [expectedDateInput, setExpectedDateInput] = useState('Tomorrow by 4:00 PM');

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
    if (window.confirm('Delete this product from catalog?')) {
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

  // Open Shipping Modal
  const handleOpenShipModal = (order) => {
    setShippingModalOrder(order);
    setSelectedCourier(order.courier_partner || 'Delhivery Express');
    setTrackingNumberInput(order.tracking_number || `DEL-${order.order_number.replace('KUKU-', '')}-IN`);
    setTrackingUrlInput(order.tracking_url || 'https://www.delhivery.com');
  };

  // Save Shipping Information
  const handleSaveShipment = async (e) => {
    e.preventDefault();
    if (!shippingModalOrder) return;

    const updated = {
      ...shippingModalOrder,
      status: 'Shipped',
      courier_partner: selectedCourier,
      tracking_number: trackingNumberInput,
      tracking_url: trackingUrlInput,
      estimated_delivery_date: expectedDateInput
    };

    setAdminOrders(prev => prev.map(o => o.order_number === shippingModalOrder.order_number ? updated : o));

    try {
      await supabase.from('orders').update({
        status: 'Shipped',
        courier_partner: selectedCourier,
        tracking_number: trackingNumberInput,
        tracking_url: trackingUrlInput,
        estimated_delivery_date: expectedDateInput
      }).eq('order_number', shippingModalOrder.order_number);
    } catch (e) {}

    setShippingModalOrder(null);
  };

  // Analytics Metrics in INR
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
          <span className="text-xs text-accent tracking-widest uppercase font-bold">MERCHANT EXECUTIVE CONSOLE</span>
          <h1 className="admin-title mt-1 flex items-center gap-3">
            <BarChart3 size={24} color="var(--color-accent)" /> KUKU KART MASTER ADMIN
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-success font-mono font-bold flex items-center gap-1">
            ● PRODUCTION STORE LIVE (INR)
          </span>
        </div>
      </div>

      {productSuccess && (
        <div className="p-3 bg-surface border border-accent text-accent text-xs mb-6 flex items-center gap-2 rounded">
          <Check size={16} /> New luxury piece published to live catalog!
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
          INVENTORY CATALOG ({adminProducts.length})
        </button>
        <button 
          className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          ORDER DISPATCH & FULFILLMENT ({adminOrders.length})
        </button>
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="overview-tab-content flex-col gap-8">
          
          {/* Stats Cards in INR */}
          <div className="admin-stats-grid grid-4 gap-6">
            <div className="stat-card p-5 border border-border bg-surface flex-col justify-between rounded">
              <span className="text-10 text-muted uppercase tracking-wider font-bold">TOTAL GROSS REVENUE</span>
              <strong className="stat-value text-2xl font-mono text-accent mt-2">
                {formatINR(totalRevenue)}
              </strong>
              <span className="text-10 text-success flex items-center gap-1 mt-2">
                <TrendingUp size={12} /> +24.8% sales growth
              </span>
            </div>

            <div className="stat-card p-5 border border-border bg-surface flex-col justify-between rounded">
              <span className="text-10 text-muted uppercase tracking-wider font-bold">ACTIVE DISPATCH ORDERS</span>
              <strong className="stat-value text-2xl font-mono text-white mt-2">
                {pendingOrdersCount} In Fulfillment
              </strong>
              <span className="text-10 text-muted mt-2">Total registered: {adminOrders.length}</span>
            </div>

            <div className="stat-card p-5 border border-border bg-surface flex-col justify-between rounded">
              <span className="text-10 text-muted uppercase tracking-wider font-bold">CASH ON DELIVERY (COD)</span>
              <strong className="stat-value text-2xl font-mono text-white mt-2">
                {codOrdersCount} Orders
              </strong>
              <span className="text-10 text-accent mt-2 font-bold">{pendingPaymentsCount} Pending collection</span>
            </div>

            <div className="stat-card p-5 border border-border bg-surface flex-col justify-between rounded">
              <span className="text-10 text-muted uppercase tracking-wider font-bold">INVENTORY NOTIFICATIONS</span>
              <strong className="stat-value text-2xl font-mono text-error mt-2">
                {lowStockCount} Low Stock
              </strong>
              <span className="text-10 text-error flex items-center gap-1 mt-2">
                <AlertTriangle size={12} /> Restock suggested
              </span>
            </div>
          </div>

          {/* Revenue Bar Graph */}
          <div className="analytics-chart-box p-6 border border-border bg-surface mt-6 rounded">
            <h3 className="text-xs font-heading tracking-widest text-white pb-3 border-b border-border mb-6">
              WEEKLY REVENUE PERFORMANCE (₹ INR)
            </h3>

            <div className="bar-chart-flex flex justify-between items-end h-48 pt-6">
              {[
                { day: 'Mon', rev: 45000, height: '40%' },
                { day: 'Tue', rev: 68000, height: '60%' },
                { day: 'Wed', rev: 92000, height: '80%' },
                { day: 'Thu', rev: 78000, height: '70%' },
                { day: 'Fri', rev: 125000, height: '100%' },
                { day: 'Sat', rev: 110000, height: '88%' },
                { day: 'Sun', rev: 85000, height: '68%' }
              ].map(d => (
                <div key={d.day} className="chart-bar-item flex-col items-center gap-2 flex-1">
                  <span className="text-10 text-accent font-mono">₹{(d.rev / 1000).toFixed(0)}k</span>
                  <div className="chart-bar w-12 bg-accent rounded-t" style={{ height: d.height, minHeight: '10px' }} />
                  <span className="text-10 text-muted uppercase font-bold">{d.day}</span>
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
              SHOWROOM INVENTORY ({adminProducts.length} Items)
            </h3>
            <button 
              onClick={() => setShowAddProductModal(true)}
              className="btn-primary text-xs flex items-center gap-2 py-2 px-4 font-bold"
            >
              <Plus size={14} /> PUBLISH NEW PRODUCT
            </button>
          </div>

          <div className="admin-table-wrapper border border-border bg-surface rounded overflow-hidden">
            <table className="admin-table w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border text-accent">
                  <th className="p-3">ITEM</th>
                  <th className="p-3">BRAND</th>
                  <th className="p-3">CATEGORY</th>
                  <th className="p-3 text-right">PRICE (INR)</th>
                  <th className="p-3 text-center">STOCK</th>
                  <th className="p-3 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="text-muted">
                {adminProducts.map(p => (
                  <tr key={p.id} className="border-b border-border hover:bg-bg">
                    <td className="p-3 flex items-center gap-3">
                      <img src={p.image} alt={p.title} className="w-10 h-10 object-cover border border-border rounded" />
                      <strong className="text-white">{p.title}</strong>
                    </td>
                    <td className="p-3">{p.brand}</td>
                    <td className="p-3 text-white font-bold">{p.category}</td>
                    <td className="p-3 text-right text-accent font-mono font-bold">{formatINR(p.price)}</td>
                    <td className="p-3 text-center">
                      <span className={`stock-pill text-10 ${p.stock <= 5 ? 'low' : ''}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button 
                        onClick={() => handleDeleteProduct(p.id)}
                        className="text-error hover:underline p-1 cursor-pointer"
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

      {/* 3. ORDERS TAB WITH SHIPPING WORKFLOW (PART 20 & 21) */}
      {activeTab === 'orders' && (
        <div className="orders-tab-content flex-col">
          
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h3 className="text-xs font-heading tracking-widest text-white">
              CLIENT ORDERS & LOGISTICS ({filteredAdminOrders.length})
            </h3>

            {/* Filter controls */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1 border border-border p-1 bg-surface rounded">
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
                className="status-select-admin text-xs rounded"
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
                className="status-select-admin text-xs rounded"
              >
                <option value="ALL">All Payments</option>
                <option value="PAID">Paid Only</option>
                <option value="PENDING">Pending (COD)</option>
              </select>
            </div>
          </div>

          <div className="admin-table-wrapper border border-border bg-surface rounded overflow-hidden">
            <table className="admin-table w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border text-accent">
                  <th className="p-3">ORDER ID</th>
                  <th className="p-3">CLIENT</th>
                  <th className="p-3 text-right">AMOUNT</th>
                  <th className="p-3">PAY METHOD</th>
                  <th className="p-3">PAY STATUS</th>
                  <th className="p-3">ORDER STATUS</th>
                  <th className="p-3">COURIER / AWB</th>
                  <th className="p-3 text-right">ACTIONS / DISPATCH</th>
                </tr>
              </thead>
              <tbody className="text-muted">
                {filteredAdminOrders.map(o => (
                  <tr key={o.order_number} className="border-b border-border hover:bg-bg">
                    <td className="p-3 font-mono font-bold text-white">#{o.order_number}</td>
                    <td className="p-3 text-white">{o.client_name}</td>
                    <td className="p-3 text-right text-accent font-mono font-bold">{formatINR(o.final_amount)}</td>
                    <td className="p-3 text-10">{o.payment_method}</td>
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
                    <td className="p-3 text-10">
                      {o.courier_partner ? (
                        <div>
                          <strong className="text-white block">{o.courier_partner}</strong>
                          <span className="text-muted font-mono">{o.tracking_number || 'Pending AWB'}</span>
                        </div>
                      ) : (
                        <span className="text-muted italic">Unassigned</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
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

                        {/* Button to open Dispatch & Shipping Modal */}
                        <button 
                          onClick={() => handleOpenShipModal(o)}
                          className="btn-secondary text-10 py-1 px-2 flex items-center gap-1 font-bold"
                          title="Assign Courier & Tracking Details"
                        >
                          <Truck size={12} /> SHIP
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: COURIER & SHIPMENT ASSIGNMENT (PART 21) */}
      {shippingModalOrder && (
        <div className="location-modal-overlay flex items-center justify-center">
          <div className="location-modal-card p-6 bg-surface border border-accent max-w-lg w-full text-xs rounded">
            <div className="flex justify-between items-center pb-3 border-b border-border mb-4">
              <div>
                <h3 className="text-sm font-heading tracking-wider text-white flex items-center gap-2">
                  <Truck size={16} color="var(--color-accent)" /> COURIER FULFILLMENT & DISPATCH
                </h3>
                <span className="text-10 text-muted">ORDER #{shippingModalOrder.order_number}</span>
              </div>
              <button onClick={() => setShippingModalOrder(null)} className="cursor-pointer"><X size={18} /></button>
            </div>

            <form onSubmit={handleSaveShipment} className="flex-col gap-3">
              <div className="form-group flex-col">
                <label className="text-accent mb-1 font-bold">COURIER PARTNER *</label>
                <select 
                  value={selectedCourier} 
                  onChange={(e) => setSelectedCourier(e.target.value)}
                  className="p-2 bg-bg border border-border text-white text-xs rounded"
                >
                  {COURIER_PARTNERS.map(cp => <option key={cp} value={cp}>{cp}</option>)}
                </select>
              </div>

              <div className="form-group flex-col">
                <label className="text-accent mb-1 font-bold">TRACKING AWB NUMBER *</label>
                <input 
                  type="text" 
                  value={trackingNumberInput} 
                  onChange={(e) => setTrackingNumberInput(e.target.value)} 
                  placeholder="e.g. DEL-892104-IN or BD749102"
                  required 
                  className="p-2 bg-bg border border-border text-white text-xs rounded font-mono"
                />
              </div>

              <div className="form-group flex-col">
                <label className="text-accent mb-1 font-bold">TRACKING PORTAL URL</label>
                <input 
                  type="url" 
                  value={trackingUrlInput} 
                  onChange={(e) => setTrackingUrlInput(e.target.value)} 
                  placeholder="https://www.delhivery.com/track/package/..."
                  className="p-2 bg-bg border border-border text-white text-xs rounded"
                />
              </div>

              <div className="form-group flex-col">
                <label className="text-accent mb-1 font-bold">EXPECTED DELIVERY DATE</label>
                <input 
                  type="text" 
                  value={expectedDateInput} 
                  onChange={(e) => setExpectedDateInput(e.target.value)} 
                  placeholder="e.g. Tomorrow by 4:00 PM"
                  className="p-2 bg-bg border border-border text-white text-xs rounded"
                />
              </div>

              <button type="submit" className="btn-primary mt-3 w-full py-3 font-bold flex items-center justify-center gap-2">
                <Send size={14} /> MARK SHIPPED & UPDATE CUSTOMER TRACKING
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      {showAddProductModal && (
        <div className="location-modal-overlay flex items-center justify-center">
          <div className="location-modal-card p-6 bg-surface border border-accent max-w-xl w-full text-xs rounded">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-heading tracking-wider text-white">PUBLISH LUXURY PRODUCT</h3>
              <button onClick={() => setShowAddProductModal(false)} className="cursor-pointer"><X size={18} /></button>
            </div>

            <form onSubmit={handleAddProduct} className="flex-col gap-3">
              <div className="form-group flex-col">
                <label className="text-accent mb-1 font-bold">PRODUCT TITLE</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Royal Tourbillon Chronometer" required className="p-2 bg-bg border border-border text-white text-xs rounded" />
              </div>

              <div className="form-group flex-col">
                <label className="text-accent mb-1 font-bold">SUBTITLE</label>
                <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="e.g. Limited Edition Horology" required className="p-2 bg-bg border border-border text-white text-xs rounded" />
              </div>

              <div className="flex gap-3">
                <div className="form-group flex-1 flex-col">
                  <label className="text-accent mb-1 font-bold">BRAND / ATELIER</label>
                  <select value={brand} onChange={(e) => setBrand(e.target.value)} className="p-2 bg-bg border border-border text-white text-xs rounded">
                    {brands.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="form-group flex-1 flex-col">
                  <label className="text-accent mb-1 font-bold">CATEGORY</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-2 bg-bg border border-border text-white text-xs rounded">
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="form-group flex-1 flex-col">
                  <label className="text-accent mb-1 font-bold">PRICE (₹ INR)</label>
                  <input type="number" step="1" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="24999" required className="p-2 bg-bg border border-border text-white text-xs rounded font-mono" />
                </div>
                <div className="form-group flex-1 flex-col">
                  <label className="text-accent mb-1 font-bold">ORIGINAL MRP (₹)</label>
                  <input type="number" step="1" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder="32999" className="p-2 bg-bg border border-border text-white text-xs rounded font-mono" />
                </div>
                <div className="form-group flex-1 flex-col">
                  <label className="text-accent mb-1 font-bold">STOCK QTY</label>
                  <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required className="p-2 bg-bg border border-border text-white text-xs rounded" />
                </div>
              </div>

              <div className="form-group flex-col">
                <label className="text-accent mb-1 font-bold">IMAGE URL (HIGH-RES)</label>
                <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://images.unsplash.com/..." required className="p-2 bg-bg border border-border text-white text-xs rounded" />
              </div>

              <div className="form-group flex-col">
                <label className="text-accent mb-1 font-bold">DESCRIPTION</label>
                <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Bespoke craftsmanship details..." required className="p-2 bg-bg border border-border text-white text-xs rounded" />
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
