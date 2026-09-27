import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('kukukart_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Sync profile data from Supabase profiles table
  const syncUserProfile = async (authUser) => {
    if (!authUser) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (!error && data) {
        const syncedUser = {
          id: authUser.id,
          email: authUser.email,
          full_name: data.full_name || authUser.user_metadata?.full_name || authUser.email.split('@')[0],
          phone: data.phone || authUser.user_metadata?.phone || '',
          role: data.role || authUser.user_metadata?.role || (authUser.email.includes('admin') ? 'admin' : 'customer'),
          avatar_url: data.avatar_url || authUser.user_metadata?.avatar_url || ''
        };
        setUser(syncedUser);
        return syncedUser;
      } else {
        // If profile doesn't exist yet, insert it
        const role = authUser.user_metadata?.role || (authUser.email.includes('admin') ? 'admin' : 'customer');
        const newProfile = {
          id: authUser.id,
          email: authUser.email,
          full_name: authUser.user_metadata?.full_name || authUser.email.split('@')[0],
          phone: authUser.user_metadata?.phone || '',
          role
        };
        try {
          await supabase.from('profiles').upsert([newProfile]);
        } catch (e) {}
        setUser(newProfile);
        return newProfile;
      }
    } catch (e) {
      const fallbackUser = {
        id: authUser.id,
        email: authUser.email,
        full_name: authUser.user_metadata?.full_name || authUser.email.split('@')[0],
        phone: authUser.user_metadata?.phone || '',
        role: authUser.user_metadata?.role || 'customer'
      };
      setUser(fallbackUser);
      return fallbackUser;
    }
  };

  // Sync session on mount and listen to auth state changes
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted && session?.user) {
          await syncUserProfile(session.user);
        }
      } catch (err) {
        console.warn('Auth session check fallback', err);
      }
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      if (session?.user) {
        await syncUserProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Sync to localStorage
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
      // Direct Admin & Courier credentials fallback
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

      const synced = await syncUserProfile(data.user);
      return { success: true, user: synced || user };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Register
  const signup = async (email, password, full_name, phone, role = 'customer') => {
    setLoading(true);
    setAuthError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name, phone, role }
        }
      });
      if (error) throw error;

      const newUser = {
        id: data.user?.id || 'usr_' + Date.now(),
        email,
        full_name,
        phone,
        role
      };

      try {
        if (data.user?.id) {
          await supabase.from('profiles').upsert([{
            id: data.user.id,
            email,
            full_name,
            phone,
            role
          }]);
        }
      } catch (e) {}

      setUser(newUser);
      return { success: true, user: newUser };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Update Profile (Persists to Supabase profiles table)
  const updateProfile = async (updates) => {
    if (!user) return { success: false, error: 'No active user session' };
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert([{
          id: user.id,
          email: user.email,
          full_name: updates.full_name,
          phone: updates.phone,
          ...(updates.avatar_url ? { avatar_url: updates.avatar_url } : {}),
          updated_at: new Date().toISOString()
        }]);

      if (error) {
        console.warn('Supabase profile update warning:', error);
      }

      try {
        await supabase.auth.updateUser({
          data: {
            full_name: updates.full_name,
            phone: updates.phone
          }
        });
      } catch (e) {}

      const updated = { ...user, ...updates };
      setUser(updated);
      return { success: true, user: updated };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Switch Role (For internal administrative simulation)
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
    localStorage.removeItem('kukukart_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      isSeller: user?.role === 'seller',
      isCustomer: !user || user?.role === 'customer',
      isDeliveryPartner: user?.role === 'delivery_partner',
      loading,
      authError,
      login,
      signup,
      updateProfile,
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
