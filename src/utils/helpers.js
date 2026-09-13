// Formatting & Utility Helpers for KuKu Kart (Indian Market & INR)

export const formatCurrency = (amount, currency = 'INR') => {
  if (isNaN(amount) || amount === null) return '₹0';
  const num = Math.round(Number(amount));
  return '₹' + num.toLocaleString('en-IN');
};

export const formatINR = (amount) => {
  if (isNaN(amount) || amount === null) return '₹0';
  const num = Math.round(Number(amount));
  return '₹' + num.toLocaleString('en-IN');
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

export const getEstimatedDelivery = (daysToAdd = 2) => {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  return new Intl.DateTimeFormat('en-IN', {
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
  return /^[1-9][0-9]{5}$/.test(String(pincode).trim());
};

export const validateIndianMobile = (mobile) => {
  const cleaned = String(mobile).replace(/\D/g, '');
  // 10 digits starting with 6, 7, 8, 9, or prefixed with 91
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return /^[6-9]\d{9}$/.test(cleaned.slice(2));
  }
  return /^[6-9]\d{9}$/.test(cleaned);
};

export const INDIAN_CITIES_PINCODES = {
  '110001': { city: 'New Delhi', state: 'Delhi', standardDays: 1, expressDays: 0 },
  '400001': { city: 'Mumbai', state: 'Maharashtra', standardDays: 2, expressDays: 1 },
  '560001': { city: 'Bengaluru', state: 'Karnataka', standardDays: 2, expressDays: 1 },
  '700001': { city: 'Kolkata', state: 'West Bengal', standardDays: 3, expressDays: 1 },
  '600001': { city: 'Chennai', state: 'Tamil Nadu', standardDays: 2, expressDays: 1 },
  '500001': { city: 'Hyderabad', state: 'Telangana', standardDays: 2, expressDays: 1 },
  '380001': { city: 'Ahmedabad', state: 'Gujarat', standardDays: 2, expressDays: 1 },
  '411001': { city: 'Pune', state: 'Maharashtra', standardDays: 2, expressDays: 1 },
  '302001': { city: 'Jaipur', state: 'Rajasthan', standardDays: 2, expressDays: 1 },
  '226001': { city: 'Lucknow', state: 'Uttar Pradesh', standardDays: 2, expressDays: 1 }
};
