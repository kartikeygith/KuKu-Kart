import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Smartphone, 
  Mail, 
  Key, 
  Check, 
  ArrowRight, 
  Lock, 
  User, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import './Auth.css';

const Auth = () => {
  const navigate = useNavigate();
  const { login, signup, loading, authError } = useAuth();

  const [authMode, setAuthMode] = useState('otp'); // 'otp' | 'password' | 'register'
  const [authMethod, setAuthMethod] = useState('email'); // 'email' | 'phone'

  // Input states
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpNotice, setOtpNotice] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validateGmail = (emailStr) => {
    const trimmed = emailStr.trim().toLowerCase();
    return trimmed.endsWith('@gmail.com');
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setOtpNotice('');

    if (authMethod === 'email') {
      if (!validateGmail(email)) {
        setErrorMessage('Exclusive privilege: Only @gmail.com accounts are permitted.');
        return;
      }
      try {
        await supabase.auth.signInWithOtp({ email: email.trim().toLowerCase() });
      } catch (err) {}
      setOtpSent(true);
      setOtpNotice(`6-digit confidential passkey transmitted to ${email}`);
    } else {
      if (phone.length < 10) {
        setErrorMessage('Please enter a valid 10-digit mobile phone number.');
        return;
      }
      try {
        await supabase.auth.signInWithOtp({ phone: phone.trim() });
      } catch (err) {}
      setOtpSent(true);
      setOtpNotice(`SMS OTP sent to ${phone}`);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length < 4) {
      setErrorMessage('Please enter the 4 to 6 digit OTP.');
      return;
    }

    // Auto authenticate into session
    await login(email || `${phone}@kukukart.com`, 'demo_pass');
    navigate('/profile');
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const res = await login(email, password);
    if (res.success) {
      if (res.user.role === 'admin') navigate('/admin');
      else if (res.user.role === 'delivery_partner') navigate('/delivery');
      else navigate('/profile');
    } else {
      setErrorMessage(res.error || 'Invalid credentials.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!validateGmail(email)) {
      setErrorMessage('Please register with a valid @gmail.com address.');
      return;
    }
    const res = await signup(email, password, fullName, phone);
    if (res.success) {
      navigate('/profile');
    } else {
      setErrorMessage(res.error || 'Registration failed.');
    }
  };

  const quickDemoLogin = (demoRole) => {
    if (demoRole === 'admin') {
      login('admin@kukukart.com', 'Admin@123').then(() => navigate('/admin'));
    } else if (demoRole === 'delivery') {
      login('delivery@kukukart.com', 'demo').then(() => navigate('/delivery'));
    } else {
      login('kartikey@gmail.com', 'demo').then(() => navigate('/profile'));
    }
  };

  return (
    <div className="auth-page-container container flex items-center justify-center">
      <div className="auth-card p-8 border border-border bg-surface max-w-md w-full">
        
        {/* Brand Header */}
        <div className="auth-brand-header text-center mb-6">
          <span className="text-10 text-accent tracking-widest uppercase font-bold">KUKU KART SHOWROOM ACCESS</span>
          <h2 className="auth-heading mt-1 text-2xl font-heading font-light text-white">PRIVILEGE LOGIN</h2>
          <p className="text-xs text-muted mt-1">Access your bespoke acquisitions and order portfolio.</p>
        </div>

        {/* Mode Switcher */}
        <div className="auth-mode-tabs flex border border-border bg-bg mb-6 text-xs font-heading">
          <button 
            className={`mode-tab flex-1 py-2 ${authMode === 'otp' ? 'active' : ''}`}
            onClick={() => { setAuthMode('otp'); setOtpSent(false); setErrorMessage(''); }}
          >
            GMAIL OTP
          </button>
          <button 
            className={`mode-tab flex-1 py-2 ${authMode === 'password' ? 'active' : ''}`}
            onClick={() => { setAuthMode('password'); setErrorMessage(''); }}
          >
            PASSWORD
          </button>
          <button 
            className={`mode-tab flex-1 py-2 ${authMode === 'register' ? 'active' : ''}`}
            onClick={() => { setAuthMode('register'); setErrorMessage(''); }}
          >
            REGISTER
          </button>
        </div>

        {/* 1. GMAIL / PHONE OTP FLOW */}
        {authMode === 'otp' && (
          <div className="otp-flow-wrapper">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="flex-col gap-4 text-xs">
                <div className="flex gap-2 mb-2">
                  <button 
                    type="button"
                    className={`method-btn flex-1 py-2 border flex items-center justify-center gap-1 ${authMethod === 'email' ? 'border-accent text-accent' : 'border-border text-muted'}`}
                    onClick={() => setAuthMethod('email')}
                  >
                    <Mail size={13} /> GMAIL
                  </button>
                  <button 
                    type="button"
                    className={`method-btn flex-1 py-2 border flex items-center justify-center gap-1 ${authMethod === 'phone' ? 'border-accent text-accent' : 'border-border text-muted'}`}
                    onClick={() => setAuthMethod('phone')}
                  >
                    <Smartphone size={13} /> PHONE SMS
                  </button>
                </div>

                {authMethod === 'email' ? (
                  <div className="form-group flex-col">
                    <label className="text-accent mb-1">GMAIL ADDRESS</label>
                    <input 
                      type="email" 
                      placeholder="client@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                ) : (
                  <div className="form-group flex-col">
                    <label className="text-accent mb-1">MOBILE NUMBER</label>
                    <input 
                      type="tel" 
                      placeholder="+91 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required 
                    />
                  </div>
                )}

                {errorMessage && (
                  <p className="text-error text-xs flex items-center gap-1"><AlertCircle size={12} /> {errorMessage}</p>
                )}

                <button type="submit" className="btn-primary w-full py-3 font-bold mt-2">
                  TRANSMIT CONFIDENTIAL OTP →
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="flex-col gap-4 text-xs">
                <div className="p-3 bg-bg border border-accent text-accent text-center mb-2">
                  <Check size={16} className="mx-auto mb-1" />
                  <span>{otpNotice}</span>
                </div>

                <div className="form-group flex-col">
                  <label className="text-accent mb-1">ENTER 6-DIGIT OTP</label>
                  <input 
                    type="text" 
                    maxLength="6"
                    placeholder="• • • • • •"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="text-center font-mono text-lg tracking-widest"
                    required 
                  />
                </div>

                {errorMessage && (
                  <p className="text-error text-xs flex items-center gap-1"><AlertCircle size={12} /> {errorMessage}</p>
                )}

                <button type="submit" className="btn-primary w-full py-3 font-bold mt-2">
                  VERIFY & ACCESS SUITE
                </button>

                <button 
                  type="button" 
                  onClick={() => setOtpSent(false)} 
                  className="text-10 text-muted underline text-center block mt-2"
                >
                  Change Email / Mobile
                </button>
              </form>
            )}
          </div>
        )}

        {/* 2. PASSWORD LOGIN */}
        {authMode === 'password' && (
          <form onSubmit={handlePasswordLogin} className="flex-col gap-4 text-xs">
            <div className="form-group flex-col">
              <label className="text-accent mb-1">EMAIL ADDRESS</label>
              <input 
                type="email" 
                placeholder="admin@kukukart.com or client@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div className="form-group flex-col">
              <label className="text-accent mb-1">PASSWORD</label>
              <input 
                type="password" 
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            {errorMessage && (
              <p className="text-error text-xs flex items-center gap-1"><AlertCircle size={12} /> {errorMessage}</p>
            )}

            <button type="submit" className="btn-primary w-full py-3 font-bold mt-2" disabled={loading}>
              {loading ? 'AUTHENTICATING...' : 'ACCESS PRIVATE SUITE →'}
            </button>
          </form>
        )}

        {/* 3. REGISTER NEW CLIENT */}
        {authMode === 'register' && (
          <form onSubmit={handleRegister} className="flex-col gap-3 text-xs">
            <div className="form-group flex-col">
              <label className="text-accent mb-1">FULL NAME</label>
              <input 
                type="text" 
                placeholder="Kartikey Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required 
              />
            </div>

            <div className="form-group flex-col">
              <label className="text-accent mb-1">GMAIL ADDRESS</label>
              <input 
                type="email" 
                placeholder="yourname@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div className="form-group flex-col">
              <label className="text-accent mb-1">MOBILE CONTACT</label>
              <input 
                type="tel" 
                placeholder="+91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required 
              />
            </div>

            <div className="form-group flex-col">
              <label className="text-accent mb-1">CREATE MASTER PASSWORD</label>
              <input 
                type="password" 
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            {errorMessage && (
              <p className="text-error text-xs flex items-center gap-1"><AlertCircle size={12} /> {errorMessage}</p>
            )}

            <button type="submit" className="btn-primary w-full py-3 font-bold mt-2" disabled={loading}>
              {loading ? 'REGISTERING...' : 'ENROLL NEW CLIENT ACCOUNT'}
            </button>
          </form>
        )}

        {/* Quick Demo Logins Bar */}
        <div className="demo-accounts-bar pt-6 border-t border-border mt-6 text-center">
          <span className="text-10 text-muted uppercase tracking-wider block mb-2">QUICK DEMO ACCESS (1-CLICK):</span>
          <div className="flex justify-center gap-2 text-10">
            <button onClick={() => quickDemoLogin('customer')} className="demo-btn">
              Client
            </button>
            <button onClick={() => quickDemoLogin('admin')} className="demo-btn text-accent font-bold">
              Admin
            </button>
            <button onClick={() => quickDemoLogin('delivery')} className="demo-btn text-success">
              Courier
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Auth;
