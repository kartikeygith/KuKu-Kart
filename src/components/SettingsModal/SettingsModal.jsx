import React, { useState } from 'react';
import { 
  X, Moon, Sun, MapPin, Truck, Bell, Check, 
  Building2, ShieldCheck, Sparkles 
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { INDIAN_CITIES_PINCODES } from '../../utils/helpers';
import './SettingsModal.css';

const SettingsModal = ({ isOpen, onClose }) => {
  const { 
    theme, 
    setTheme, 
    deliveryPincode, 
    deliveryCity, 
    setDeliveryPincode, 
    setDeliveryCity,
    merchantSettings,
    updateMerchantSettings
  } = useShop();

  const [activeTab, setActiveTab] = useState('appearance'); // 'appearance' | 'delivery' | 'merchant' | 'notifications'
  
  // Local states for merchant pickup settings
  const [warehouseName, setWarehouseName] = useState(merchantSettings.warehouseName);
  const [pickupAddress, setPickupAddress] = useState(merchantSettings.pickupAddress);
  const [pickupCity, setPickupCity] = useState(merchantSettings.pickupCity);
  const [pickupPincode, setPickupPincode] = useState(merchantSettings.pickupPincode);
  const [merchantPhone, setMerchantPhone] = useState(merchantSettings.merchantPhone);
  const [pickupSlot, setPickupSlot] = useState(merchantSettings.pickupSlot);
  const [defaultCourier, setDefaultCourier] = useState(merchantSettings.defaultCourier);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Local state for delivery pincode
  const [pincodeVal, setPincodeVal] = useState(deliveryPincode);
  const [cityVal, setCityVal] = useState(deliveryCity);

  if (!isOpen) return null;

  const handleSaveMerchant = (e) => {
    e.preventDefault();
    updateMerchantSettings({
      warehouseName,
      pickupAddress,
      pickupCity,
      pickupPincode,
      merchantPhone,
      pickupSlot,
      defaultCourier
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleApplyPincode = (cityObj) => {
    setPincodeVal(cityObj.pincode);
    setCityVal(cityObj.city);
    setDeliveryPincode(cityObj.pincode);
    setDeliveryCity(cityObj.city);
  };

  return (
    <div className="settings-modal-overlay">
      <div className="settings-modal-backdrop" onClick={onClose} />
      <div className="settings-modal-card">
        {/* Header */}
        <div className="settings-header flex justify-between items-center pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Sparkles size={18} color="var(--color-accent)" />
            <h2 className="settings-title">STORE & CLIENT SETTINGS</h2>
          </div>
          <button onClick={onClose} className="settings-close-btn" title="Close Settings">
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="settings-tabs flex border-b border-border">
          <button 
            type="button"
            className={`settings-tab-btn ${activeTab === 'appearance' ? 'active' : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            <Sun size={14} /> Theme & Display
          </button>
          <button 
            type="button"
            className={`settings-tab-btn ${activeTab === 'delivery' ? 'active' : ''}`}
            onClick={() => setActiveTab('delivery')}
          >
            <MapPin size={14} /> Customer Location
          </button>
          <button 
            type="button"
            className={`settings-tab-btn ${activeTab === 'merchant' ? 'active' : ''}`}
            onClick={() => setActiveTab('merchant')}
          >
            <Truck size={14} /> Seller Courier Pickup
          </button>
          <button 
            type="button"
            className={`settings-tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={14} /> Notifications
          </button>
        </div>

        {/* Tab Content */}
        <div className="settings-body">
          
          {/* 1. APPEARANCE TAB */}
          {activeTab === 'appearance' && (
            <div className="settings-section flex-col gap-4">
              <div>
                <h3 className="settings-subtitle">WEBSITE THEME</h3>
                <p className="settings-desc">Choose between high-contrast luxury dark or crisp ivory light mode.</p>
              </div>

              <div className="theme-options-grid">
                {/* Dark Theme Card */}
                <div 
                  className={`theme-card ${theme === 'dark' ? 'selected' : ''}`}
                  onClick={() => setTheme('dark')}
                >
                  <div className="theme-preview dark-preview">
                    <div className="preview-nav"></div>
                    <div className="preview-body">
                      <div className="preview-badge"></div>
                      <div className="preview-bar"></div>
                    </div>
                  </div>
                  <div className="theme-meta flex items-center justify-between mt-2">
                    <span className="flex items-center gap-2 font-bold text-xs">
                      <Moon size={15} color="#c6a87c" /> Bugatti Dark Luxury
                    </span>
                    {theme === 'dark' && <Check size={16} color="var(--color-accent)" />}
                  </div>
                </div>

                {/* Light Theme Card */}
                <div 
                  className={`theme-card ${theme === 'light' ? 'selected' : ''}`}
                  onClick={() => setTheme('light')}
                >
                  <div className="theme-preview light-preview">
                    <div className="preview-nav"></div>
                    <div className="preview-body">
                      <div className="preview-badge"></div>
                      <div className="preview-bar"></div>
                    </div>
                  </div>
                  <div className="theme-meta flex items-center justify-between mt-2">
                    <span className="flex items-center gap-2 font-bold text-xs">
                      <Sun size={15} color="#a57c38" /> Atelier Ivory Light
                    </span>
                    {theme === 'light' && <Check size={16} color="var(--color-accent)" />}
                  </div>
                </div>
              </div>

              {/* Currency Display Info */}
              <div className="settings-item p-3 border border-border bg-surface rounded mt-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold text-white">Default Store Currency</h4>
                    <p className="text-10 text-muted">Fixed to Indian Rupees for all product listings and billing.</p>
                  </div>
                  <span className="currency-pill font-bold">₹ INR (Indian Rupee)</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. CUSTOMER LOCATION TAB */}
          {activeTab === 'delivery' && (
            <div className="settings-section flex-col gap-4">
              <div>
                <h3 className="settings-subtitle">DEFAULT DELIVERY LOCATION</h3>
                <p className="settings-desc">Sets default postal code for instant delivery dates and shipping estimates.</p>
              </div>

              <div className="flex gap-2">
                <input 
                  type="text" 
                  maxLength={6}
                  value={pincodeVal}
                  onChange={(e) => setPincodeVal(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit PIN"
                  className="p-2 border border-border bg-bg text-white text-xs rounded w-40"
                />
                <button 
                  type="button" 
                  onClick={() => {
                    if (pincodeVal.length === 6) {
                      setDeliveryPincode(pincodeVal);
                      const match = INDIAN_CITIES_PINCODES.find(c => c.pincode === pincodeVal);
                      if (match) {
                        setDeliveryCity(match.city);
                        setCityVal(match.city);
                      }
                      setSaveSuccess(true);
                      setTimeout(() => setSaveSuccess(false), 2000);
                    }
                  }}
                  className="btn-primary text-xs py-2 px-4"
                >
                  Save PIN
                </button>
              </div>

              <div className="mt-2">
                <span className="text-10 text-muted block mb-2 uppercase font-bold">Quick Select Major Hub:</span>
                <div className="city-pill-grid">
                  {INDIAN_CITIES_PINCODES.map(item => (
                    <button
                      key={item.pincode}
                      type="button"
                      onClick={() => handleApplyPincode(item)}
                      className={`city-pill ${deliveryPincode === item.pincode ? 'active' : ''}`}
                    >
                      {item.city} ({item.pincode})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. SELLER COURIER PICKUP TAB */}
          {activeTab === 'merchant' && (
            <form onSubmit={handleSaveMerchant} className="settings-section flex-col gap-3">
              <div>
                <h3 className="settings-subtitle flex items-center gap-2">
                  <Building2 size={16} color="var(--color-accent)" /> SELLER PICKUP WAREHOUSE ADDRESS
                </h3>
                <p className="settings-desc">
                  This is the exact address where the delivery executive (Delhivery, Blue Dart, DTDC) arrives to collect packed products.
                </p>
              </div>

              <div className="form-group flex-col">
                <label className="text-10 text-accent font-bold uppercase mb-1">Warehouse / Shop Name *</label>
                <input 
                  type="text" 
                  value={warehouseName}
                  onChange={(e) => setWarehouseName(e.target.value)}
                  required
                  className="p-2 border border-border bg-bg text-white text-xs rounded"
                />
              </div>

              <div className="form-group flex-col">
                <label className="text-10 text-accent font-bold uppercase mb-1">Pickup Doorstep Address *</label>
                <textarea 
                  rows={2}
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  required
                  className="p-2 border border-border bg-bg text-white text-xs rounded"
                />
              </div>

              <div className="grid-2-col">
                <div className="form-group flex-col">
                  <label className="text-10 text-accent font-bold uppercase mb-1">City & State *</label>
                  <input 
                    type="text" 
                    value={pickupCity}
                    onChange={(e) => setPickupCity(e.target.value)}
                    required
                    className="p-2 border border-border bg-bg text-white text-xs rounded"
                  />
                </div>
                <div className="form-group flex-col">
                  <label className="text-10 text-accent font-bold uppercase mb-1">Pickup PIN Code *</label>
                  <input 
                    type="text" 
                    maxLength={6}
                    value={pickupPincode}
                    onChange={(e) => setPickupPincode(e.target.value.replace(/\D/g, ''))}
                    required
                    className="p-2 border border-border bg-bg text-white text-xs rounded"
                  />
                </div>
              </div>

              <div className="grid-2-col">
                <div className="form-group flex-col">
                  <label className="text-10 text-accent font-bold uppercase mb-1">Seller Mobile (For Driver Call) *</label>
                  <input 
                    type="tel" 
                    value={merchantPhone}
                    onChange={(e) => setMerchantPhone(e.target.value)}
                    required
                    className="p-2 border border-border bg-bg text-white text-xs rounded"
                  />
                </div>
                <div className="form-group flex-col">
                  <label className="text-10 text-accent font-bold uppercase mb-1">Preferred Pickup Window *</label>
                  <select 
                    value={pickupSlot}
                    onChange={(e) => setPickupSlot(e.target.value)}
                    className="p-2 border border-border bg-bg text-white text-xs rounded"
                  >
                    <option value="Morning (10:00 AM - 1:00 PM)">Morning (10:00 AM - 1:00 PM)</option>
                    <option value="Afternoon (2:00 PM - 5:00 PM)">Afternoon (2:00 PM - 5:00 PM)</option>
                    <option value="Evening (5:00 PM - 8:00 PM)">Evening (5:00 PM - 8:00 PM)</option>
                  </select>
                </div>
              </div>

              <div className="form-group flex-col">
                <label className="text-10 text-accent font-bold uppercase mb-1">Primary Integrated Courier Partner</label>
                <select 
                  value={defaultCourier}
                  onChange={(e) => setDefaultCourier(e.target.value)}
                  className="p-2 border border-border bg-bg text-white text-xs rounded"
                >
                  <option value="Delhivery Express">Delhivery Express (Doorstep Pickup)</option>
                  <option value="Blue Dart Apex">Blue Dart Apex (Air Priority)</option>
                  <option value="DTDC Prime">DTDC Prime Express</option>
                  <option value="Shiprocket Direct">Shiprocket Multi-Carrier API</option>
                  <option value="Shadowfax Courier">Shadowfax Hyperlocal & Air</option>
                </select>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button type="submit" className="btn-primary text-xs py-2 px-6 flex items-center gap-2">
                  <ShieldCheck size={14} /> Save Pickup Settings
                </button>
                {saveSuccess && <span className="text-xs text-success font-bold flex items-center gap-1"><Check size={14} /> Saved Successfully!</span>}
              </div>
            </form>
          )}

          {/* 4. NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="settings-section flex-col gap-4">
              <div>
                <h3 className="settings-subtitle">COMMUNICATION PREFERENCES</h3>
                <p className="settings-desc">Select which alerts and operational updates you wish to receive.</p>
              </div>

              <div className="notif-toggle-list flex-col gap-2">
                <label className="notif-toggle-row flex justify-between items-center p-3 border border-border bg-surface rounded">
                  <div>
                    <strong className="text-xs text-white block">Order & Courier Dispatch Updates</strong>
                    <span className="text-10 text-muted">Real-time alerts when packages are picked up and out for delivery.</span>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle-checkbox" />
                </label>

                <label className="notif-toggle-row flex justify-between items-center p-3 border border-border bg-surface rounded">
                  <div>
                    <strong className="text-xs text-white block">Courier Arrival SMS & Call Alert</strong>
                    <span className="text-10 text-muted">Receive a driver call & SMS 30 mins before pickup at your doorstep.</span>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle-checkbox" />
                </label>

                <label className="notif-toggle-row flex justify-between items-center p-3 border border-border bg-surface rounded">
                  <div>
                    <strong className="text-xs text-white block">VIP Drops & Seasonal Privileges</strong>
                    <span className="text-10 text-muted">Early access to limited luxury collections and seasonal vouchers.</span>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle-checkbox" />
                </label>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
