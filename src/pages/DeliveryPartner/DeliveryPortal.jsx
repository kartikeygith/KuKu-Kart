import React, { useState } from 'react';
import { Truck, CheckCircle2, MapPin, Phone, Check, Package, Clock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useShop } from '../../context/ShopContext';
import './DeliveryPortal.css';

const DeliveryPortal = () => {
  const { user } = useAuth();
  const { addNotification } = useShop();

  const [assignedOrders, setAssignedOrders] = useState([
    {
      id: 'del-1',
      orderNumber: 'KK-892104',
      clientName: 'Kartikey Sharma',
      clientPhone: '+91 9876543210',
      address: 'Suite 402, Royal Residency, Connaught Place, New Delhi - 110001',
      amount: 12500.00,
      paymentStatus: 'PAID (UPI)',
      status: 'Shipped',
      slot: 'Morning 10:00 AM - 1:00 PM'
    },
    {
      id: 'del-2',
      orderNumber: 'KK-639108',
      clientName: 'Vikram Singhania',
      clientPhone: '+91 9811224455',
      address: 'Bungalow 7, Amrita Shergill Marg, New Delhi - 110003',
      amount: 3400.00,
      paymentStatus: 'COLLECT CASH ($3,400.00)',
      status: 'Out for Delivery',
      slot: 'Afternoon 2:00 PM - 5:00 PM'
    }
  ]);

  const updateDeliveryStatus = (id, newStatus) => {
    setAssignedOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    addNotification('Delivery Status Updated', `Order marked as ${newStatus}.`, 'ORDER');
  };

  return (
    <div className="delivery-portal-page container">
      <div className="delivery-header flex justify-between items-end pb-4 border-b border-border mb-8">
        <div>
          <span className="text-xs text-success tracking-widest uppercase font-bold flex items-center gap-1">
            ● WHITE-GLOVE COURIER DISPATCH
          </span>
          <h1 className="delivery-title mt-1 flex items-center gap-3">
            <Truck size={24} color="#00c851" /> DELIVERY EXECUTIVE CONSOLE
          </h1>
        </div>
        <span className="text-xs text-muted">Active Partner: <strong className="text-white">{user?.full_name || 'Vikram Courier'}</strong></span>
      </div>

      <div className="assigned-deliveries-list flex-col gap-6 max-w-3xl mx-auto">
        {assignedOrders.map(order => (
          <div key={order.id} className="delivery-task-card p-6 border border-border bg-surface flex-col gap-4">
            <div className="flex justify-between items-center pb-3 border-b border-border text-xs">
              <div className="flex items-center gap-2">
                <strong className="text-white text-base font-mono font-bold">#{order.orderNumber}</strong>
                <span className="text-accent font-bold">({order.slot})</span>
              </div>
              <span className={`del-status-badge ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                {order.status.toUpperCase()}
              </span>
            </div>

            <div className="delivery-task-body flex justify-between items-start gap-4 text-xs">
              <div className="flex-col gap-1 flex-1">
                <span className="text-10 text-accent uppercase">RECIPIENT & DESTINATION:</span>
                <strong className="text-white text-sm">{order.clientName}</strong>
                <p className="text-muted leading-relaxed mt-1 flex items-center gap-1">
                  <MapPin size={14} color="var(--color-accent)" /> {order.address}
                </p>
                <span className="text-white flex items-center gap-1 mt-1">
                  <Phone size={13} color="#00c851" /> Call: {order.clientPhone}
                </span>
              </div>

              <div className="flex-col text-right">
                <span className="text-10 text-muted uppercase">PAYMENT INSTRUCTION:</span>
                <strong className={order.paymentStatus.includes('CASH') ? 'text-error text-sm' : 'text-success text-sm'}>
                  {order.paymentStatus}
                </strong>
              </div>
            </div>

            {/* Quick Status Changers */}
            <div className="delivery-task-actions flex justify-end gap-3 pt-4 border-t border-border">
              {order.status === 'Shipped' && (
                <button 
                  onClick={() => updateDeliveryStatus(order.id, 'Out for Delivery')}
                  className="btn-primary text-xs py-2 px-4"
                >
                  START OUT FOR DELIVERY →
                </button>
              )}

              {order.status === 'Out for Delivery' && (
                <button 
                  onClick={() => updateDeliveryStatus(order.id, 'Delivered')}
                  className="btn-primary text-xs py-2 px-4 bg-success border-success text-black font-bold"
                >
                  <Check size={14} /> MARK AS DELIVERED
                </button>
              )}

              {order.status === 'Delivered' && (
                <span className="text-xs text-success font-bold flex items-center gap-1">
                  <CheckCircle2 size={16} /> COMPLETED & SIGNED
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryPortal;
