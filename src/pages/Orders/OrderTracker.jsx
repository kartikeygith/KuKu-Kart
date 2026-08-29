import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Sparkles
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { supabase } from '../../lib/supabaseClient';
import { formatDate } from '../../utils/helpers';
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
    order_number: 'KK-892104',
    client_name: 'Kartikey Sharma',
    shipping_address: 'Suite 402, Royal Residency, Connaught Place, New Delhi - 110001',
    final_amount: 12500.00,
    status: 'Shipped',
    payment_method: 'UPI',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    estimated_delivery_date: 'Tomorrow by 2:00 PM',
    items: [
      {
        id: 'a1',
        title: 'The Sovereign Chronograph',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
        price: 12500.00,
        quantity: 1,
        size: '42mm Case'
      }
    ]
  },
  {
    id: 'ord-102',
    order_number: 'KK-749102',
    client_name: 'Kartikey Sharma',
    shipping_address: 'Floor 18, Horizon Tower, Nariman Point, Mumbai - 400001',
    final_amount: 890.00,
    status: 'Delivered',
    payment_method: 'CARD',
    created_at: new Date(Date.now() - 432000000).toISOString(),
    estimated_delivery_date: 'Delivered on Mon, 25 Aug',
    items: [
      {
        id: 'e1',
        title: 'Aura Studio Wireless Headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        price: 890.00,
        quantity: 1,
        size: 'Standard Edition'
      }
    ]
  }
];

const OrderTracker = () => {
  const { addToCart, addNotification } = useShop();
  const [ordersList, setOrdersList] = useState(DEFAULT_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState(DEFAULT_ORDERS[0]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          setOrdersList(prev => {
            const newOrders = data.filter(d => !prev.some(p => p.order_number === d.order_number));
            return [...newOrders, ...prev];
          });
        }
      } catch (e) {}
    };
    fetchOrders();
  }, []);

  const getStageIndex = (status) => {
    const idx = ORDER_STAGES.indexOf(status);
    return idx >= 0 ? idx : 0;
  };

  const handleCancelOrder = (orderNumber) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      setOrdersList(prev => prev.map(o => o.order_number === orderNumber ? { ...o, status: 'Cancelled' } : o));
      if (selectedOrder.order_number === orderNumber) {
        setSelectedOrder(prev => ({ ...prev, status: 'Cancelled' }));
      }
      addNotification('Order Cancelled', `Order #${orderNumber} has been cancelled.`, 'ORDER');
    }
  };

  const handlePrintInvoice = (order) => {
    setInvoiceOrder(order);
    setShowInvoiceModal(true);
  };

  const handleBuyAgain = (item) => {
    addToCart(item, item.size || 'Standard', 'Default', 1);
    addNotification('Added to Bag', `${item.title} added to bag for re-order.`, 'CART');
  };

  return (
    <div className="orders-page-container container">
      {/* Header */}
      <div className="orders-header flex justify-between items-end pb-4 border-b border-border mb-8">
        <div>
          <span className="text-xs text-accent tracking-widest uppercase">CLIENT CONCIERGE</span>
          <h1 className="orders-title mt-1 flex items-center gap-3">
            <Package size={24} color="var(--color-accent)" /> MY ORDERS & CONCIERGE TRACKER
          </h1>
        </div>
        <span className="text-xs text-muted">Showing {ordersList.length} Acquisitions</span>
      </div>

      <div className="orders-grid-layout flex gap-8">
        
        {/* Left Column: Orders List */}
        <div className="orders-list-column flex-col flex-1 gap-4">
          {ordersList.map(order => {
            const isSelected = selectedOrder?.order_number === order.order_number;
            const currentIdx = getStageIndex(order.status);
            const isCancelled = order.status === 'Cancelled';

            return (
              <div 
                key={order.order_number}
                className={`order-card p-5 border bg-surface flex-col gap-4 cursor-pointer ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex justify-between items-center pb-3 border-b border-border text-xs">
                  <div className="flex items-center gap-2">
                    <strong className="text-white text-sm font-mono font-bold">#{order.order_number}</strong>
                    <span className="text-muted">• {formatDate(order.created_at)}</span>
                  </div>
                  <span className={`status-badge ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>

                {/* Items Summary in Card */}
                <div className="order-card-items flex gap-4">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="order-item-thumb">
                        <img src={item.image} alt={item.title} />
                      </div>
                      <div className="flex-col text-xs">
                        <strong className="text-white">{item.title}</strong>
                        <span className="text-10 text-muted">Qty: {item.quantity} {item.size && `• Size: ${item.size}`}</span>
                        <span className="text-accent font-bold mt-1">${item.price.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-card-footer flex justify-between items-center pt-3 border-t border-border text-xs">
                  <span className="text-muted">
                    Total: <strong className="text-white font-mono">${order.final_amount.toLocaleString()}</strong> ({order.payment_method})
                  </span>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handlePrintInvoice(order); }}
                      className="btn-secondary text-10 py-1 px-3 flex items-center gap-1"
                    >
                      <Download size={12} /> INVOICE
                    </button>
                    {!isCancelled && order.status !== 'Delivered' && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleCancelOrder(order.order_number); }}
                        className="text-10 text-error px-2 hover:underline"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Live Tracking Timeline */}
        {selectedOrder && (
          <div className="order-details-tracker-column flex-col">
            <div className="tracker-card p-6 border border-border bg-surface sticky-tracker">
              <span className="text-10 text-accent tracking-widest uppercase block mb-1">REAL-TIME GPS DISPATCH</span>
              <h3 className="text-sm font-heading tracking-wider text-white pb-3 border-b border-border mb-6">
                TRACKING ORDER #{selectedOrder.order_number}
              </h3>

              {/* Status Notice */}
              <div className="p-3 bg-bg border border-border mb-6 flex items-center gap-3">
                <Truck size={20} color="var(--color-accent)" />
                <div className="flex-col text-xs">
                  <strong className="text-white">Status: {selectedOrder.status}</strong>
                  <span className="text-10 text-accent">{selectedOrder.estimated_delivery_date || 'In transit'}</span>
                </div>
              </div>

              {/* 5-Stage Visual Timeline (Like Myntra Order Tracker) */}
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
                <div className="p-4 border border-error bg-bg text-center mb-6">
                  <XCircle size={24} color="#ff4444" className="mx-auto mb-2" />
                  <strong className="text-xs text-error block">ORDER CANCELLED</strong>
                  <span className="text-10 text-muted">Any online payment will be refunded within 24 hours.</span>
                </div>
              )}

              {/* Destination */}
              <div className="destination-box p-3 border border-border bg-bg text-xs flex-col gap-1 mb-6">
                <span className="text-10 text-accent uppercase">DELIVERY DESTINATION:</span>
                <span className="text-white">{selectedOrder.shipping_address}</span>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handlePrintInvoice(selectedOrder)}
                  className="btn-primary flex-1 py-3 text-xs flex items-center justify-center gap-2"
                >
                  <FileText size={14} /> VIEW OFFICIAL INVOICE
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Official Tax Invoice Modal */}
      {showInvoiceModal && invoiceOrder && (
        <div className="modal-overlay flex items-center justify-center">
          <div className="modal-card p-8 bg-surface border border-accent max-w-2xl w-full text-xs">
            <div className="flex justify-between items-start pb-4 border-b border-border mb-6">
              <div>
                <h2 className="text-lg font-heading tracking-widest text-white">KUKU KART</h2>
                <span className="text-10 text-muted">HAUTE COUTURE & LUXURY GOODS INVOICE</span>
              </div>
              <div className="text-right">
                <strong className="text-accent text-sm block">INVOICE #{invoiceOrder.order_number}</strong>
                <span className="text-10 text-muted">{formatDate(invoiceOrder.created_at)}</span>
              </div>
            </div>

            <div className="flex justify-between mb-6 pb-4 border-b border-border">
              <div>
                <span className="text-10 text-accent block mb-1">BILLED TO:</span>
                <strong className="text-white block">{invoiceOrder.client_name}</strong>
                <span className="text-muted max-w-xs block">{invoiceOrder.shipping_address}</span>
              </div>
              <div className="text-right">
                <span className="text-10 text-accent block mb-1">PAYMENT STATUS:</span>
                <strong className="text-success block">PAID ({invoiceOrder.payment_method})</strong>
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
                    <td className="py-2 text-right font-mono">${it.price.toLocaleString()}</td>
                    <td className="py-2 text-right text-accent font-mono font-bold">${(it.price * it.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-baseline pt-4 border-t border-border mb-6 text-sm">
              <strong className="text-white font-heading tracking-wider">TOTAL AMOUNT PAID:</strong>
              <strong className="text-accent font-mono text-lg font-bold">${invoiceOrder.final_amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</strong>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => window.print()}
                className="btn-primary flex-1 py-2 text-xs flex items-center justify-center gap-2"
              >
                <Download size={14} /> PRINT / SAVE PDF
              </button>
              <button 
                onClick={() => setShowInvoiceModal(false)}
                className="btn-secondary flex-1 py-2 text-xs"
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
