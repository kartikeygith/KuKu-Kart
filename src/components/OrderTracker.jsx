import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import './OrderTracker.css';
import { supabase } from '../lib/supabaseClient';

const OrderTracker = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await supabase.from('orders').select('*');
      if (data && data.length > 0) {
        setOrders(data);
        return;
      }
    } catch (e) {
      console.log('Using default order state');
    }
    
    // Default demo order
    setOrders([
      {
        id: 'ORD-98231',
        created_at: new Date().toLocaleDateString(),
        total: 12500.00,
        status: 'SHIPPED',
        item_title: 'THE CHRONOGRAPH - Limited Edition Timepiece',
        shipping_address: 'Flat 402, Luxury Heights, New Delhi - 110001'
      }
    ]);
  };

  const getStepActive = (status, targetStep) => {
    const steps = ['ORDER PLACED', 'PROCESSING', 'SHIPPED', 'OUT FOR DELIVERY', 'DELIVERED'];
    const currentIndex = steps.indexOf(status.toUpperCase());
    const targetIndex = steps.indexOf(targetStep.toUpperCase());
    return currentIndex >= targetIndex;
  };

  return (
    <div className="order-tracker-page container">
      <div className="tracker-header text-center mb-8">
        <h1>MY ORDERS & LIVE TRACKING</h1>
        <p className="subtitle">Real-time status updates for your luxury acquisitions.</p>
      </div>

      <div className="orders-container flex-col gap-6">
        {orders.map(order => (
          <div key={order.id} className="order-tracker-card p-6">
            <div className="order-top-bar flex justify-between items-center pb-4 mb-6 border-b border-border">
              <div>
                <span className="order-number text-accent font-heading">ORDER #{order.id}</span>
                <span className="order-date text-xs text-muted block mt-1">Placed on {order.created_at}</span>
              </div>
              <div className="order-total text-right">
                <span className="text-xs text-muted block">TOTAL AMOUNT</span>
                <span className="font-bold text-lg">${order.total}</span>
              </div>
            </div>

            {/* Visual Tracking Timeline */}
            <div className="timeline-container my-8">
              <div className="timeline-track flex justify-between items-center relative">
                {/* Step 1: Placed */}
                <div className={`timeline-step flex-col items-center ${getStepActive(order.status, 'ORDER PLACED') ? 'completed' : ''}`}>
                  <div className="step-icon-box flex items-center justify-center">
                    <Package size={18} />
                  </div>
                  <span className="step-label mt-2">Order Placed</span>
                </div>

                {/* Step 2: Processing */}
                <div className={`timeline-step flex-col items-center ${getStepActive(order.status, 'PROCESSING') ? 'completed' : ''}`}>
                  <div className="step-icon-box flex items-center justify-center">
                    <Clock size={18} />
                  </div>
                  <span className="step-label mt-2">Processing</span>
                </div>

                {/* Step 3: Shipped */}
                <div className={`timeline-step flex-col items-center ${getStepActive(order.status, 'SHIPPED') ? 'completed' : ''}`}>
                  <div className="step-icon-box flex items-center justify-center">
                    <Truck size={18} />
                  </div>
                  <span className="step-label mt-2">Shipped</span>
                </div>

                {/* Step 4: Delivered */}
                <div className={`timeline-step flex-col items-center ${getStepActive(order.status, 'DELIVERED') ? 'completed' : ''}`}>
                  <div className="step-icon-box flex items-center justify-center">
                    <CheckCircle2 size={18} />
                  </div>
                  <span className="step-label mt-2">Delivered</span>
                </div>
              </div>
            </div>

            {/* Item Details */}
            <div className="order-details-bottom flex justify-between items-center pt-4 border-t border-border mt-6">
              <div className="flex-col">
                <span className="text-xs text-muted">DELIVERY DESTINATION</span>
                <span className="text-sm font-medium">{order.shipping_address || 'New Delhi, India'}</span>
              </div>
              <button className="btn-secondary text-xs flex items-center gap-1">
                DOWNLOAD INVOICE PDF <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTracker;
