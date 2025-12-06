/**
 * Pharmacy Search API Service (Frontend)
 * 
 * This service handles pharmacy search requests to the backend
 * which then communicates with Google Places API
 */

const getApiBaseUrl = () => {
  // In development, use proxy (vite.config.js handles /api -> localhost:3000)
  // In production, use relative path /api (same domain) or environment variable
  if (import.meta.env.DEV) {
    return '/api'; // Proxy will forward to http://localhost:3000/api
  }
  // Use environment variable if set, otherwise use relative path (same domain)
  return import.meta.env.VITE_API_URL || '/api';
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Search for pharmacies by ZIP code
 * @param {string} zipCode - 5-digit ZIP code
 * @returns {Promise<Object>} Pharmacy search result
 */
export const searchPharmacies = async (zipCode) => {
  try {
    if (!zipCode || zipCode.length !== 5) {
      return {
        success: false,
        error: 'ZIP code must be 5 digits',
        pharmacies: []
      };
    }

    const response = await fetch(`${API_BASE_URL}/search-pharmacies/${zipCode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Check if response is HTML (404 page) instead of JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
        throw new Error('API endpoint returned HTML page. Please check Node.js configuration in hPanel. Application URL must include /api');
      }
    }

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `HTTP error! status: ${response.status}`);
    }

    return result;
  } catch (error) {
    console.error('Pharmacy search failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to search pharmacies',
      pharmacies: []
    };
  }
};

/**
 * Format pharmacy name for display
 * @param {Object} pharmacy - Pharmacy object
 * @returns {string} Formatted pharmacy name
 */
export const formatPharmacyName = (pharmacy) => {
  if (!pharmacy) return '';
  
  let name = pharmacy.name || '';
  
  // Add address if available
  if (pharmacy.address) {
    name += ` - ${pharmacy.address}`;
  }
  
  // Add rating if available
  if (pharmacy.rating) {
    name += ` (⭐ ${pharmacy.rating})`;
  }
  
  return name;
};

export default {
  searchPharmacies,
  formatPharmacyName
};

