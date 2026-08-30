import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Truck, 
  Package, 
  ArrowRight, 
  ShoppingBag, 
  Calendar, 
  MapPin, 
  Download, 
  Check, 
  ShieldCheck,
  Clock,
  Sparkles
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { formatDate } from '../../utils/helpers';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);

  useEffect(() => {
    if (!order && orderId) {
      const fetchOrder = async () => {
        try {
          const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('order_number', orderId)
            .single();

          if (!error && data) {
            setOrder(data);
          } else {
            // Mock fallback if offline
            setOrder({
              order_number: orderId,
              client_name: 'Valued Client',
              final_amount: 12500,
              payment_method: 'Razorpay Online',
              payment_status: 'Paid',
              status: 'Order Placed',
              shipping_address: 'Suite 402, Royal Residency, Connaught Place, New Delhi - 110001',
              estimated_delivery_date: 'In 2 Business Days'
            });
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [orderId, order]);

  const displayOrderId = order?.order_number || orderId || 'KUKU-892104';
  const isPaid = order?.payment_status?.toLowerCase() === 'paid';

  return (
    <div className="order-success-page container">
      <div className="order-success-card p-8 border border-accent bg-surface max-w-2xl mx-auto text-center flex-col items-center">
        
        {/* Animated Check Icon */}
        <div className="success-check-badge mb-4">
          <Check size={36} color="#000" />
        </div>

        <span className="text-10 text-accent tracking-widest uppercase font-bold">
          CONCIERGE ACQUISITION SECURED
        </span>
        <h1 className="success-heading text-2xl font-heading text-white my-2">
          ORDER PLACED SUCCESSFULLY
        </h1>
        <p className="text-xs text-muted max-w-md mx-auto mb-6">
          Thank you for shopping with <strong className="text-white">KuKu Kart</strong>. Your luxury allocation has been confirmed and registered for white-glove dispatch.
        </p>

        {/* Order Receipt Details Box */}
        <div className="order-receipt-details-box p-5 border border-border bg-bg text-left w-full mb-8 text-xs flex-col gap-3">
          
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-muted">Order ID:</span>
            <strong className="text-white font-mono text-sm tracking-wider font-bold">
              #{displayOrderId}
            </strong>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-muted">Total Payable:</span>
            <strong className="text-accent font-mono text-base font-bold">
              ${(order?.final_amount || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}
            </strong>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-muted">Payment Method:</span>
            <span className="text-white font-medium">
              {order?.payment_method || 'Online Payment'}
            </span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-muted">Payment Status:</span>
            <span className={`status-pill ${isPaid ? 'paid' : 'pending'}`}>
              {isPaid ? '● PAID' : '● PENDING (COD)'}
            </span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-muted">Estimated Delivery:</span>
            <span className="text-success font-bold flex items-center gap-1">
              <Truck size={13} /> {order?.estimated_delivery_date || 'In 2 Business Days'}
            </span>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-muted">Shipping Destination:</span>
            <span className="text-white text-right max-w-xs truncate">
              {typeof order?.shipping_address === 'string' 
                ? order.shipping_address 
                : order?.shipping_address?.address || 'Connaught Place, New Delhi - 110001'}
            </span>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="order-success-actions flex flex-wrap gap-4 w-full justify-center">
          <Link 
            to="/orders" 
            className="btn-primary flex-1 py-3 px-6 text-xs font-bold flex items-center justify-center gap-2"
          >
            <Truck size={14} /> TRACK ORDER
          </Link>
          
          <Link 
            to="/orders" 
            className="btn-secondary flex-1 py-3 px-6 text-xs flex items-center justify-center gap-2"
          >
            <Package size={14} /> VIEW MY ORDERS
          </Link>

          <Link 
            to="/products" 
            className="btn-secondary flex-1 py-3 px-6 text-xs flex items-center justify-center gap-2"
          >
            <ShoppingBag size={14} /> CONTINUE SHOPPING
          </Link>
        </div>

        <div className="security-guarantee-note flex items-center justify-center gap-2 mt-6 text-10 text-muted">
          <ShieldCheck size={13} color="var(--color-accent)" /> 100% Guaranteed Luxury Authenticity
        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;
