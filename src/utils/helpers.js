// Format price with currency (Philippine Peso)
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price || 0);
};

// Format date
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

// Get size display name
export const getSizeDisplayName = (size) => {
  const sizeNames = {
    pocket: 'Pocket',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    'extra-large': 'Extra Large',
    custom: 'Custom',
  };
  return sizeNames[size] || size;
};

// Get paper type display name
export const getPaperTypeDisplayName = (type) => {
  const typeNames = {
    lined: 'Lined',
    dotted: 'Dot Grid',
    grid: 'Grid',
    blank: 'Blank',
    mixed: 'Mixed',
  };
  return typeNames[type] || type;
};

// Get cover type display name
export const getCoverTypeDisplayName = (type) => {
  const typeNames = {
    hardcover: 'Hardcover',
    softcover: 'Softcover',
    leather: 'Leather',
    spiral: 'Spiral',
    stitched: 'Stitched',
  };
  return typeNames[type] || type;
};

// Get binding display name
export const getBindingDisplayName = (binding) => {
  const bindingNames = {
    perfect: 'Perfect Bound',
    spiral: 'Spiral',
    'wire-o': 'Wire-O',
    sewn: 'Sewn',
    stapled: 'Stapled',
    disc: 'Disc Bound',
  };
  return bindingNames[binding] || binding;
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

// Get image URL
export const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  // Remove /api from the API URL to get base URL
  const baseUrl = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace('/api', '');
  return `${baseUrl}${url}`;
};

// Calculate discount percentage
export const calcDiscountPercentage = (originalPrice, salePrice) => {
  if (!originalPrice || !salePrice || originalPrice <= salePrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// Generate star rating array
export const generateStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push('full');
    } else if (i === fullStars && hasHalfStar) {
      stars.push('half');
    } else {
      stars.push('empty');
    }
  }
  
  return stars;
};