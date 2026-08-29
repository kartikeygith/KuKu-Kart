import { supabase } from '../lib/supabaseClient';
import { PRODUCTS_MASTER, CATEGORIES_DATA, BRANDS_DATA } from '../utils/mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Unified Service Layer: Fetches from Supabase DB or seamlessly falls back to master seeded catalog
export const api = {
  // Products
  getProducts: async (filters = {}) => {
    try {
      let query = supabase.from('products').select('*');
      if (filters.category && filters.category !== 'All') {
        query = query.eq('category', filters.category);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        // Merge Supabase products with seeded master catalog
        const combined = [...data, ...PRODUCTS_MASTER.filter(p => !data.some(d => d.id === p.id))];
        return combined;
      }
    } catch (e) {
      console.log('Supabase products fallback:', e.message);
    }
    return PRODUCTS_MASTER;
  },

  getProductById: async (id) => {
    try {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (!error && data) return data;
    } catch (e) {}
    return PRODUCTS_MASTER.find(p => p.id === id) || PRODUCTS_MASTER[0];
  },

  getCategories: () => CATEGORIES_DATA,
  getBrands: () => BRANDS_DATA,

  // Orders
  createOrder: async (orderData) => {
    try {
      const { data, error } = await supabase.from('orders').insert([orderData]).select().single();
      if (!error && data) return data;
    } catch (e) {}
    return {
      id: 'KK-' + Math.floor(100000 + Math.random() * 900000),
      ...orderData,
      created_at: new Date().toISOString()
    };
  },

  getMyOrders: async () => {
    try {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch (e) {}
    return null;
  }
};
