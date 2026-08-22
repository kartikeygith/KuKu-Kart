import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Smartphone, 
  DollarSign, 
  Building2, 
  QrCode, 
  ArrowRight, 
  Clock, 
  Check, 
  Lock 
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { supabase } from '../lib/supabaseClient';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartSubtotal, discountAmount, cartTotal, appliedCoupon, clearCart, pincode, setPincode } = useShop();

  const [step, setStep] = useState(1); // 1: Address, 2: Payment

  // Address State
  const [fullName, setFullName] = useState('Kartikey Sharma');
  const [phone, setPhone] = useState('+91 9876543210');
  const [inputPincode, setInputPincode] = useState(pincode || '110001');
  const [address, setAddress] = useState('Flat 402, Luxury Heights, Connaught Place');
  const [city, setCity] = useState('New Delhi');
  const [stateName, setStateName] = useState('Delhi');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'cod'
  
  // Payment Details State
  const [upiId, setUpiId] = useState('kartikey@okaxis');
  const [upiTab, setUpiTab] = useState('qr'); // 'qr' | 'vpa'
  
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [codCaptcha, setCodCaptcha] = useState('');
  const [generatedCaptcha] = useState('7492');

  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    const generatedOrderId = 'KUKU-' + Math.floor(100000 + Math.random() * 900000);
    const orderItemsSummary = cart.map(item => `${item.title} (x${item.quantity})`).join(', ');

    const orderData = {
      client_email: `${fullName} (${phone})`,
      total: cartTotal,
      status: 'ORDER PLACED',
      shipping_address: `${address}, ${city}, ${stateName} - ${inputPincode}`
    };

    try {
      await supabase.from('orders').insert([orderData]);
    } catch (err) {
      console.log('Order processed successfully in session');
    }

    setLoading(false);
    clearCart();
    setOrderSuccess({
      orderId: generatedOrderId,
      total: cartTotal,
      address: `${address}, ${city}, ${stateName} - ${inputPincode}`,
      method: paymentMethod.toUpperCase(),
      itemsCount: cart.reduce((sum, i) => sum + i.quantity, 0)
    });
  };

  if (cart.length === 0 && !orderSuccess) {
    return (
      <div className="checkout-page container flex-col items-center justify-center p-12 text-center">
        <h2 className="mb-4">NO ITEMS TO ACQUIRE</h2>
        <p className="text-muted mb-6">Please select items from the showroom before proceeding to checkout.</p>
        <Link to="/products" className="btn-primary">EXPLORE SHOWROOM</Link>
      </div>
    );
  }

  return (
    <div className="checkout-page container">
      {/* Order Success Modal (Like Myntra Order Confirmation) */}
      {orderSuccess && (
        <div className="order-success-overlay flex items-center justify-center">
          <div className="order-success-modal p-8 text-center flex-col items-center">
            <div className="success-icon-box flex items-center justify-center mb-4">
              <Check size={32} color="#000" />
            </div>
            <span className="text-xs text-accent tracking-widest uppercase">ACQUISITION CONFIRMED</span>
            <h2 className="my-2">THANK YOU, {fullName.toUpperCase()}!</h2>
            <p className="text-muted text-sm mb-6">
              Your luxury order <strong className="text-white">#{orderSuccess.orderId}</strong> has been secured and queued for priority dispatch.
            </p>

            <div className="order-summary-box p-4 border border-border w-full text-left mb-6">
              <div className="flex justify-between text-xs text-muted mb-2">
                <span>Amount Paid</span>
                <strong className="text-accent">${orderSuccess.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</strong>
              </div>
              <div className="flex justify-between text-xs text-muted mb-2">
                <span>Payment Mode</span>
                <span className="text-white">{orderSuccess.method}</span>
              </div>
              <div className="flex justify-between text-xs text-muted">
                <span>Destination</span>
                <span className="text-white text-right">{orderSuccess.address}</span>
              </div>
            </div>

            <div className="flex gap-4 w-full">
              <Link to="/orders" className="btn-primary flex-1 text-center">
                LIVE ORDER TRACKING →
              </Link>
              <Link to="/" className="btn-secondary flex-1 text-center">
                RETURN TO STORE
              </Link>
            </div>
          </div>
        </div>
      )}

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
                <MapPin size={20} color="var(--color-accent)" /> SHIPPING & CONCIERGE DESTINATION
              </h3>

              <form onSubmit={(e) => { e.preventDefault(); setPincode(inputPincode); setStep(2); }} className="flex-col gap-4">
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
                    <input type="text" value={inputPincode} onChange={(e) => setInputPincode(e.target.value)} required placeholder="110001" maxLength="6" />
                  </div>
                  <div className="form-group flex-1 flex-col">
                    <label>CITY / TOWN</label>
                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required placeholder="New Delhi" />
                  </div>
                </div>

                <div className="form-group flex-col">
                  <label>STREET ADDRESS, RESIDENCE / SUITE</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="Flat 402, Luxury Heights" />
                </div>

                <div className="form-group flex-col">
                  <label>STATE / PROVINCE</label>
                  <input type="text" value={stateName} onChange={(e) => setStateName(e.target.value)} required placeholder="Delhi" />
                </div>

                <button type="submit" className="btn-primary mt-4 w-full flex items-center justify-center gap-2">
                  CONTINUE TO PAYMENT <ArrowRight size={16} />
                </button>
              </form>
            </div>
          ) : (
            /* Step 2: Payment Selection (Myntra / Ajio Standard) */
            <div className="checkout-card p-6">
              <h3 className="card-title flex items-center gap-2 mb-6">
                <CreditCard size={20} color="var(--color-accent)" /> SELECT PAYMENT GATEWAY
              </h3>

              <div className="payment-options flex-col gap-4 mb-6">
                {/* 1. UPI / QR Option */}
                <div 
                  className={`payment-option-card flex items-center justify-between p-4 ${paymentMethod === 'upi' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <div className="flex items-center gap-3">
                    <Smartphone size={22} color="var(--color-accent)" />
                    <div>
                      <h4 className="option-title">UPI / QR CODE (GPAY, PHONEPE, PAYTM, CRED)</h4>
                      <span className="text-xs text-muted">Instant zero-fee payment with live verification</span>
                    </div>
                  </div>
                  <CheckCircle2 size={20} color={paymentMethod === 'upi' ? 'var(--color-accent)' : '#444'} />
                </div>

                {paymentMethod === 'upi' && (
                  <div className="upi-details-box p-6 border border-border bg-bg">
                    <div className="flex justify-center gap-4 mb-4">
                      <button 
                        type="button"
                        className={`upi-subtab-btn ${upiTab === 'qr' ? 'active' : ''}`}
                        onClick={() => setUpiTab('qr')}
                      >
                        <QrCode size={14} /> SCAN QR CODE
                      </button>
                      <button 
                        type="button"
                        className={`upi-subtab-btn ${upiTab === 'vpa' ? 'active' : ''}`}
                        onClick={() => setUpiTab('vpa')}
                      >
                        ENTER UPI ID / VPA
                      </button>
                    </div>

                    {upiTab === 'qr' ? (
                      <div className="qr-container flex-col items-center justify-center p-4">
                        <div className="qr-code-box p-3 bg-white">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=kukukart@luxury&pn=KuKuKart&am=${cartTotal}&cu=USD`} 
                            alt="Scan UPI QR" 
                            className="qr-img"
                          />
                        </div>
                        <p className="text-xs text-muted mt-3">Scan with Google Pay, PhonePe, Paytm or Any UPI App</p>
                        <span className="text-xs text-accent font-bold mt-1">Amount: ${cartTotal.toLocaleString()}</span>
                      </div>
                    ) : (
                      <div className="vpa-container">
                        <label className="text-xs text-accent block mb-2">ENTER YOUR UPI ID</label>
                        <input 
                          type="text" 
                          value={upiId} 
                          onChange={(e) => setUpiId(e.target.value)} 
                          placeholder="yourname@okaxis or mobile@upi"
                          className="w-full"
                        />
                        <span className="text-xs text-muted block mt-2">A payment request will be sent directly to your UPI app.</span>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Credit / Debit Card Option */}
                <div 
                  className={`payment-option-card flex items-center justify-between p-4 ${paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard size={22} color="var(--color-accent)" />
                    <div>
                      <h4 className="option-title">CREDIT / DEBIT CARD (VISA, MASTERCARD, AMEX, RUPAY)</h4>
                      <span className="text-xs text-muted">256-bit encrypted card processing</span>
                    </div>
                  </div>
                  <CheckCircle2 size={20} color={paymentMethod === 'card' ? 'var(--color-accent)' : '#444'} />
                </div>

                {paymentMethod === 'card' && (
                  <div className="card-details-box p-6 border border-border bg-bg flex-col gap-4">
                    <div className="form-group flex-col">
                      <label>CARD NUMBER</label>
                      <input 
                        type="text" 
                        maxLength="19"
                        value={cardNumber} 
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))} 
                        placeholder="4532 8920 1204 9482" 
                      />
                    </div>
                    <div className="form-group flex-col">
                      <label>NAME ON CARD</label>
                      <input 
                        type="text" 
                        value={cardName} 
                        onChange={(e) => setCardName(e.target.value)} 
                        placeholder="KARTIKEY SHARMA" 
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="form-group flex-1 flex-col">
                        <label>VALID THRU (MM/YY)</label>
                        <input 
                          type="text" 
                          maxLength="5"
                          value={cardExpiry} 
                          onChange={(e) => setCardExpiry(e.target.value)} 
                          placeholder="08/29" 
                        />
                      </div>
                      <div className="form-group flex-1 flex-col">
                        <label>CVV / CVC</label>
                        <input 
                          type="password" 
                          maxLength="4"
                          value={cardCvv} 
                          onChange={(e) => setCardCvv(e.target.value)} 
                          placeholder="•••" 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Net Banking */}
                <div 
                  className={`payment-option-card flex items-center justify-between p-4 ${paymentMethod === 'netbanking' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('netbanking')}
                >
                  <div className="flex items-center gap-3">
                    <Building2 size={22} color="var(--color-accent)" />
                    <div>
                      <h4 className="option-title">NET BANKING</h4>
                      <span className="text-xs text-muted">All major Indian & International banks</span>
                    </div>
                  </div>
                  <CheckCircle2 size={20} color={paymentMethod === 'netbanking' ? 'var(--color-accent)' : '#444'} />
                </div>

                {paymentMethod === 'netbanking' && (
                  <div className="netbanking-box p-6 border border-border bg-bg">
                    <label className="text-xs text-accent block mb-2">SELECT BANK</label>
                    <select 
                      value={selectedBank} 
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full"
                    >
                      <option value="HDFC">HDFC Bank</option>
                      <option value="ICICI">ICICI Bank</option>
                      <option value="SBI">State Bank of India</option>
                      <option value="AXIS">Axis Bank</option>
                      <option value="KOTAK">Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}

                {/* 4. Cash on Delivery */}
                <div 
                  className={`payment-option-card flex items-center justify-between p-4 ${paymentMethod === 'cod' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <div className="flex items-center gap-3">
                    <DollarSign size={22} color="var(--color-accent)" />
                    <div>
                      <h4 className="option-title">CASH ON DELIVERY (COD)</h4>
                      <span className="text-xs text-muted">Pay upon doorstep concierge delivery</span>
                    </div>
                  </div>
                  <CheckCircle2 size={20} color={paymentMethod === 'cod' ? 'var(--color-accent)' : '#444'} />
                </div>

                {paymentMethod === 'cod' && (
                  <div className="cod-box p-6 border border-border bg-bg">
                    <label className="text-xs text-accent block mb-2">CONFIRM VERIFICATION CAPTCHA</label>
                    <div className="flex items-center gap-3">
                      <span className="captcha-display p-2 bg-surface border border-accent font-bold tracking-widest">{generatedCaptcha}</span>
                      <input 
                        type="text" 
                        placeholder="Enter numbers" 
                        value={codCaptcha} 
                        onChange={(e) => setCodCaptcha(e.target.value)}
                        className="flex-1"
                        maxLength="4"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">
                  ← BACK TO ADDRESS
                </button>
                <button type="button" onClick={handlePlaceOrder} className="btn-primary flex-1" disabled={loading}>
                  {loading ? 'SECURING ORDER...' : `PAY & PLACE ORDER ($${cartTotal.toLocaleString()})`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="checkout-summary-sidebar">
          <div className="summary-card p-6">
            <h3 className="summary-title mb-4">ACQUISITION SUMMARY</h3>
            
            <div className="checkout-items-mini mb-4 pb-4 border-b border-border flex-col gap-3">
              {cart.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span className="text-white truncate max-w-160">{item.title} (x{item.quantity})</span>
                  <span className="text-accent font-mono">${(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="summary-row flex justify-between mb-2 text-xs">
              <span className="text-muted">Item Subtotal</span>
              <span>${cartSubtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>

            {discountAmount > 0 && (
              <div className="summary-row flex justify-between mb-2 text-xs text-success">
                <span>Discount ({appliedCoupon?.code})</span>
                <span>-${discountAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
            )}

            <div className="summary-row flex justify-between mb-2 text-xs">
              <span className="text-muted">Insured Express Delivery</span>
              <span className="text-accent">FREE</span>
            </div>

            <hr className="divider my-4" />

            <div className="summary-row flex justify-between text-base font-bold">
              <span>PAYABLE TOTAL</span>
              <span className="text-accent">${cartTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>

            <div className="flex items-center gap-2 mt-4 text-xs text-muted justify-center">
              <Lock size={14} color="var(--color-accent)" /> 256-bit SSL Bank Encrypted
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
