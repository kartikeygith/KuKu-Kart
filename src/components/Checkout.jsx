import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, ShieldCheck, CheckCircle2, Smartphone, DollarSign } from 'lucide-react';
import './Checkout.css';
import { supabase } from '../lib/supabaseClient';

const Checkout = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Address, 2: Payment

  // Address State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'cod'
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    const orderData = {
      client_email: fullName + ' (' + phone + ')',
      total: 12500.00,
      status: 'ORDER PLACED',
      shipping_address: `${address}, ${city}, ${stateName} - ${pincode}`
    };

    try {
      await supabase.from('orders').insert([orderData]);
    } catch (err) {
      console.log('Order saved locally/mock');
    } finally {
      setLoading(false);
      navigate('/orders');
    }
  };

  return (
    <div className="checkout-page container">
      <div className="checkout-header text-center mb-8">
        <h1>EXPRESS CHECKOUT</h1>
        <div className="checkout-steps flex justify-center gap-8 mt-4">
          <span className={`step-item ${step >= 1 ? 'active' : ''}`}>1. DELIVERY ADDRESS</span>
          <span className={`step-item ${step >= 2 ? 'active' : ''}`}>2. PAYMENT METHOD</span>
        </div>
      </div>

      <div className="checkout-content flex gap-8">
        <div className="checkout-form-container flex-1">
          {step === 1 ? (
            /* Step 1: Address Form */
            <div className="checkout-card p-6">
              <h3 className="card-title flex items-center gap-2 mb-6">
                <MapPin size={20} color="var(--color-accent)" /> SHIPPING ADDRESS
              </h3>

              <form onSubmit={() => setStep(2)} className="flex-col gap-4">
                <div className="flex gap-4">
                  <div className="form-group flex-1 flex-col">
                    <label>FULL NAME</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="John Doe" />
                  </div>
                  <div className="form-group flex-1 flex-col">
                    <label>MOBILE NUMBER</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+91 9876543210" />
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="form-group flex-1 flex-col">
                    <label>PINCODE / POSTAL CODE</label>
                    <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} required placeholder="110001" />
                  </div>
                  <div className="form-group flex-1 flex-col">
                    <label>CITY / TOWN</label>
                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required placeholder="New Delhi" />
                  </div>
                </div>

                <div className="form-group flex-col">
                  <label>STREET ADDRESS & HOUSE NO.</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="Flat 402, Luxury Heights" />
                </div>

                <div className="form-group flex-col">
                  <label>STATE</label>
                  <input type="text" value={stateName} onChange={(e) => setStateName(e.target.value)} required placeholder="Delhi" />
                </div>

                <button type="submit" className="btn-primary mt-4 w-full">PROCEED TO PAYMENT →</button>
              </form>
            </div>
          ) : (
            /* Step 2: Payment Selection */
            <div className="checkout-card p-6">
              <h3 className="card-title flex items-center gap-2 mb-6">
                <CreditCard size={20} color="var(--color-accent)" /> SELECT PAYMENT METHOD
              </h3>

              <div className="payment-options flex-col gap-4 mb-6">
                {/* UPI Option */}
                <div 
                  className={`payment-option-card flex items-center justify-between p-4 ${paymentMethod === 'upi' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <div className="flex items-center gap-3">
                    <Smartphone size={20} color="var(--color-accent)" />
                    <div>
                      <h4 className="option-title">UPI / GPAY / PHONEPE</h4>
                      <span className="text-xs text-muted">Instant zero-fee payment</span>
                    </div>
                  </div>
                  <CheckCircle2 size={20} color={paymentMethod === 'upi' ? 'var(--color-accent)' : '#444'} />
                </div>

                {paymentMethod === 'upi' && (
                  <div className="p-4 bg-surface border border-border">
                    <label className="text-xs text-accent">ENTER VPA / UPI ID</label>
                    <input 
                      type="text" 
                      value={upiId} 
                      onChange={(e) => setUpiId(e.target.value)} 
                      placeholder="mobile@upi or name@okaxis" 
                      className="w-full mt-2" 
                    />
                  </div>
                )}

                {/* Card Option */}
                <div 
                  className={`payment-option-card flex items-center justify-between p-4 ${paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard size={20} color="var(--color-accent)" />
                    <div>
                      <h4 className="option-title">CREDIT / DEBIT CARD</h4>
                      <span className="text-xs text-muted">Visa, Mastercard, Amex, RuPay</span>
                    </div>
                  </div>
                  <CheckCircle2 size={20} color={paymentMethod === 'card' ? 'var(--color-accent)' : '#444'} />
                </div>

                {/* COD Option */}
                <div 
                  className={`payment-option-card flex items-center justify-between p-4 ${paymentMethod === 'cod' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <div className="flex items-center gap-3">
                    <DollarSign size={20} color="var(--color-accent)" />
                    <div>
                      <h4 className="option-title">CASH ON DELIVERY (COD)</h4>
                      <span className="text-xs text-muted">Pay cash when package arrives</span>
                    </div>
                  </div>
                  <CheckCircle2 size={20} color={paymentMethod === 'cod' ? 'var(--color-accent)' : '#444'} />
                </div>
              </div>

              <div className="flex gap-4">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">← BACK TO ADDRESS</button>
                <button type="button" onClick={handlePlaceOrder} className="btn-primary flex-1" disabled={loading}>
                  {loading ? 'PROCESSING...' : 'PLACE ORDER NOW'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="checkout-summary-sidebar">
          <div className="summary-card p-6">
            <h3 className="summary-title mb-4">ACQUISITION SUMMARY</h3>
            <div className="summary-row flex justify-between mb-2">
              <span className="text-muted">Item Subtotal</span>
              <span>$12,500.00</span>
            </div>
            <div className="summary-row flex justify-between mb-2">
              <span className="text-muted">Delivery</span>
              <span className="text-accent">FREE EXPRESS</span>
            </div>
            <hr className="divider my-4" />
            <div className="summary-row flex justify-between text-lg font-bold">
              <span>PAYABLE TOTAL</span>
              <span className="text-accent">$12,500.00</span>
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs text-muted justify-center">
              <ShieldCheck size={16} color="var(--color-accent)" /> 256-bit SSL Encrypted
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
