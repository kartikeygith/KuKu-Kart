import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Bell, 
  Tag, 
  ShieldCheck, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X,
  Package,
  Heart,
  Crown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useShop } from '../../context/ShopContext';
import { formatINR } from '../../utils/helpers';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();
  const { 
    addresses, 
    addAddress, 
    deleteAddress, 
    notifications, 
    markAllNotificationsRead, 
    availableCoupons,
    wishlistCount 
  } = useShop();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'addresses' | 'notifications' | 'coupons'

  // Personal Info Edit state
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileSaved, setProfileSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  // Keep fields synchronized when user updates
  React.useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  // Address Modal state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [modalFullName, setModalFullName] = useState(fullName);
  const [modalPhone, setModalPhone] = useState(phone);
  const [modalPincode, setModalPincode] = useState('110001');
  const [modalHouse, setModalHouse] = useState('');
  const [modalStreet, setModalStreet] = useState('');
  const [modalCity, setModalCity] = useState('New Delhi');
  const [modalState, setModalState] = useState('Delhi');
  const [modalType, setModalType] = useState('HOME');

  const [copiedCoupon, setCopiedCoupon] = useState(null);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setProfileMsg('');
    const res = await updateProfile({
      full_name: fullName.trim(),
      phone: phone.trim()
    });
    setSaving(false);
    if (res.success) {
      setProfileSaved(true);
      setProfileMsg('Profile saved successfully in database.');
      setTimeout(() => setProfileSaved(false), 3000);
    } else {
      setProfileMsg('Failed to update: ' + (res.error || 'Unknown error'));
    }
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    addAddress({
      fullName: modalFullName,
      phone: modalPhone,
      pincode: modalPincode,
      houseNo: modalHouse,
      street: modalStreet,
      city: modalCity,
      state: modalState,
      addressType: modalType,
      isDefault: false
    });
    setShowAddressModal(false);
  };

  const copyCouponCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2000);
  };

  if (!user) {
    return (
      <div className="profile-page-container container py-16 text-center">
        <div className="profile-card p-12 border border-border bg-surface max-w-md mx-auto">
          <User size={48} className="mx-auto text-accent mb-4" />
          <h2 className="text-xl font-heading mb-2">Sign In to Your Account</h2>
          <p className="text-xs text-muted mb-6">Please sign in to access your personal profile, saved addresses, and active orders.</p>
          <Link to="/login" className="btn-primary py-3 px-8 font-bold inline-block">
            SIGN IN / REGISTER
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page-container container">
      {/* Header */}
      <div className="profile-header flex justify-between items-end pb-4 border-b border-border mb-8">
        <div>
          <span className="text-xs text-accent tracking-widest uppercase">CLIENT SUITE</span>
          <h1 className="profile-title mt-1 flex items-center gap-3">
            <Crown size={24} color="var(--color-accent)" /> MY ACCOUNT & PRIVILEGES
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="role-chip text-10 uppercase">{user?.role || 'CUSTOMER'}</span>
        </div>
      </div>

      <div className="profile-layout flex gap-8">
        
        {/* Sidebar Nav */}
        <aside className="profile-sidebar p-4 border border-border bg-surface flex-col gap-1">
          <div className="user-brief p-3 border-b border-border mb-3 flex items-center gap-3">
            <div className="user-avatar-circle flex items-center justify-center">
              <User size={20} color="var(--color-accent)" />
            </div>
            <div className="flex-col">
              <strong className="text-white text-xs block">{user?.full_name || 'Valued Client'}</strong>
              <span className="text-10 text-muted">{user?.email}</span>
            </div>
          </div>

          <button 
            className={`profile-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={15} /> Personal Information
          </button>
          
          <button 
            className={`profile-tab-btn ${activeTab === 'addresses' ? 'active' : ''}`}
            onClick={() => setActiveTab('addresses')}
          >
            <MapPin size={15} /> Saved Addresses ({addresses.length})
          </button>

          <button 
            className={`profile-tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => { setActiveTab('notifications'); markAllNotificationsRead(); }}
          >
            <Bell size={15} /> Notifications ({notifications.length})
          </button>

          <button 
            className={`profile-tab-btn ${activeTab === 'coupons' ? 'active' : ''}`}
            onClick={() => setActiveTab('coupons')}
          >
            <Tag size={15} /> Privilege Coupons ({availableCoupons.length})
          </button>

          <Link to="/orders" className="profile-tab-btn">
            <Package size={15} /> Order History & Tracking
          </Link>

          <Link to="/wishlist" className="profile-tab-btn">
            <Heart size={15} /> Private Wishlist ({wishlistCount})
          </Link>

          {user?.role === 'seller' && (
            <Link to="/seller" className="profile-tab-btn text-accent font-bold mt-2 pt-2 border-t border-border">
              <Crown size={15} /> Seller Dashboard
            </Link>
          )}

          {user?.role === 'admin' && (
            <Link to="/admin" className="profile-tab-btn text-accent font-bold mt-2 pt-2 border-t border-border">
              <ShieldCheck size={15} /> Admin Executive Portal
            </Link>
          )}

          {user?.role === 'delivery_partner' && (
            <Link to="/delivery" className="profile-tab-btn text-success font-bold mt-2 pt-2 border-t border-border">
              <Package size={15} /> Delivery Partner Console
            </Link>
          )}

          <button onClick={logout} className="profile-tab-btn text-error mt-4 pt-3 border-t border-border">
            <LogOut size={15} /> Sign Out of Suite
          </button>
        </aside>

        {/* Main Content Pane */}
        <main className="profile-content-pane flex-1">
          
          {/* 1. Personal Information */}
          {activeTab === 'profile' && (
            <div className="profile-card p-6 border border-border bg-surface">
              <h3 className="card-heading text-xs font-heading tracking-widest text-white pb-3 border-b border-border mb-6">
                PERSONAL INFORMATION
              </h3>

              <form onSubmit={handleSaveProfile} className="flex-col gap-4 max-w-lg text-xs">
                <div className="form-group flex-col">
                  <label className="text-accent mb-1">FULL NAME</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>

                <div className="form-group flex-col">
                  <label className="text-accent mb-1">EMAIL ADDRESS (VERIFIED)</label>
                  <input type="email" value={user?.email || ''} disabled className="opacity-60 cursor-not-allowed" />
                </div>

                <div className="form-group flex-col">
                  <label className="text-accent mb-1">MOBILE CONTACT</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>

                {profileMsg && (
                  <p className={`text-xs ${profileSaved ? 'text-success' : 'text-error'} flex items-center gap-1`}>
                    {profileSaved ? <Check size={14} /> : null} {profileMsg}
                  </p>
                )}

                <button type="submit" className="btn-primary py-3 font-bold tracking-wider mt-2 flex items-center justify-center gap-2" disabled={saving}>
                  {saving ? 'UPDATING IN DATABASE...' : (profileSaved ? <><Check size={14} /> CHANGES SAVED</> : 'SAVE PROFILE CHANGES')}
                </button>
              </form>
            </div>
          )}

          {/* 2. Addresses */}
          {activeTab === 'addresses' && (
            <div className="profile-card p-6 border border-border bg-surface">
              <div className="flex justify-between items-center pb-3 border-b border-border mb-6">
                <h3 className="card-heading text-xs font-heading tracking-widest text-white">
                  SAVED DESTINATIONS ({addresses.length})
                </h3>
                <button 
                  onClick={() => setShowAddressModal(true)}
                  className="btn-secondary text-xs flex items-center gap-1"
                >
                  <Plus size={14} /> ADD NEW DESTINATION
                </button>
              </div>

              <div className="addresses-grid grid-2 gap-4">
                {addresses.map(addr => (
                  <div key={addr.id} className="address-card p-4 border border-border bg-bg flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <strong className="text-white text-sm">{addr.fullName}</strong>
                          <span className="type-badge text-10">{addr.addressType}</span>
                        </div>
                        {addr.isDefault && <span className="default-badge text-10">DEFAULT</span>}
                      </div>
                      <p className="text-xs text-muted leading-relaxed">{addr.houseNo}, {addr.street}</p>
                      <span className="text-xs text-white block mt-1">{addr.city}, {addr.state} - <strong>{addr.pincode}</strong></span>
                      <span className="text-xs text-muted block mt-1">Mobile: {addr.phone}</span>
                    </div>

                    <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-border">
                      <button 
                        onClick={() => deleteAddress(addr.id)}
                        className="text-10 text-error flex items-center gap-1 hover:underline"
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Notifications */}
          {activeTab === 'notifications' && (
            <div className="profile-card p-6 border border-border bg-surface">
              <h3 className="card-heading text-xs font-heading tracking-widest text-white pb-3 border-b border-border mb-6">
                NOTIFICATIONS & DISPATCH UPDATES
              </h3>

              <div className="notifications-feed flex-col gap-3">
                {notifications.map(n => (
                  <div key={n.id} className="notification-row p-4 border border-border bg-bg flex justify-between items-center text-xs">
                    <div className="flex items-center gap-3">
                      <Bell size={16} color="var(--color-accent)" />
                      <div className="flex-col">
                        <strong className="text-white">{n.title}</strong>
                        <span className="text-muted mt-1">{n.message}</span>
                      </div>
                    </div>
                    <span className="text-10 text-accent">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Privilege Coupons */}
          {activeTab === 'coupons' && (
            <div className="profile-card p-6 border border-border bg-surface">
              <h3 className="card-heading text-xs font-heading tracking-widest text-white pb-3 border-b border-border mb-6">
                ACTIVE PRIVILEGE COUPONS ({availableCoupons.length})
              </h3>

              <div className="coupons-wallet-grid grid-2 gap-4">
                {availableCoupons.map(c => (
                  <div key={c.code} className="coupon-wallet-card p-4 border border-accent bg-bg flex-col justify-between text-xs">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <strong className="text-accent text-sm font-mono tracking-widest">{c.code}</strong>
                        <span className="text-10 text-success uppercase font-bold">ACTIVE</span>
                      </div>
                      <p className="text-muted leading-relaxed">{c.desc}</p>
                      <span className="text-10 text-white block mt-2">Min. order: {formatINR(c.minOrder)}</span>
                    </div>

                    <button 
                      onClick={() => copyCouponCode(c.code)}
                      className="btn-secondary text-10 py-2 mt-4 w-full flex items-center justify-center gap-2"
                    >
                      {copiedCoupon === c.code ? <><Check size={12} /> CODE COPIED</> : 'COPY PRIVILEGE CODE'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>

      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="modal-overlay flex items-center justify-center">
          <div className="modal-card p-6 bg-surface border border-accent max-w-lg w-full text-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-heading tracking-wider">ADD NEW RESIDENCE</h3>
              <button onClick={() => setShowAddressModal(false)}><X size={18} /></button>
            </div>

            <form onSubmit={handleAddAddress} className="flex-col gap-3">
              <div className="flex gap-3">
                <div className="form-group flex-1 flex-col">
                  <label className="text-accent mb-1">FULL NAME</label>
                  <input type="text" value={modalFullName} onChange={(e) => setModalFullName(e.target.value)} required />
                </div>
                <div className="form-group flex-1 flex-col">
                  <label className="text-accent mb-1">MOBILE NUMBER</label>
                  <input type="tel" value={modalPhone} onChange={(e) => setModalPhone(e.target.value)} required />
                </div>
              </div>

              <div className="flex gap-3">
                <div className="form-group flex-1 flex-col">
                  <label className="text-accent mb-1">PINCODE</label>
                  <input type="text" maxLength="6" value={modalPincode} onChange={(e) => setModalPincode(e.target.value)} required />
                </div>
                <div className="form-group flex-1 flex-col">
                  <label className="text-accent mb-1">CITY</label>
                  <input type="text" value={modalCity} onChange={(e) => setModalCity(e.target.value)} required />
                </div>
              </div>

              <div className="form-group flex-col">
                <label className="text-accent mb-1">HOUSE / SUITE</label>
                <input type="text" value={modalHouse} onChange={(e) => setModalHouse(e.target.value)} placeholder="Floor 18, Horizon Tower" required />
              </div>

              <div className="form-group flex-col">
                <label className="text-accent mb-1">STREET / LOCALITY</label>
                <input type="text" value={modalStreet} onChange={(e) => setModalStreet(e.target.value)} placeholder="Marine Drive" required />
              </div>

              <button type="submit" className="btn-primary mt-4 w-full py-3 font-bold">
                SAVE DESTINATION
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
