import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('kukukart_user');
      return saved ? JSON.parse(saved) : {
        id: 'usr_kartikey',
        email: 'kartikey@gmail.com',
        full_name: 'Kartikey Sharma',
        phone: '+91 9876543210',
        role: 'admin', // default to admin for full dashboard privileges
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80'
      };
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('kukukart_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('kukukart_user');
    }
  }, [user]);

  // Login
  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      if (email === 'admin@kukukart.com' && password === 'Admin@123') {
        const adminUser = {
          id: 'admin_master',
          email,
          full_name: 'KuKu Master Admin',
          role: 'admin',
          phone: '+91 9999988888'
        };
        setUser(adminUser);
        return { success: true, user: adminUser };
      }

      if (email === 'delivery@kukukart.com') {
        const partnerUser = {
          id: 'del_partner_1',
          email,
          full_name: 'Vikram Delivery Executive',
          role: 'delivery_partner',
          phone: '+91 9811223344'
        };
        setUser(partnerUser);
        return { success: true, user: partnerUser };
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const loggedUser = {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.user_metadata?.full_name || email.split('@')[0],
        role: data.user.user_metadata?.role || (email.includes('admin') ? 'admin' : 'customer'),
        phone: data.user.user_metadata?.phone || ''
      };
      setUser(loggedUser);
      return { success: true, user: loggedUser };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Register
  const signup = async (email, password, full_name, phone) => {
    setLoading(true);
    setAuthError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name, phone, role: 'customer' }
        }
      });
      if (error) throw error;

      const newUser = {
        id: data.user?.id || 'usr_' + Date.now(),
        email,
        full_name,
        phone,
        role: 'customer'
      };
      setUser(newUser);
      return { success: true, user: newUser };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Switch Role (For effortless testing in demo)
  const switchRole = (newRole) => {
    if (user) {
      const updated = { ...user, role: newRole };
      setUser(updated);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      isDeliveryPartner: user?.role === 'delivery_partner',
      loading,
      authError,
      login,
      signup,
      logout,
      switchRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
