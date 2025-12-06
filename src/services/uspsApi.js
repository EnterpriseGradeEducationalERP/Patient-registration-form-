/**
 * USPS Address Verification API Service (Frontend)
 * 
 * This service handles address verification requests to the backend
 * which then communicates with USPS Web Tools API
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
 * Verify an address using USPS API
 * @param {Object} address - Address object
 * @param {string} address.address1 - Street address line 1
 * @param {string} address.address2 - Street address line 2 (optional)
 * @param {string} address.city - City
 * @param {string} address.state - State (2-letter code or full name)
 * @param {string} address.zip5 - 5-digit ZIP code
 * @param {string} address.zip4 - 4-digit ZIP+4 extension (optional)
 * @returns {Promise<Object>} Verification result
 */
export const verifyAddress = async (address) => {
  try {
    const response = await fetch(`${API_BASE_URL}/verify-address`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(address)
    });

    // Check if response is ok and has content
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText || `HTTP error! status: ${response.status}` };
      }
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    // Parse JSON response safely
    const text = await response.text();
    if (!text || text.trim() === '') {
      throw new Error('Empty response from server');
    }

    // Check if response is HTML (404 page) instead of JSON
    if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
      console.error('❌ Received HTML instead of JSON. API routing issue!');
      throw new Error('API endpoint returned HTML page. Please check Node.js configuration in hPanel. Application URL must include /api');
    }

    const result = JSON.parse(text);
    return result;
  } catch (error) {
    console.error('Address verification failed:', error);
    
    // Provide helpful error message for HTML response
    let errorMessage = error.message || 'Failed to verify address';
    if (error.message.includes('HTML') || error.message.includes('<!DOCTYPE')) {
      errorMessage = 'API routing error: Node.js is not configured correctly. Please check hPanel Node.js settings - Application URL must be: nghc.nextgenproductlabs.com/api';
    }
    
    return {
      success: false,
      verified: false,
      error: errorMessage,
      address: null
    };
  }
};

/**
 * Lookup city and state by ZIP code
 * @param {string} zip5 - 5-digit ZIP code
 * @returns {Promise<Object>} ZIP code information
 */
export const lookupZipCode = async (zip5) => {
  try {
    const response = await fetch(`${API_BASE_URL}/zip-lookup/${zip5}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('ZIP code lookup failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to lookup ZIP code',
      city: '',
      state: ''
    };
  }
};

/**
 * Format address for USPS API
 * @param {Object} addressData - Address data from form
 * @param {string} prefix - 'res' or 'mail'
 * @returns {Object} Formatted address for USPS API
 */
export const formatAddressForUSPS = (addressData, prefix = 'res') => {
  const street = addressData[`${prefix}Street`] || '';
  const address1 = addressData[`${prefix}Address1`] || '';
  const address2 = addressData[`${prefix}Address2`] || '';
  
  // Combine street and address1 for USPS
  // Addresses 3.0 uses streetAddress (not address1)
  const combinedAddress1 = street || address1;
  const combinedAddress2 = address2 || (street && address1 ? address1 : '');

  return {
    address1: combinedAddress1, // Maps to streetAddress in Addresses 3.0
    address2: combinedAddress2, // Maps to secondaryAddress in Addresses 3.0
    city: addressData[`${prefix}City`] || '',
    state: addressData[`${prefix}State`] || '',
    zip5: addressData[`${prefix}Zip`] || '',
    zip4: '' // ZIP+4 if available
  };
};

/**
 * Apply verified address to form data
 * @param {Object} verifiedAddress - Verified address from USPS
 * @param {Object} currentAddressData - Current address data
 * @param {string} prefix - 'res' or 'mail'
 * @returns {Object} Updated address data
 */
export const applyVerifiedAddress = (verifiedAddress, currentAddressData, prefix = 'res') => {
  const updated = { ...currentAddressData };
  
  // USPS returns address in Address2 field (standardized street address)
  if (verifiedAddress.address1) {
    updated[`${prefix}Street`] = verifiedAddress.address1;
    updated[`${prefix}Address1`] = verifiedAddress.address1;
  }
  
  if (verifiedAddress.city) {
    updated[`${prefix}City`] = verifiedAddress.city;
  }
  
  if (verifiedAddress.state) {
    updated[`${prefix}State`] = verifiedAddress.state;
  }
  
  if (verifiedAddress.zip5) {
    updated[`${prefix}Zip`] = verifiedAddress.zip5;
  }
  
  return updated;
};

export default {
  verifyAddress,
  lookupZipCode,
  formatAddressForUSPS,
  applyVerifiedAddress
};

