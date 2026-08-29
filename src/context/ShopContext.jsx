import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS_MASTER, CATEGORIES_DATA, BRANDS_DATA } from '../utils/mockData';
import { supabase } from '../lib/supabaseClient';

const ShopContext = createContext();

const COUPONS_LIST = [
  { code: 'KUKU500', discount: 500, type: 'fixed', minOrder: 2000, desc: 'Flat $500 off on luxury acquisitions' },
  { code: 'LUXURY20', discount: 20, type: 'percent', minOrder: 5000, desc: '20% off on complete catalog' },
  { code: 'FIRSTBUY', discount: 10, type: 'percent', minOrder: 1000, desc: '10% welcome privilege for new clients' },
  { code: 'FASHION50', discount: 50, type: 'fixed', minOrder: 300, desc: 'Flat $50 off on apparel and footwear' }
];

const DEFAULT_ADDRESSES = [
  {
    id: 'addr-1',
    fullName: 'Kartikey Sharma',
    phone: '+91 9876543210',
    pincode: '110001',
    houseNo: 'Suite 402, Royal Residency',
    street: 'Connaught Place, Barakhamba Road',
    city: 'New Delhi',
    state: 'Delhi',
    addressType: 'HOME',
    isDefault: true
  },
  {
    id: 'addr-2',
    fullName: 'Kartikey Sharma',
    phone: '+91 9876543210',
    pincode: '400001',
    houseNo: 'Floor 18, Horizon Tower',
    street: 'Nariman Point, Marine Drive',
    city: 'Mumbai',
    state: 'Maharashtra',
    addressType: 'WORK',
    isDefault: false
  }
];

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Order Dispatched #KK-98231',
    message: 'Your Sovereign Chronograph has been handed to our white-glove courier.',
    time: '10 mins ago',
    type: 'ORDER',
    isRead: false
  },
  {
    id: 'notif-2',
    title: 'Private Autumn Privilege Drop',
    message: 'Use code LUXURY20 for exclusive 20% privilege on timepieces.',
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
      const saved = localStorage.getItem('kukukart_cart');
      return saved ? JSON.parse(saved) : [
        {
          id: 'a1',
          title: 'The Sovereign Chronograph',
          subtitle: 'Hand-assembled Tourbillon Timepiece',
          price: 12500.00,
          originalPrice: 15000.00,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
          quantity: 1,
          size: '42mm Case',
          color: 'Rose Gold'
        }
      ];
    } catch (e) {
      return [];
    }
  });

  // Wishlist
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('kukukart_wishlist');
      return saved ? JSON.parse(saved) : [PRODUCTS_MASTER[0], PRODUCTS_MASTER[4]];
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

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('kukukart_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('kukukart_wishlist', JSON.stringify(wishlist));
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
        price: product.price,
        originalPrice: product.originalPrice || product.price,
        image: product.image || product.thumbnail_url,
        quantity,
        size,
        color
      }];
    });

    // Add toast notification
    addNotification('Item Added to Cart', `${product.title} (${size}) was added to your selection.`, 'CART');
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

  // Bill Calculations
  const cartMRP = cart.reduce((sum, item) => sum + ((item.originalPrice || item.price) * item.quantity), 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountOnMRP = Math.max(0, cartMRP - cartSubtotal);

  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'fixed') {
      couponDiscount = appliedCoupon.discount;
    } else if (appliedCoupon.type === 'percent') {
      couponDiscount = (cartSubtotal * appliedCoupon.discount) / 100;
    }
  }

  const deliveryFee = cartSubtotal > 1000 ? 0 : 0; // Complimentary express delivery
  const platformFee = 0;
  const cartTotal = Math.max(0, cartSubtotal - couponDiscount + deliveryFee + platformFee);

  // Coupon Handlers
  const applyCoupon = (code) => {
    setCouponError(null);
    const found = COUPONS_LIST.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!found) {
      setCouponError('Invalid privilege coupon code.');
      return false;
    }
    if (cartSubtotal < found.minOrder) {
      setCouponError(`Minimum order of $${found.minOrder} required for code ${found.code}.`);
      return false;
    }
    setAppliedCoupon(found);
    addNotification('Privilege Applied', `Coupon ${found.code} applied successfully!`, 'OFFER');
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
