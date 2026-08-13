import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, ShieldCheck, CheckCircle, AlertCircle } from 'lucide-react';
import './Auth.css';

const Auth = () => {
  const [authMethod, setAuthMethod] = useState('email'); // default to email per user request
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('request'); // 'request' | 'verify'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  // Validate Gmail
  const isGmailValid = email.trim().toLowerCase().endsWith('@gmail.com');

  // Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (authMethod === 'email' && !isGmailValid) {
      setMessage({ type: 'error', text: 'Only valid @gmail.com addresses are accepted for registration/login.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      if (authMethod === 'phone') {
        const formattedPhone = phone.startsWith('+') ? phone : `+${phone.replace(/\D/g, '')}`;
        const { error } = await supabase.auth.signInWithOtp({ phone: formattedPhone });
        if (error) throw error;
        setMessage({ type: 'success', text: `OTP sent to ${formattedPhone}` });
      } else {
        const { error } = await supabase.auth.signInWithOtp({ email: email.trim().toLowerCase() });
        if (error) throw error;
        setMessage({ type: 'success', text: `Verification OTP sent to ${email}` });
      }
      setStep('verify');
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      let result;
      if (authMethod === 'phone') {
        const formattedPhone = phone.startsWith('+') ? phone : `+${phone.replace(/\D/g, '')}`;
        result = await supabase.auth.verifyOtp({
          phone: formattedPhone,
          token: otp,
          type: 'sms'
        });
      } else {
        result = await supabase.auth.verifyOtp({
          email: email.trim().toLowerCase(),
          token: otp,
          type: 'email'
        });
      }

      if (result.error) throw result.error;
      setMessage({ type: 'success', text: 'Verification successful! Access granted.' });
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Invalid or expired OTP code.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page container flex items-center justify-center">
      <div className="auth-card">
        <h2 className="text-center">CLIENT VERIFICATION</h2>
        <p className="subtitle text-center">Instant passwordless access via Gmail OTP or Phone SMS.</p>

        {/* Method Toggle */}
        {step === 'request' && (
          <div className="method-toggle flex justify-center gap-4 mt-6">
            <button 
              className={`method-btn flex items-center gap-2 ${authMethod === 'email' ? 'active' : ''}`}
              onClick={() => { setAuthMethod('email'); setMessage(null); }}
            >
              <Mail size={16} /> GMAIL OTP
            </button>
            <button 
              className={`method-btn flex items-center gap-2 ${authMethod === 'phone' ? 'active' : ''}`}
              onClick={() => { setAuthMethod('phone'); setMessage(null); }}
            >
              <Phone size={16} /> PHONE SMS
            </button>
          </div>
        )}

        {message && (
          <div className={`auth-message ${message.type} mt-4`}>
            {message.text}
          </div>
        )}

        {step === 'request' ? (
          /* Step 1: Request OTP */
          <form onSubmit={handleSendOtp} className="auth-form flex-col gap-4 mt-6">
            {authMethod === 'email' ? (
              <div className="form-group flex-col">
                <label>GMAIL ADDRESS ONLY (@gmail.com)</label>
                <div className="input-with-validation">
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => { setEmail(e.target.value); setMessage(null); }} 
                    placeholder="example@gmail.com"
                    required 
                  />
                  {email.length > 5 && (
                    <span className="validation-icon">
                      {isGmailValid ? (
                        <CheckCircle size={18} color="#00c851" />
                      ) : (
                        <AlertCircle size={18} color="#ff4444" />
                      )}
                    </span>
                  )}
                </div>
                {!isGmailValid && email.length > 5 && (
                  <span className="error-hint">Must end with @gmail.com</span>
                )}
              </div>
            ) : (
              <div className="form-group flex-col">
                <label>MOBILE PHONE NUMBER (WITH COUNTRY CODE)</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="+1 234 567 8900 or +91..."
                  required 
                />
                <span className="hint-text">Format: +[CountryCode][MobileNumber]</span>
              </div>
            )}

            {/* Only show/enable Send OTP if validation passes */}
            {authMethod === 'email' ? (
              isGmailValid ? (
                <button type="submit" className="btn-primary mt-4" disabled={loading}>
                  {loading ? 'SENDING OTP...' : 'SEND GMAIL OTP'}
                </button>
              ) : (
                <div className="disabled-notice mt-4 text-center">
                  Please enter a valid @gmail.com address to request OTP
                </div>
              )
            ) : (
              <button type="submit" className="btn-primary mt-4" disabled={loading}>
                {loading ? 'SENDING OTP...' : 'REQUEST SMS OTP'}
              </button>
            )}
          </form>
        ) : (
          /* Step 2: Verify OTP */
          <form onSubmit={handleVerifyOtp} className="auth-form flex-col gap-4 mt-6">
            <div className="form-group flex-col">
              <label className="flex items-center gap-2">
                <ShieldCheck size={16} color="var(--color-accent)" /> ENTER 6-DIGIT OTP CODE
              </label>
              <input 
                type="text" 
                maxLength="6"
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                placeholder="123456"
                className="otp-input"
                required 
              />
            </div>

            <button type="submit" className="btn-primary mt-4" disabled={loading}>
              {loading ? 'VERIFYING...' : 'VERIFY & ACCESS'}
            </button>

            <button 
              type="button" 
              className="toggle-btn mt-2" 
              onClick={() => { setStep('request'); setOtp(''); setMessage(null); }}
            >
              ← Change {authMethod === 'phone' ? 'Phone Number' : 'Gmail'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
