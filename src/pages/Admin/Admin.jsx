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
  CreditCard,
  Send,
  ExternalLink,
  PhoneCall,
  Printer,
  MapPin,
  Building2,
  ShieldCheck,
  QrCode,
  Clock,
  Navigation
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
  const { products, categories, brands, availableCoupons, merchantSettings } = useShop();
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

  // Shipment & Doorstep Courier Pickup Modal State
  const [shippingModalOrder, setShippingModalOrder] = useState(null);
  const [pickupModalTab, setPickupModalTab] = useState('pickup'); // 'pickup' | 'label'
  const [selectedCourier, setSelectedCourier] = useState('Delhivery Express');
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [trackingUrlInput, setTrackingUrlInput] = useState('');
  const [expectedDateInput, setExpectedDateInput] = useState('Tomorrow by 4:00 PM');
  const [pickupSlotInput, setPickupSlotInput] = useState('Today (2:00 PM - 5:00 PM)');
  const [pickupExecutive, setPickupExecutive] = useState({
    name: 'Ramesh Sharma',
    phone: '+91 98765 43210',
    id: 'DEL-AGENT-8821',
    vehicle: 'Delivery Van DL-04-AX-8910',
    eta: 'Arriving in 35 mins at your doorstep'
  });
  const [pickupOtp, setPickupOtp] = useState('8492');

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

  // Open Shipping & Doorstep Courier Pickup Modal
  const handleOpenShipModal = (order) => {
    setShippingModalOrder(order);
    setPickupModalTab('pickup');
    const partner = order.courier_partner || merchantSettings?.defaultCourier || 'Delhivery Express';
    setSelectedCourier(partner);
    setTrackingNumberInput(order.tracking_number || `${partner.slice(0, 3).toUpperCase()}-${order.order_number.replace('KUKU-', '')}-IN`);
    
    // Portal tracking url based on courier
    if (partner.includes('Blue Dart')) {
      setTrackingUrlInput('https://www.bluedart.com/tracking');
    } else if (partner.includes('DTDC')) {
      setTrackingUrlInput('https://www.dtdc.in/tracking');
    } else if (partner.includes('Shiprocket')) {
      setTrackingUrlInput('https://shiprocket.co/tracking');
    } else {
      setTrackingUrlInput('https://www.delhivery.com/tracking');
    }

    // Assign realistic pickup executive for seller doorstep pickup
    const EXECUTIVES = [
      { name: 'Ramesh Sharma', phone: '+91 98765 43210', id: 'DEL-AGENT-8821', vehicle: 'Delivery Van DL-04-AX-8910', eta: 'Arriving in 35 mins at your doorstep' },
      { name: 'Suresh Verma', phone: '+91 98112 34567', id: 'BD-EXP-4019', vehicle: 'Courier Cargo Van HR-26-EQ-5521', eta: 'Scheduled pickup window 2:00 PM - 5:00 PM' },
      { name: 'Amitabh Sen', phone: '+91 97234 89012', id: 'DTDC-PICKUP-120', vehicle: 'Express Van DL-01-TY-9941', eta: 'Arriving in 50 mins' }
    ];
    const pickedExec = EXECUTIVES[Math.floor(Math.random() * EXECUTIVES.length)];
    setPickupExecutive(pickedExec);

    // 4-digit pickup handover OTP
    const numPart = order.order_number.replace(/\D/g, '');
    setPickupOtp(numPart ? numPart.slice(-4) : '8492');
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

      {/* MODAL: COURIER DOORSTEP PICKUP & SHIPPING MANIFEST (WHO COMES TO TAKE PRODUCT) */}
      {shippingModalOrder && (
        <div className="location-modal-overlay flex items-center justify-center p-4">
          <div className="location-modal-card p-6 bg-surface border border-accent max-w-2xl w-full text-xs rounded max-h-90vh overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-3 border-b border-border mb-4">
              <div>
                <h3 className="text-sm font-heading tracking-wider text-white flex items-center gap-2">
                  <Truck size={18} color="var(--color-accent)" /> COURIER DOORSTEP PICKUP & DISPATCH
                </h3>
                <span className="text-10 text-muted">ORDER #{shippingModalOrder.order_number} • CLIENT: {shippingModalOrder.client_name}</span>
              </div>
              <button onClick={() => setShippingModalOrder(null)} className="cursor-pointer text-muted hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-border mb-4 gap-2">
              <button 
                type="button" 
                className={`py-2 px-3 text-xs font-bold flex items-center gap-1 border-b-2 cursor-pointer ${pickupModalTab === 'pickup' ? 'border-accent text-accent' : 'border-transparent text-muted'}`}
                onClick={() => setPickupModalTab('pickup')}
              >
                <Truck size={14} /> 1. Doorstep Pickup & Executive
              </button>
              <button 
                type="button" 
                className={`py-2 px-3 text-xs font-bold flex items-center gap-1 border-b-2 cursor-pointer ${pickupModalTab === 'label' ? 'border-accent text-accent' : 'border-transparent text-muted'}`}
                onClick={() => setPickupModalTab('label')}
              >
                <Printer size={14} /> 2. Print Shipping Label & Barcode
              </button>
            </div>

            {/* TAB 1: DOORSTEP PICKUP & ASSIGNED EXECUTIVE */}
            {pickupModalTab === 'pickup' && (
              <form onSubmit={handleSaveShipment} className="flex-col gap-4">
                
                {/* Driver / Field Executive Card (Who comes to take product) */}
                <div className="p-4 border border-accent bg-bg rounded flex-col gap-2">
                  <div className="flex justify-between items-center pb-2 border-b border-border">
                    <span className="text-10 text-accent font-bold uppercase flex items-center gap-1">
                      <ShieldCheck size={14} /> ASSIGNED PICKUP EXECUTIVE (DELIVERY AGENT)
                    </span>
                    <span className="role-tag text-success">EN ROUTE TO YOUR DOORSTEP</span>
                  </div>

                  <div className="flex items-center justify-between mt-1 flex-wrap gap-2">
                    <div>
                      <strong className="text-white text-xs block">{pickupExecutive.name}</strong>
                      <span className="text-10 text-muted block font-mono">Agent ID: {pickupExecutive.id} • {pickupExecutive.vehicle}</span>
                      <span className="text-10 text-accent block mt-1 flex items-center gap-1">
                        <Clock size={12} /> {pickupExecutive.eta}
                      </span>
                    </div>

                    <a 
                      href={`tel:${pickupExecutive.phone}`} 
                      className="btn-secondary text-xs py-1 px-3 flex items-center gap-1"
                      title="Call Pickup Executive"
                    >
                      <PhoneCall size={12} color="var(--color-accent)" /> {pickupExecutive.phone}
                    </a>
                  </div>
                </div>

                {/* Handover Verification OTP */}
                <div className="p-3 border border-border bg-surface rounded flex items-center justify-between">
                  <div>
                    <strong className="text-xs text-white block">DOORSTEP HANDOVER OTP</strong>
                    <span className="text-10 text-muted">Provide this 4-digit code to the delivery boy when he physically collects the box.</span>
                  </div>
                  <div className="px-4 py-2 border-2 border-accent bg-bg text-accent font-mono text-base font-bold tracking-widest rounded">
                    {pickupOtp}
                  </div>
                </div>

                {/* Warehouse / Seller Doorstep Address */}
                <div className="p-3 border border-border bg-bg rounded flex-col gap-1">
                  <div className="flex items-center gap-1 text-accent text-10 font-bold uppercase">
                    <Building2 size={12} /> PICKUP LOCATION (YOUR WAREHOUSE / SHOP):
                  </div>
                  <p className="text-10 text-white font-medium">
                    {merchantSettings?.warehouseName || 'KuKu Kart Central Atelier'}, {merchantSettings?.pickupAddress || 'Plot 42, DLF Phase 4, Galleria Commercial Hub'}, {merchantSettings?.pickupCity || 'Gurugram'}, PIN: {merchantSettings?.pickupPincode || '122002'}
                  </p>
                  <span className="text-10 text-muted">Merchant Contact: {merchantSettings?.merchantPhone || '+91 98765 43210'}</span>
                </div>

                {/* Courier Form Fields */}
                <div className="grid-2-col gap-3">
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
                </div>

                <div className="grid-2-col gap-3">
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
                </div>

                <button type="submit" className="btn-primary mt-2 w-full py-3 font-bold flex items-center justify-center gap-2">
                  <Send size={14} /> CONFIRM DOORSTEP HANDOVER & MARK SHIPPED
                </button>
              </form>
            )}

            {/* TAB 2: PRINT OFFICIAL SHIPPING LABEL & BARCODE */}
            {pickupModalTab === 'label' && (
              <div className="flex-col gap-4">
                {/* The Printable Shipping Box Label */}
                <div className="shipping-label-preview p-4 bg-white text-black border-2 border-black rounded flex-col gap-3 font-sans">
                  
                  {/* Label Header */}
                  <div className="flex justify-between items-center pb-2 border-b-2 border-black">
                    <div>
                      <strong className="text-base font-extrabold tracking-wider block font-heading">KUKU KART</strong>
                      <span className="text-10 tracking-widest uppercase font-bold text-gray-700">WHITE-GLOVE LUXURY LOGISTICS</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold uppercase block">{selectedCourier}</span>
                      <span className="text-10 font-mono bg-black text-white px-2 py-0.5 font-bold">AIR EXPRESS PRIORITY</span>
                    </div>
                  </div>

                  {/* Simulated Barcode */}
                  <div className="py-2 text-center border-b-2 border-black">
                    <div className="barcode-bars flex justify-center items-center gap-1 h-12">
                      {[3,1,2,4,1,3,2,1,4,2,3,1,2,4,1,3,2,4,1,3,2,1,4,2,3,1,2,3,4,1,2].map((w, idx) => (
                        <div key={idx} style={{ width: `${w * 2}px`, height: '100%', backgroundColor: '#000' }} />
                      ))}
                    </div>
                    <span className="font-mono text-xs font-bold tracking-widest block mt-1">AWB: {trackingNumberInput}</span>
                  </div>

                  {/* Ship From & Ship To */}
                  <div className="grid grid-cols-2 gap-4 border-b-2 border-black pb-3 text-10">
                    <div className="border-r border-gray-400 pr-2">
                      <strong className="block text-gray-700 uppercase font-bold mb-1">SHIP FROM (SELLER DOORSTEP):</strong>
                      <p className="font-bold">{merchantSettings?.warehouseName || 'KuKu Kart Central Atelier'}</p>
                      <p>{merchantSettings?.pickupAddress || 'Plot 42, DLF Phase 4, Galleria Commercial Hub'}</p>
                      <p>{merchantSettings?.pickupCity || 'Gurugram'}, PIN: {merchantSettings?.pickupPincode || '122002'}</p>
                      <p className="mt-1 font-mono">Phone: {merchantSettings?.merchantPhone || '+91 98765 43210'}</p>
                    </div>

                    <div>
                      <strong className="block text-gray-700 uppercase font-bold mb-1">SHIP TO (CLIENT DESTINATION):</strong>
                      <p className="font-bold text-xs">{shippingModalOrder.client_name}</p>
                      <p>{typeof shippingModalOrder.shipping_address === 'string' ? shippingModalOrder.shipping_address : (shippingModalOrder.shipping_address?.address || 'Client Address on File')}</p>
                      <p className="mt-1 font-mono">Order: #{shippingModalOrder.order_number}</p>
                    </div>
                  </div>

                  {/* Payment Badge & Box Meta */}
                  <div className="flex justify-between items-center pt-1 text-xs">
                    <div>
                      <span className="text-10 text-gray-600 block uppercase font-bold">PAYMENT TYPE:</span>
                      <strong className={`text-sm font-bold ${shippingModalOrder.payment_method?.includes('COD') ? 'text-red-600' : 'text-green-700'}`}>
                        {shippingModalOrder.payment_method?.includes('COD') 
                          ? `COLLECT CASH (COD): ${formatINR(shippingModalOrder.final_amount)}` 
                          : 'PRE-PAID ONLINE (DO NOT COLLECT CASH)'}
                      </strong>
                    </div>

                    <div className="text-right text-10">
                      <span className="block font-bold">WT: 0.85 KG</span>
                      <span className="font-mono">ROUTING: DEL-GGN-S01</span>
                    </div>
                  </div>

                  <div className="text-center pt-2 border-t border-gray-300 text-10 text-gray-500 italic">
                    Handle with Care • Certified Authentic Luxury Atelier Merchandise
                  </div>
                </div>

                {/* Print Action Button */}
                <button 
                  type="button" 
                  onClick={() => window.print()}
                  className="btn-primary w-full py-3 font-bold flex items-center justify-center gap-2 mt-2"
                >
                  <Printer size={16} /> PRINT OFFICIAL SHIPPING LABEL (4x6 / A4)
                </button>
              </div>
            )}

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
