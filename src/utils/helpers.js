// Formatting & Utility Helpers for KuKu Kart

export const formatCurrency = (amount, currency = 'USD') => {
  if (isNaN(amount) || amount === null) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

export const getEstimatedDelivery = (daysToAdd = 2) => {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  }).format(date);
};

export const calculateDiscount = (originalPrice, discountPrice) => {
  if (!originalPrice || !discountPrice || originalPrice <= discountPrice) return 0;
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
};

export const validatePincode = (pincode) => {
  return /^[1-9][0-9]{5}$/.test(pincode.trim());
};

export const INDIAN_CITIES_PINCODES = {
  '110001': { city: 'New Delhi', state: 'Delhi', standardDays: 1, expressDays: 0 },
  '400001': { city: 'Mumbai', state: 'Maharashtra', standardDays: 2, expressDays: 1 },
  '560001': { city: 'Bengaluru', state: 'Karnataka', standardDays: 2, expressDays: 1 },
  '700001': { city: 'Kolkata', state: 'West Bengal', standardDays: 3, expressDays: 1 },
  '600001': { city: 'Chennai', state: 'Tamil Nadu', standardDays: 2, expressDays: 1 },
  '500001': { city: 'Hyderabad', state: 'Telangana', standardDays: 2, expressDays: 1 }
};
