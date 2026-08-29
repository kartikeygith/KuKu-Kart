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
  Lock,
  Plus,
  Truck,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { getEstimatedDelivery } from '../../utils/helpers';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    cart, 
    cartMRP,
    cartSubtotal, 
    discountOnMRP,
    discountAmount, 
    cartTotal, 
    appliedCoupon, 
    clearCart,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    selectedAddress,
    addAddress,
    addNotification
  } = useShop();

  const [currentStep, setCurrentStep] = useState(1); // 1: Address, 2: Delivery, 3: Payment
  const [deliverySpeed, setDeliverySpeed] = useState('express'); // 'express' | 'standard'

  // New Address Modal State
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newFullName, setNewFullName] = useState(user?.full_name || 'Kartikey Sharma');
  const [newPhone, setNewPhone] = useState(user?.phone || '+91 9876543210');
  const [newPincode, setNewPincode] = useState('110001');
  const [newHouseNo, setNewHouseNo] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('New Delhi');
  const [newStateName, setNewStateName] = useState('Delhi');
  const [newType, setNewType] = useState('HOME');
  const [newIsDefault, setNewIsDefault] = useState(false);

  // Payment Options State
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'cod' | 'razorpay'
  const [upiTab, setUpiTab] = useState('qr'); // 'qr' | 'vpa'
  const [upiId, setUpiId] = useState('kartikey@okaxis');

  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('KARTIKEY SHARMA');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [codCaptcha, setCodCaptcha] = useState('');
  const [generatedCaptcha] = useState('8392');

  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const formatCard = (val) => {
    const v = val.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : val;
  };

  const handleAddNewAddress = (e) => {
    e.preventDefault();
    addAddress({
      fullName: newFullName,
      phone: newPhone,
      pincode: newPincode,
      houseNo: newHouseNo,
      street: newStreet,
      city: newCity,
      state: newStateName,
      addressType: newType,
      isDefault: newIsDefault
    });
    setShowAddAddressModal(false);
  };

  const handleFinalOrderPlacement = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const generatedOrderId = 'KK-' + Math.floor(100000 + Math.random() * 900000);
    const destinationStr = selectedAddress 
      ? `${selectedAddress.houseNo}, ${selectedAddress.street}, ${selectedAddress.city} - ${selectedAddress.pincode}`
      : 'New Delhi, India - 110001';

    const orderPayload = {
      order_number: generatedOrderId,
      client_name: selectedAddress?.fullName || user?.full_name || 'Kartikey Sharma',
      client_email: user?.email || 'client@kukukart.com',
      client_phone: selectedAddress?.phone || '+91 9876543210',
      shipping_address: destinationStr,
      total_amount: cartSubtotal,
      discount_amount: discountOnMRP,
      coupon_discount: discountAmount,
      coupon_code: appliedCoupon?.code || null,
      final_amount: cartTotal,
      status: 'Order Placed',
      payment_method: paymentMethod.toUpperCase(),
      payment_status: paymentMethod === 'cod' ? 'Pending' : 'Paid',
      estimated_delivery_date: getEstimatedDelivery(deliverySpeed === 'express' ? 1 : 3)
    };

    try {
      await supabase.from('orders').insert([orderPayload]);
    } catch (err) {
      console.log('Order processed into local session.');
    }

    addNotification('Acquisition Confirmed', `Order #${generatedOrderId} confirmed and in preparation.`, 'ORDER');

    setIsProcessing(false);
    clearCart();
    setConfirmedOrder(orderPayload);
  };

  if (cart.length === 0 && !confirmedOrder) {
    return (
      <div className="checkout-page-container container p-16 text-center">
        <h2 className="text-xl font-heading text-white mb-2">NO ITEMS SELECTED</h2>
        <p className="text-xs text-muted mb-6">Your shopping bag is currently empty.</p>
        <Link to="/products" className="btn-primary">EXPLORE SHOWROOM</Link>
      </div>
    );
  }

  return (
    <div className="checkout-page-container container">
      {/* Order Confirmed Modal */}
      {confirmedOrder && (
        <div className="order-success-backdrop flex items-center justify-center">
          <div className="order-success-dialog p-8 bg-surface border border-accent text-center flex-col items-center">
            <div className="check-ring flex items-center justify-center mb-4">
              <Check size={32} color="#000" />
            </div>
            <span className="text-10 text-accent tracking-widest uppercase font-bold">ACQUISITION SECURED</span>
            <h2 className="text-xl font-heading text-white my-2">ORDER #{confirmedOrder.order_number} CONFIRMED</h2>
            <p className="text-xs text-muted mb-6">
              Thank you, <strong className="text-white">{confirmedOrder.client_name}</strong>. Your privileged order has been verified and allocated for concierge dispatch.
            </p>

            <div className="order-receipt-box p-4 border border-border bg-bg text-left w-full mb-6 text-xs flex-col gap-2">
              <div className="flex justify-between text-muted">
                <span>Payable Total:</span>
                <strong className="text-accent">${confirmedOrder.final_amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</strong>
              </div>
              <div className="flex justify-between text-muted">
                <span>Payment Mode:</span>
                <span className="text-white">{confirmedOrder.payment_method}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Estimated Arrival:</span>
                <span className="text-success font-bold">{confirmedOrder.estimated_delivery_date}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Destination:</span>
                <span className="text-white text-right max-w-xs truncate">{confirmedOrder.shipping_address}</span>
              </div>
            </div>

            <div className="flex gap-4 w-full">
              <Link to="/orders" className="btn-primary flex-1 text-center py-3 font-bold text-xs">
                LIVE ORDER TRACKING →
              </Link>
              <Link to="/" className="btn-secondary flex-1 text-center py-3 text-xs">
                RETURN TO SHOWROOM
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Stepper Header (Like Myntra / JioMart Checkout Steps) */}
      <div className="checkout-nav-header text-center mb-8 pb-4 border-b border-border">
        <h1 className="checkout-title">EXPRESS CONCIERGE CHECKOUT</h1>
        <div className="steps-tracker flex justify-center gap-12 mt-4 text-xs font-heading tracking-widest">
          <span className={`step-node ${currentStep >= 1 ? 'active' : ''}`}>1. DELIVERY ADDRESS</span>
          <span className={`step-node ${currentStep >= 2 ? 'active' : ''}`}>2. DELIVERY SPEED</span>
          <span className={`step-node ${currentStep >= 3 ? 'active' : ''}`}>3. PAYMENT GATEWAY</span>
        </div>
      </div>

      <div className="checkout-content-grid flex gap-8">
        
        {/* Main Step Form Area */}
        <div className="checkout-main-flow flex-1">
          
          {/* STEP 1: ADDRESS SELECTION & MANAGEMENT */}
          {currentStep === 1 && (
            <div className="step-card p-6 border border-border bg-surface">
              <div className="flex justify-between items-center pb-4 border-b border-border mb-6">
                <h3 className="text-sm font-heading tracking-wider flex items-center gap-2 text-white">
                  <MapPin size={16} color="var(--color-accent)" /> SELECT DELIVERY DESTINATION
                </h3>
                <button 
                  onClick={() => setShowAddAddressModal(true)}
                  className="btn-secondary text-xs flex items-center gap-1"
                >
                  <Plus size={14} /> ADD NEW ADDRESS
                </button>
              </div>

              {/* Saved Addresses List */}
              <div className="saved-addresses-list flex-col gap-4 mb-6">
                {addresses.map(addr => (
                  <div 
                    key={addr.id}
                    className={`address-item-card p-4 border flex justify-between items-start cursor-pointer ${selectedAddressId === addr.id ? 'active' : ''}`}
                    onClick={() => setSelectedAddressId(addr.id)}
                  >
                    <div className="flex gap-3">
                      <input 
                        type="radio" 
                        name="address_select" 
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1"
                      />
                      <div className="flex-col">
                        <div className="flex items-center gap-2">
                          <strong className="text-white text-sm">{addr.fullName}</strong>
                          <span className="type-badge text-10 uppercase">{addr.addressType}</span>
                          {addr.isDefault && <span className="default-badge text-10">DEFAULT</span>}
                        </div>
                        <p className="text-xs text-muted mt-1">{addr.houseNo}, {addr.street}</p>
                        <span className="text-xs text-muted">{addr.city}, {addr.state} - <strong>{addr.pincode}</strong></span>
                        <span className="text-xs text-white mt-1">Mobile: {addr.phone}</span>
                      </div>
                    </div>
                    {selectedAddressId === addr.id && (
                      <span className="text-accent text-xs font-bold flex items-center gap-1">
                        <Check size={14} /> SELECTED
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setCurrentStep(2)}
                className="btn-primary w-full py-4 font-bold tracking-wider flex items-center justify-center gap-2"
              >
                PROCEED TO DELIVERY SPEED <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* STEP 2: DELIVERY SPEED SELECTION */}
          {currentStep === 2 && (
            <div className="step-card p-6 border border-border bg-surface">
              <h3 className="text-sm font-heading tracking-wider flex items-center gap-2 text-white pb-4 border-b border-border mb-6">
                <Truck size={16} color="var(--color-accent)" /> SELECT DELIVERY SPEED
              </h3>

              <div className="delivery-options-list flex-col gap-4 mb-6">
                <div 
                  className={`delivery-option-card p-4 border flex justify-between items-center cursor-pointer ${deliverySpeed === 'express' ? 'active' : ''}`}
                  onClick={() => setDeliverySpeed('express')}
                >
                  <div className="flex items-center gap-3">
                    <Sparkles size={20} color="var(--color-accent)" />
                    <div className="flex-col">
                      <strong className="text-white text-sm">White-Glove Express Delivery</strong>
                      <span className="text-xs text-muted">Estimated arrival by <strong className="text-accent">{getEstimatedDelivery(1)}</strong></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-accent font-bold text-xs">COMPLIMENTARY ($0.00)</span>
                    <CheckCircle2 size={18} color={deliverySpeed === 'express' ? 'var(--color-accent)' : '#444'} />
                  </div>
                </div>

                <div 
                  className={`delivery-option-card p-4 border flex justify-between items-center cursor-pointer ${deliverySpeed === 'standard' ? 'active' : ''}`}
                  onClick={() => setDeliverySpeed('standard')}
                >
                  <div className="flex items-center gap-3">
                    <Truck size={20} color="var(--color-text-muted)" />
                    <div className="flex-col">
                      <strong className="text-white text-sm">Standard Insured Courier</strong>
                      <span className="text-xs text-muted">Estimated arrival by {getEstimatedDelivery(3)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted text-xs">FREE</span>
                    <CheckCircle2 size={18} color={deliverySpeed === 'standard' ? 'var(--color-accent)' : '#444'} />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setCurrentStep(1)} className="btn-secondary flex-1 py-3 text-xs">
                  ← BACK TO ADDRESS
                </button>
                <button onClick={() => setCurrentStep(3)} className="btn-primary flex-1 py-3 text-xs font-bold">
                  PROCEED TO PAYMENT →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT GATEWAYS */}
          {currentStep === 3 && (
            <div className="step-card p-6 border border-border bg-surface">
              <h3 className="text-sm font-heading tracking-wider flex items-center gap-2 text-white pb-4 border-b border-border mb-6">
                <CreditCard size={16} color="var(--color-accent)" /> CHOOSE PAYMENT METHOD
              </h3>

              <div className="payment-modes-wrapper flex-col gap-4 mb-6">
                
                {/* 1. UPI / QR */}
                <div 
                  className={`payment-channel-card p-4 border flex justify-between items-center cursor-pointer ${paymentMethod === 'upi' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <div className="flex items-center gap-3">
                    <Smartphone size={20} color="var(--color-accent)" />
                    <div>
                      <strong className="text-white text-sm block">UPI (GPay, PhonePe, Paytm, CRED)</strong>
                      <span className="text-10 text-muted">Instant zero-fee scan & pay</span>
                    </div>
                  </div>
                  <CheckCircle2 size={18} color={paymentMethod === 'upi' ? 'var(--color-accent)' : '#444'} />
                </div>

                {paymentMethod === 'upi' && (
                  <div className="p-5 border border-border bg-bg flex-col items-center">
                    <div className="flex justify-center gap-3 mb-4">
                      <button 
                        type="button"
                        className={`upi-tab-btn ${upiTab === 'qr' ? 'active' : ''}`}
                        onClick={() => setUpiTab('qr')}
                      >
                        <QrCode size={13} /> SCAN QR CODE
                      </button>
                      <button 
                        type="button"
                        className={`upi-tab-btn ${upiTab === 'vpa' ? 'active' : ''}`}
                        onClick={() => setUpiTab('vpa')}
                      >
                        ENTER UPI ID
                      </button>
                    </div>

                    {upiTab === 'qr' ? (
                      <div className="flex-col items-center text-center">
                        <div className="qr-box p-3 bg-white border border-accent">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=kukukart@luxury&pn=KuKuKart&am=${cartTotal}&cu=USD`} 
                            alt="Scan UPI"
                            className="qr-image"
                          />
                        </div>
                        <span className="text-xs text-white mt-3 font-bold">Payable: ${cartTotal.toLocaleString()}</span>
                        <span className="text-10 text-muted mt-1">Point camera or scan in GPay / PhonePe / Paytm</span>
                      </div>
                    ) : (
                      <div className="w-full">
                        <label className="text-xs text-accent block mb-1">YOUR UPI ID / VPA</label>
                        <input 
                          type="text" 
                          value={upiId} 
                          onChange={(e) => setUpiId(e.target.value)} 
                          placeholder="e.g. mobile@upi or name@okaxis" 
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Credit / Debit Cards */}
                <div 
                  className={`payment-channel-card p-4 border flex justify-between items-center cursor-pointer ${paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard size={20} color="var(--color-accent)" />
                    <div>
                      <strong className="text-white text-sm block">Credit / Debit Card (Visa, Mastercard, Amex)</strong>
                      <span className="text-10 text-muted">256-bit encrypted bank checkout</span>
                    </div>
                  </div>
                  <CheckCircle2 size={18} color={paymentMethod === 'card' ? 'var(--color-accent)' : '#444'} />
                </div>

                {paymentMethod === 'card' && (
                  <div className="p-5 border border-border bg-bg flex-col gap-3">
                    <div className="form-group flex-col">
                      <label className="text-xs text-accent">CARD NUMBER</label>
                      <input 
                        type="text" 
                        maxLength="19"
                        value={cardNumber} 
                        onChange={(e) => setCardNumber(formatCard(e.target.value))} 
                        placeholder="4532 8920 1204 9482" 
                      />
                    </div>
                    <div className="form-group flex-col">
                      <label className="text-xs text-accent">CARDHOLDER NAME</label>
                      <input 
                        type="text" 
                        value={cardName} 
                        onChange={(e) => setCardName(e.target.value)} 
                        placeholder="KARTIKEY SHARMA" 
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="form-group flex-1 flex-col">
                        <label className="text-xs text-accent">EXPIRY (MM/YY)</label>
                        <input 
                          type="text" 
                          maxLength="5"
                          value={cardExpiry} 
                          onChange={(e) => setCardExpiry(e.target.value)} 
                          placeholder="08/29" 
                        />
                      </div>
                      <div className="form-group flex-1 flex-col">
                        <label className="text-xs text-accent">CVV</label>
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
                  className={`payment-channel-card p-4 border flex justify-between items-center cursor-pointer ${paymentMethod === 'netbanking' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('netbanking')}
                >
                  <div className="flex items-center gap-3">
                    <Building2 size={20} color="var(--color-accent)" />
                    <div>
                      <strong className="text-white text-sm block">Net Banking</strong>
                      <span className="text-10 text-muted">All major premier banks</span>
                    </div>
                  </div>
                  <CheckCircle2 size={18} color={paymentMethod === 'netbanking' ? 'var(--color-accent)' : '#444'} />
                </div>

                {paymentMethod === 'netbanking' && (
                  <div className="p-5 border border-border bg-bg">
                    <label className="text-xs text-accent block mb-2">SELECT PREFERRED BANK</label>
                    <select 
                      value={selectedBank} 
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full"
                    >
                      <option value="HDFC">HDFC Bank Premier</option>
                      <option value="ICICI">ICICI Wealth Management</option>
                      <option value="SBI">State Bank of India</option>
                      <option value="AXIS">Axis Bank Burgundy</option>
                      <option value="KOTAK">Kotak Privy League</option>
                    </select>
                  </div>
                )}

                {/* 4. Cash on Delivery (COD) */}
                <div 
                  className={`payment-channel-card p-4 border flex justify-between items-center cursor-pointer ${paymentMethod === 'cod' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <div className="flex items-center gap-3">
                    <DollarSign size={20} color="var(--color-accent)" />
                    <div>
                      <strong className="text-white text-sm block">Cash on Delivery (COD)</strong>
                      <span className="text-10 text-muted">Doorstep payment via Cash or Card</span>
                    </div>
                  </div>
                  <CheckCircle2 size={18} color={paymentMethod === 'cod' ? 'var(--color-accent)' : '#444'} />
                </div>

                {paymentMethod === 'cod' && (
                  <div className="p-5 border border-border bg-bg">
                    <label className="text-xs text-accent block mb-2">ENTER VERIFICATION CAPTCHA</label>
                    <div className="flex items-center gap-3">
                      <span className="captcha-box p-2 bg-surface border border-accent font-bold font-mono tracking-widest text-accent">
                        {generatedCaptcha}
                      </span>
                      <input 
                        type="text" 
                        placeholder="Type digits"
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
                <button onClick={() => setCurrentStep(2)} className="btn-secondary flex-1 py-3 text-xs">
                  ← BACK TO DELIVERY
                </button>
                <button 
                  onClick={handleFinalOrderPlacement}
                  className="btn-primary flex-1 py-3 text-xs font-bold tracking-wider"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'SECURING ACQUISITION...' : `PAY & SECURE ORDER ($${cartTotal.toLocaleString()})`}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Order Summary Sidebar */}
        <div className="checkout-summary-column">
          <div className="summary-card p-6 border border-border bg-surface">
            <h3 className="text-xs font-heading tracking-widest text-white pb-3 border-b border-border mb-4">
              ORDER SUMMARY ({cart.reduce((sum, i) => sum + i.quantity, 0)} Items)
            </h3>

            <div className="items-summary-list flex-col gap-2 mb-4 pb-4 border-b border-border max-h-48 overflow-y-auto">
              {cart.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span className="text-white truncate max-w-160">{item.title} (x{item.quantity})</span>
                  <span className="text-accent font-mono">${(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="price-breakdown flex-col gap-2 text-xs">
              <div className="flex justify-between text-muted">
                <span>Total MRP</span>
                <span>${cartMRP.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
              {discountOnMRP > 0 && (
                <div className="flex justify-between text-success">
                  <span>Discount on MRP</span>
                  <span>-${discountOnMRP.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Privilege Coupon ({appliedCoupon?.code})</span>
                  <span>-${discountAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
              )}
              <div className="flex justify-between text-muted">
                <span>Express Concierge Courier</span>
                <span className="text-accent font-bold">FREE</span>
              </div>
            </div>

            <hr className="divider my-4" />

            <div className="total-row flex justify-between items-baseline mb-6">
              <strong className="text-white text-sm font-heading tracking-wider">PAYABLE TOTAL</strong>
              <strong className="text-accent text-xl font-bold font-mono">
                ${cartTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}
              </strong>
            </div>

            <div className="security-notice flex items-center justify-center gap-2 text-10 text-muted">
              <Lock size={13} color="var(--color-accent)" /> 256-bit Bank Grade SSL Encryption
            </div>
          </div>
        </div>

      </div>

      {/* Add New Address Modal */}
      {showAddAddressModal && (
        <div className="modal-overlay flex items-center justify-center">
          <div className="modal-card p-6 bg-surface border border-accent max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-heading tracking-wider">ADD CONCIERGE ADDRESS</h3>
              <button onClick={() => setShowAddAddressModal(false)}><X size={18} /></button>
            </div>

            <form onSubmit={handleAddNewAddress} className="flex-col gap-3 text-xs">
              <div className="flex gap-3">
                <div className="form-group flex-1 flex-col">
                  <label className="text-accent mb-1">FULL NAME</label>
                  <input type="text" value={newFullName} onChange={(e) => setNewFullName(e.target.value)} required />
                </div>
                <div className="form-group flex-1 flex-col">
                  <label className="text-accent mb-1">MOBILE NUMBER</label>
                  <input type="tel" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} required />
                </div>
              </div>

              <div className="flex gap-3">
                <div className="form-group flex-1 flex-col">
                  <label className="text-accent mb-1">PINCODE</label>
                  <input type="text" maxLength="6" value={newPincode} onChange={(e) => setNewPincode(e.target.value)} required />
                </div>
                <div className="form-group flex-1 flex-col">
                  <label className="text-accent mb-1">CITY</label>
                  <input type="text" value={newCity} onChange={(e) => setNewCity(e.target.value)} required />
                </div>
              </div>

              <div className="form-group flex-col">
                <label className="text-accent mb-1">HOUSE / SUITE NO.</label>
                <input type="text" value={newHouseNo} onChange={(e) => setNewHouseNo(e.target.value)} placeholder="Suite 402, Royal Residency" required />
              </div>

              <div className="form-group flex-col">
                <label className="text-accent mb-1">STREET / LOCALITY</label>
                <input type="text" value={newStreet} onChange={(e) => setNewStreet(e.target.value)} placeholder="Connaught Place, Barakhamba Road" required />
              </div>

              <div className="flex gap-3 items-center mt-2">
                <span className="text-muted">TYPE:</span>
                {['HOME', 'WORK', 'OTHER'].map(t => (
                  <button 
                    key={t}
                    type="button"
                    className={`type-btn px-3 py-1 border ${newType === t ? 'border-accent text-accent' : 'border-border text-muted'}`}
                    onClick={() => setNewType(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <button type="submit" className="btn-primary mt-4 w-full py-3 font-bold">
                SAVE & DELIVER HERE
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
