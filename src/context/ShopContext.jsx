import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_PRODUCTS } from '../components/ProductList';

const ShopContext = createContext();

const COUPONS = [
  { code: 'KUKU500', discount: 500, type: 'fixed', minOrder: 2000, desc: 'Flat $500 off on luxury orders' },
  { code: 'LUXURY20', discount: 20, type: 'percent', minOrder: 5000, desc: '20% off on premium collections' },
  { code: 'FIRSTBUY', discount: 10, type: 'percent', minOrder: 1000, desc: '10% off on your first acquisition' },
];

export const ShopProvider = ({ children }) => {
  // Cart state initialized from localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('kukukart_cart');
      return saved ? JSON.parse(saved) : [
        {
          id: '1',
          title: 'THE CHRONOGRAPH',
          subtitle: 'Limited Edition Timepiece',
          price: 12500.00,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
          quantity: 1,
          size: 'M',
          color: 'Obsidian Black'
        }
      ];
    } catch (e) {
      return [];
    }
  });

  // Wishlist state initialized from localStorage
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('kukukart_wishlist');
      return saved ? JSON.parse(saved) : [MOCK_PRODUCTS[0], MOCK_PRODUCTS[1]];
    } catch (e) {
      return [];
    }
  });

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState(null);

  // Delivery Pincode
  const [pincode, setPincode] = useState('110001');

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('kukukart_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('kukukart_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  // Cart actions
  const addToCart = (product, size = 'Standard', color = 'Default', quantity = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id && item.size === size && item.color === color);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, {
          id: product.id,
          title: product.title,
          subtitle: product.subtitle || '',
          price: product.price,
          image: product.image,
          quantity,
          size,
          color
        }];
      }
    });
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

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist actions
  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (id) => {
    return wishlist.some(item => item.id === id);
  };

  // Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'fixed') {
      discountAmount = appliedCoupon.discount;
    } else if (appliedCoupon.type === 'percent') {
      discountAmount = (cartSubtotal * appliedCoupon.discount) / 100;
    }
  }

  const cartTotal = Math.max(0, cartSubtotal - discountAmount);

  // Coupon handling
  const applyCoupon = (code) => {
    setCouponError(null);
    const found = COUPONS.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!found) {
      setCouponError('Invalid coupon code.');
      return false;
    }
    if (cartSubtotal < found.minOrder) {
      setCouponError(`Minimum order of $${found.minOrder} required for coupon ${found.code}.`);
      return false;
    }
    setAppliedCoupon(found);
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  return (
    <ShopContext.Provider value={{
      cart,
      wishlist,
      cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
      wishlistCount: wishlist.length,
      cartSubtotal,
      discountAmount,
      cartTotal,
      appliedCoupon,
      couponError,
      availableCoupons: COUPONS,
      pincode,
      setPincode,
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
