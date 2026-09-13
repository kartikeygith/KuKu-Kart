import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  RotateCcw, 
  Download, 
  FileText, 
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Search,
  Filter,
  Check,
  ExternalLink
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { supabase } from '../../lib/supabaseClient';
import { formatDate, formatINR } from '../../utils/helpers';
import './OrderTracker.css';

const ORDER_STAGES = [
  'Order Placed',
  'Confirmed',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered'
];

const DEFAULT_ORDERS = [
  {
    id: 'ord-101',
    order_number: 'KUKU-892104',
    client_name: 'Kartikey Sharma',
    shipping_address: 'Suite 402, Royal Residency, Connaught Place, New Delhi - 110001',
    final_amount: 24999,
    status: 'Shipped',
    payment_method: 'Razorpay Online (UPI)',
    payment_status: 'Paid',
    courier_partner: 'Delhivery Express',
    tracking_number: 'DEL-892104-IN',
    tracking_url: 'https://www.delhivery.com/track/package/DEL-892104-IN',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    estimated_delivery_date: 'Tomorrow by 2:00 PM',
    items: [
      {
        id: 'a1',
        title: 'The Sovereign Chronograph',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
        price: 24999,
        quantity: 1,
        size: '42mm Case'
      }
    ]
  },
  {
    id: 'ord-102',
    order_number: 'KUKU-749102',
    client_name: 'Kartikey Sharma',
    shipping_address: 'Floor 18, Horizon Tower, Nariman Point, Mumbai - 400001',
    final_amount: 6499,
    status: 'Delivered',
    payment_method: 'Razorpay (Card)',
    payment_status: 'Paid',
    courier_partner: 'Blue Dart Priority',
    tracking_number: 'BD-749102-IN',
    tracking_url: 'https://www.bluedart.com',
    created_at: new Date(Date.now() - 432000000).toISOString(),
    estimated_delivery_date: 'Delivered on Mon, 25 Aug',
    items: [
      {
        id: 'e1',
        title: 'Aura Studio Wireless Headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        price: 6499,
        quantity: 1,
        size: 'Standard Edition'
      }
    ]
  },
  {
    id: 'ord-103',
    order_number: 'KUKU-639108',
    client_name: 'Kartikey Sharma',
    shipping_address: 'Bungalow 7, Amrita Shergill Marg, New Delhi - 110003',
    final_amount: 14999,
    status: 'Order Placed',
    payment_method: 'Cash on Delivery (COD)',
    payment_status: 'Pending',
    courier_partner: 'DTDC Courier',
    tracking_number: 'Pending Dispatch',
    tracking_url: '',
    created_at: new Date(Date.now() - 10800000).toISOString(),
    estimated_delivery_date: 'In 2 Business Days',
    items: [
      {
        id: 'm2',
        title: 'Savile Row Velvet Tuxedo Jacket',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
        price: 14999,
        quantity: 1,
        size: '40 Regular'
      }
    ]
  }
];

const OrderTracker = () => {
  const { orderId } = useParams();
  const { addToCart, addNotification } = useShop();

  const [ordersList, setOrdersList] = useState(DEFAULT_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState(DEFAULT_ORDERS[0]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          setOrdersList(prev => {
            const newOrders = data.filter(d => !prev.some(p => p.order_number === d.order_number));
            const merged = [...newOrders, ...prev];
            
            // If orderId param present, auto-select it
            if (orderId) {
              const matched = merged.find(o => o.order_number === orderId);
              if (matched) setSelectedOrder(matched);
            }
            return merged;
          });
        }
      } catch (e) {}
    };
    fetchOrders();
  }, [orderId]);

  useEffect(() => {
    if (orderId && ordersList.length > 0) {
      const match = ordersList.find(o => o.order_number === orderId);
      if (match) setSelectedOrder(match);
    }
  }, [orderId, ordersList]);

  const getStageIndex = (status) => {
    const idx = ORDER_STAGES.indexOf(status);
    return idx >= 0 ? idx : 0;
  };

  const isCancellable = (status) => {
    return ['Order Placed', 'Confirmed', 'Packed'].includes(status);
  };

  const handleCancelOrder = async (orderNumber) => {
    if (window.confirm(`Are you sure you want to cancel order #${orderNumber}?`)) {
      setOrdersList(prev => prev.map(o => o.order_number === orderNumber ? { ...o, status: 'Cancelled' } : o));
      if (selectedOrder?.order_number === orderNumber) {
        setSelectedOrder(prev => ({ ...prev, status: 'Cancelled' }));
      }

      try {
        await supabase.from('orders').update({ status: 'Cancelled' }).eq('order_number', orderNumber);
      } catch (e) {}

      addNotification('Order Cancelled', `Order #${orderNumber} has been safely cancelled.`, 'ORDER');
    }
  };

  const handlePrintInvoice = (order) => {
    setInvoiceOrder(order);
    setShowInvoiceModal(true);
  };

  const handleBuyAgain = (item) => {
    addToCart(item, item.size || 'Standard', item.color || 'Default', 1);
    addNotification('Added to Bag', `${item.title} added to bag for repurchase.`, 'CART');
  };

  const filteredOrders = ordersList.filter(o => {
    const matchesStatus = statusFilter === 'ALL' || 
      (statusFilter === 'ACTIVE' && !['Delivered', 'Cancelled'].includes(o.status)) ||
      (statusFilter === 'DELIVERED' && o.status === 'Delivered') ||
      (statusFilter === 'CANCELLED' && o.status === 'Cancelled');
    
    const matchesSearch = !searchTerm.trim() || 
      o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.client_name?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="orders-page-container container">
      
      {/* Page Header */}
      <div className="orders-header flex justify-between items-end pb-4 border-b border-border mb-8">
        <div>
          <span className="text-xs text-accent tracking-widest uppercase font-bold">CLIENT CONCIERGE</span>
          <h1 className="orders-title mt-1 flex items-center gap-3">
            <Package size={24} color="var(--color-accent)" /> MY ORDERS & CONCIERGE TRACKER
          </h1>
        </div>
        <span className="text-xs text-muted">Showing {filteredOrders.length} Orders</span>
      </div>

      {/* Filter & Search Bar */}
      <div className="orders-filter-bar flex justify-between items-center mb-6 gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-10 text-muted uppercase tracking-wider">FILTER:</span>
          {['ALL', 'ACTIVE', 'DELIVERED', 'CANCELLED'].map(f => (
            <button 
              key={f}
              className={`order-filter-btn text-xs ${statusFilter === f ? 'active' : ''}`}
              onClick={() => setStatusFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="order-search-input-box flex items-center gap-2 p-2 border border-border bg-surface rounded">
          <Search size={14} className="text-muted" />
          <input 
            type="text" 
            placeholder="Search Order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none text-xs text-white outline-none w-48"
          />
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-orders-state p-16 text-center border border-border bg-surface flex-col items-center rounded">
          <Package size={48} color="var(--color-accent)" className="mb-4" />
          <h2 className="text-lg font-heading tracking-widest text-white mb-2">NO MATCHING ORDERS FOUND</h2>
          <p className="text-xs text-muted max-w-md mx-auto mb-6">Explore our showroom collections to place your next order.</p>
          <Link to="/products" className="btn-primary">EXPLORE SHOWROOM</Link>
        </div>
      ) : (
        <div className="orders-grid-layout flex gap-8">
          
          {/* Left Column: Orders List */}
          <div className="orders-list-column flex-col flex-1 gap-4">
            {filteredOrders.map(order => {
              const isSelected = selectedOrder?.order_number === order.order_number;
              const cancellable = isCancellable(order.status);

              return (
                <div 
                  key={order.order_number}
                  className={`order-card p-5 border bg-surface flex-col gap-4 cursor-pointer rounded ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex justify-between items-center pb-3 border-b border-border text-xs flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <strong className="text-white text-sm font-mono font-bold">#{order.order_number}</strong>
                      <span className="text-muted">• {formatDate(order.created_at)}</span>
                    </div>
                    <span className={`status-badge ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Items in order */}
                  <div className="order-card-items flex flex-wrap gap-4">
                    {order.items?.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="order-item-thumb">
                          <img src={item.image} alt={item.title} />
                        </div>
                        <div className="flex-col text-xs">
                          <strong className="text-white">{item.title}</strong>
                          <span className="text-10 text-muted">Qty: {item.quantity} {item.size && `• Size: ${item.size}`}</span>
                          <span className="text-accent font-bold mt-1 font-mono">{formatINR(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-card-footer flex justify-between items-center pt-3 border-t border-border text-xs flex-wrap gap-3">
                    <span className="text-muted">
                      Total: <strong className="text-white font-mono">{formatINR(order.final_amount)}</strong> ({order.payment_method})
                    </span>
                    
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handlePrintInvoice(order); }}
                        className="btn-secondary text-10 py-1.5 px-3 flex items-center gap-1 font-bold"
                      >
                        <Download size={12} /> INVOICE
                      </button>
                      
                      {cancellable && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleCancelOrder(order.order_number); }}
                          className="text-10 text-error hover:underline px-2 cursor-pointer font-bold"
                        >
                          Cancel Order
                        </button>
                      )}

                      {order.items?.[0] && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleBuyAgain(order.items[0]); }}
                          className="text-10 text-accent hover:underline flex items-center gap-1 cursor-pointer font-bold"
                        >
                          <ShoppingBag size={11} /> Buy Again
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Live GPS Timeline & Shipping Details (PART 17 & 21) */}
          {selectedOrder && (
            <div className="order-details-tracker-column flex-col">
              <div className="tracker-card p-6 border border-border bg-surface sticky-tracker rounded">
                
                <span className="text-10 text-accent tracking-widest uppercase block mb-1 font-bold">REAL-TIME SHIPMENT DISPATCH</span>
                <h3 className="text-sm font-heading tracking-wider text-white pb-3 border-b border-border mb-5">
                  ORDER #{selectedOrder.order_number}
                </h3>

                {/* Status Callout */}
                <div className="p-4 bg-bg border border-border mb-5 flex items-center gap-3 rounded">
                  <Truck size={22} color="var(--color-accent)" />
                  <div className="flex-col text-xs">
                    <strong className="text-white text-sm">Status: {selectedOrder.status}</strong>
                    <span className="text-10 text-accent mt-0.5">{selectedOrder.estimated_delivery_date || 'In transit via Express Courier'}</span>
                  </div>
                </div>

                {/* Shipping & Courier Details (PART 21) */}
                <div className="shipping-partner-details p-4 border border-border bg-bg mb-5 flex-col gap-2 rounded text-xs">
                  <span className="text-10 text-accent uppercase font-bold tracking-wider">COURIER & TRACKING DETAILS:</span>
                  <div className="flex justify-between items-center">
                    <span className="text-muted">Courier Partner:</span>
                    <strong className="text-white">{selectedOrder.courier_partner || 'Delhivery Express'}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted">Tracking AWB:</span>
                    <span className="text-white font-mono">{selectedOrder.tracking_number || 'DEL-' + selectedOrder.order_number.replace('KUKU-', '') + '-IN'}</span>
                  </div>
                  {selectedOrder.tracking_url && (
                    <a 
                      href={selectedOrder.tracking_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-accent text-10 flex items-center gap-1 hover:underline mt-1 font-bold"
                    >
                      <ExternalLink size={12} /> Track on Courier Website
                    </a>
                  )}
                </div>

                {/* 6-Stage Timeline */}
                {selectedOrder.status !== 'Cancelled' ? (
                  <div className="tracking-timeline flex-col gap-6 pl-4 border-l-2 border-border mb-6">
                    {ORDER_STAGES.map((stage, idx) => {
                      const activeIdx = getStageIndex(selectedOrder.status);
                      const isDone = idx <= activeIdx;
                      const isCurrent = idx === activeIdx;

                      return (
                        <div key={stage} className={`timeline-node relative ${isDone ? 'completed' : ''}`}>
                          <div className={`node-bullet ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}>
                            {isDone && <Check size={10} color="#000" />}
                          </div>
                          <div className="flex-col text-xs">
                            <strong className={isDone ? 'text-white' : 'text-muted'}>{stage}</strong>
                            <span className="text-10 text-muted">
                              {isDone ? 'Verified by Logistics Concierge' : 'Pending dispatch checkpoint'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 border border-error bg-bg text-center mb-6 rounded">
                    <XCircle size={24} color="#ff4444" className="mx-auto mb-2" />
                    <strong className="text-xs text-error block">ORDER CANCELLED</strong>
                    <span className="text-10 text-muted">Any online payment will be refunded within 24 hours.</span>
                  </div>
                )}

                {/* Destination */}
                <div className="destination-box p-3 border border-border bg-bg text-xs flex-col gap-1 mb-5 rounded">
                  <span className="text-10 text-accent uppercase font-bold">DELIVERY DESTINATION:</span>
                  <span className="text-white">{typeof selectedOrder.shipping_address === 'string' ? selectedOrder.shipping_address : selectedOrder.shipping_address?.address}</span>
                </div>

                <button 
                  onClick={() => handlePrintInvoice(selectedOrder)}
                  className="btn-primary w-full py-3 text-xs flex items-center justify-center gap-2 font-bold"
                >
                  <FileText size={14} /> VIEW OFFICIAL TAX INVOICE
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Official Tax Invoice Modal */}
      {showInvoiceModal && invoiceOrder && (
        <div className="location-modal-overlay flex items-center justify-center">
          <div className="location-modal-card p-8 bg-surface border border-accent max-w-2xl w-full text-xs rounded">
            <div className="flex justify-between items-start pb-4 border-b border-border mb-6">
              <div>
                <h2 className="text-lg font-heading tracking-widest text-white font-bold">KUKU KART</h2>
                <span className="text-10 text-muted">TAX INVOICE & RETAIL RECEIPT</span>
              </div>
              <div className="text-right">
                <strong className="text-accent text-sm block font-mono">INVOICE #{invoiceOrder.order_number}</strong>
                <span className="text-10 text-muted">{formatDate(invoiceOrder.created_at)}</span>
              </div>
            </div>

            <div className="flex justify-between mb-6 pb-4 border-b border-border flex-wrap gap-4">
              <div>
                <span className="text-10 text-accent block mb-1 font-bold">BILLED TO:</span>
                <strong className="text-white block">{invoiceOrder.client_name}</strong>
                <span className="text-muted max-w-xs block">
                  {typeof invoiceOrder.shipping_address === 'string' ? invoiceOrder.shipping_address : invoiceOrder.shipping_address?.address}
                </span>
              </div>
              <div className="text-right">
                <span className="text-10 text-accent block mb-1 font-bold">PAYMENT DETAILS:</span>
                <strong className="text-success block">{invoiceOrder.payment_status?.toUpperCase()} ({invoiceOrder.payment_method})</strong>
                <span className="text-10 text-muted block mt-1">Courier: {invoiceOrder.courier_partner || 'Delhivery'}</span>
              </div>
            </div>

            <table className="w-full text-left border-collapse mb-6">
              <thead>
                <tr className="border-b border-border text-accent">
                  <th className="py-2">ITEM DESCRIPTION</th>
                  <th className="py-2 text-center">QTY</th>
                  <th className="py-2 text-right">PRICE</th>
                  <th className="py-2 text-right">TOTAL</th>
                </tr>
              </thead>
              <tbody className="text-muted">
                {invoiceOrder.items?.map((it, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="py-2 text-white">{it.title} ({it.size || 'Standard'})</td>
                    <td className="py-2 text-center">{it.quantity}</td>
                    <td className="py-2 text-right font-mono">{formatINR(it.price)}</td>
                    <td className="py-2 text-right text-accent font-mono font-bold">{formatINR(it.price * it.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-baseline pt-4 border-t border-border mb-6 text-sm">
              <strong className="text-white font-heading tracking-wider">TOTAL PAID:</strong>
              <strong className="text-accent font-mono text-xl font-bold">{formatINR(invoiceOrder.final_amount)}</strong>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => window.print()}
                className="btn-primary flex-1 py-3 text-xs flex items-center justify-center gap-2 font-bold"
              >
                <Download size={14} /> PRINT / SAVE PDF
              </button>
              <button 
                onClick={() => setShowInvoiceModal(false)}
                className="btn-secondary flex-1 py-3 text-xs font-bold"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OrderTracker;
