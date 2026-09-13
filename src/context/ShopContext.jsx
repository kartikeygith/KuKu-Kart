import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS_MASTER, CATEGORIES_DATA, BRANDS_DATA } from '../utils/mockData';
import { supabase } from '../lib/supabaseClient';

const ShopContext = createContext();

const COUPONS_LIST = [
  { code: 'KUKU500', discount: 500, type: 'fixed', minOrder: 1999, desc: 'Flat ₹500 off on orders above ₹1,999' },
  { code: 'LUXURY20', discount: 20, type: 'percent', minOrder: 4999, desc: '20% privilege discount on orders above ₹4,999' },
  { code: 'WELCOME10', discount: 10, type: 'percent', minOrder: 999, desc: '10% welcome privilege for new customers' },
  { code: 'FESTIVE50', discount: 50, type: 'percent', minOrder: 9999, desc: 'Special 50% discount on orders above ₹9,999' }
];

const DEFAULT_ADDRESSES = [
  {
    id: 'addr-1',
    fullName: 'Kartikey Sharma',
    phone: '9876543210',
    altPhone: '9811223344',
    pincode: '110001',
    houseNo: 'Suite 402, Royal Residency',
    street: 'Connaught Place, Barakhamba Road',
    landmark: 'Near Metro Gate 3',
    city: 'New Delhi',
    state: 'Delhi',
    addressType: 'HOME',
    isDefault: true
  },
  {
    id: 'addr-2',
    fullName: 'Kartikey Sharma',
    phone: '9876543210',
    altPhone: '',
    pincode: '400001',
    houseNo: 'Floor 18, Horizon Tower',
    street: 'Nariman Point, Marine Drive',
    landmark: 'Opposite High Court',
    city: 'Mumbai',
    state: 'Maharashtra',
    addressType: 'WORK',
    isDefault: false
  }
];

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Order Dispatched #KUKU-892104',
    message: 'Your Sovereign Chronograph has been handed to our express white-glove courier.',
    time: '10 mins ago',
    type: 'ORDER',
    isRead: false
  },
  {
    id: 'notif-2',
    title: 'Festive Privilege Drop Active',
    message: 'Use code LUXURY20 for exclusive 20% discount on timepieces and couture.',
    time: '2 hours ago',
    type: 'OFFER',
    isRead: false
  }
];

export const ShopProvider = ({ children }) => {
  // Master products list (seeded + cloud added)
  const [products, setProducts] = useState(PRODUCTS_MASTER);

  // Cart
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('kukukart_cart_inr_v2');
      return saved ? JSON.parse(saved) : [
        {
          id: 'a1',
          title: 'The Sovereign Chronograph',
          subtitle: 'Hand-assembled Tourbillon Timepiece',
          price: 24999,
          originalPrice: 32999,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
          quantity: 1,
          size: '42mm Case',
          color: 'Rose Gold / Alligator Strap'
        }
      ];
    } catch (e) {
      return [];
    }
  });

  // Wishlist
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('kukukart_wishlist_inr_v2');
      return saved ? JSON.parse(saved) : [PRODUCTS_MASTER[0], PRODUCTS_MASTER[5]];
    } catch (e) {
      return [];
    }
  });

  // Addresses
  const [addresses, setAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem('kukukart_addresses');
      return saved ? JSON.parse(saved) : DEFAULT_ADDRESSES;
    } catch (e) {
      return DEFAULT_ADDRESSES;
    }
  });
  const [selectedAddressId, setSelectedAddressId] = useState('addr-1');

  // Delivery Location
  const [deliveryPincode, setDeliveryPincode] = useState('110001');
  const [deliveryCity, setDeliveryCity] = useState('New Delhi');

  // Notifications
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);

  // Recently Viewed
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Coupon
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState(null);

  // Theme: 'dark' | 'light'
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('kukukart_theme') || 'dark';
    } catch (e) {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('kukukart_theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Merchant & Courier Pickup Settings (Who picks up orders from seller)
  const [merchantSettings, setMerchantSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('kukukart_merchant_settings');
      return saved ? JSON.parse(saved) : {
        warehouseName: 'KuKu Kart Central Atelier & Fulfillment Hub',
        pickupAddress: 'Plot 42, DLF Phase 4, Galleria Commercial Hub',
        pickupCity: 'Gurugram, Haryana',
        pickupPincode: '122002',
        merchantPhone: '+91 98765 43210',
        pickupSlot: 'Today (2:00 PM - 5:00 PM)',
        defaultCourier: 'Delhivery Express',
        autoSchedulePickup: true
      };
    } catch (e) {
      return {
        warehouseName: 'KuKu Kart Central Atelier & Fulfillment Hub',
        pickupAddress: 'Plot 42, DLF Phase 4, Galleria Commercial Hub',
        pickupCity: 'Gurugram, Haryana',
        pickupPincode: '122002',
        merchantPhone: '+91 98765 43210',
        pickupSlot: 'Today (2:00 PM - 5:00 PM)',
        defaultCourier: 'Delhivery Express',
        autoSchedulePickup: true
      };
    }
  });

  const updateMerchantSettings = (newSettings) => {
    setMerchantSettings(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('kukukart_merchant_settings', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('kukukart_cart_inr_v2', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('kukukart_wishlist_inr_v2', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('kukukart_addresses', JSON.stringify(addresses));
  }, [addresses]);

  // Fetch Supabase products on mount
  useEffect(() => {
    const fetchSupabaseProducts = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (!error && data && data.length > 0) {
          setProducts(prev => {
            const newItems = data.filter(d => !prev.some(p => p.id === d.id));
            return [...newItems, ...prev];
          });
        }
      } catch (e) {}
    };
    fetchSupabaseProducts();
  }, []);

  // Cart Handlers
  const addToCart = (product, size = 'Standard', color = 'Default', quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.size === size && item.color === color);
      if (existing) {
        return prev.map(item => 
          item.id === product.id && item.size === size && item.color === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, {
        id: product.id,
        title: product.title,
        subtitle: product.subtitle || '',
        price: Number(product.price),
        originalPrice: Number(product.originalPrice || product.price),
        image: product.image || product.thumbnail_url,
        quantity: Number(quantity),
        size,
        color
      }];
    });

    addNotification('Item Added to Cart', `${product.title} (${size}) was added to your bag.`, 'CART');
  };

  const removeFromCart = (id, size, color) => {
    setCart(prev => prev.filter(item => !(item.id === id && (size ? item.size === size : true) && (color ? item.color === color : true))));
  };

  const updateCartQty = (id, quantity, size, color) => {
    if (quantity <= 0) {
      removeFromCart(id, size, color);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.id === id && (size ? item.size === size : true) && (color ? item.color === color : true)) {
        return { ...item, quantity: parseInt(quantity) };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  // Wishlist Handlers
  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      } else {
        addNotification('Saved to Wishlist', `${product.title} has been moved to your private collection.`, 'OFFER');
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (id) => wishlist.some(item => item.id === id);

  // Address Handlers
  const addAddress = (newAddr) => {
    const created = { id: 'addr-' + Date.now(), ...newAddr };
    if (created.isDefault) {
      setAddresses(prev => prev.map(a => ({ ...a, isDefault: false })).concat(created));
    } else {
      setAddresses(prev => [...prev, created]);
    }
    setSelectedAddressId(created.id);
  };

  const deleteAddress = (id) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  // Notification Handlers
  const addNotification = (title, message, type = 'SYSTEM') => {
    const notif = {
      id: 'notif-' + Date.now(),
      title,
      message,
      time: 'Just now',
      type,
      isRead: false
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Recently Viewed
  const addToRecentlyViewed = (product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 8);
    });
  };

  // Bill Calculations in INR
  const cartMRP = cart.reduce((sum, item) => sum + ((Number(item.originalPrice) || Number(item.price)) * item.quantity), 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
  const discountOnMRP = Math.max(0, cartMRP - cartSubtotal);

  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'fixed') {
      couponDiscount = appliedCoupon.discount;
    } else if (appliedCoupon.type === 'percent') {
      couponDiscount = Math.round((cartSubtotal * appliedCoupon.discount) / 100);
    }
  }

  // Free delivery on orders above ₹999
  const deliveryFee = cartSubtotal >= 999 || cartSubtotal === 0 ? 0 : 99;
  const platformFee = 0; // 100% Free
  const cartTotal = Math.max(0, cartSubtotal - couponDiscount + deliveryFee + platformFee);

  // Coupon Handlers
  const applyCoupon = (code) => {
    setCouponError(null);
    const found = COUPONS_LIST.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!found) {
      setCouponError('Invalid coupon code.');
      return false;
    }
    if (cartSubtotal < found.minOrder) {
      setCouponError(`Minimum order of ₹${found.minOrder.toLocaleString('en-IN')} required for code ${found.code}.`);
      return false;
    }
    setAppliedCoupon(found);
    addNotification('Coupon Applied', `Privilege code ${found.code} applied successfully!`, 'OFFER');
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const selectedAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];

  return (
    <ShopContext.Provider value={{
      products,
      categories: CATEGORIES_DATA,
      brands: BRANDS_DATA,
      cart,
      wishlist,
      cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
      wishlistCount: wishlist.length,
      cartMRP,
      cartSubtotal,
      discountOnMRP,
      couponDiscount,
      discountAmount: couponDiscount,
      theme,
      setTheme,
      toggleTheme,
      merchantSettings,
      updateMerchantSettings,
      deliveryFee,
      platformFee,
      cartTotal,
      appliedCoupon,
      couponError,
      availableCoupons: COUPONS_LIST,
      addresses,
      selectedAddress,
      selectedAddressId,
      setSelectedAddressId,
      addAddress,
      deleteAddress,
      deliveryPincode,
      deliveryCity,
      setDeliveryPincode,
      setDeliveryCity,
      notifications,
      unreadNotifCount: notifications.filter(n => !n.isRead).length,
      markAllNotificationsRead,
      recentlyViewed,
      addToRecentlyViewed,
      addToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
      toggleWishlist,
      isInWishlist,
      applyCoupon,
      removeCoupon
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
