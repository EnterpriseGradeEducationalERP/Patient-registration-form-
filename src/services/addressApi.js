/**
 * Address Verification API Service (Frontend)
 * 
 * This service handles address verification requests to the backend
 * which communicates with Smarty Streets API
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
 * Verify an address using Smarty Streets API
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

    const result = JSON.parse(text);
    return result;
  } catch (error) {
    console.error('Address verification failed:', error);
    return {
      success: false,
      verified: false,
      error: error.message || 'Failed to verify address',
      address: null
    };
  }
};

/**
 * Lookup city and state by ZIP code using Smarty API
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
 * Get address autocomplete suggestions
 * @param {string} search - Partial address string
 * @param {number} maxResults - Maximum number of suggestions (default: 10)
 * @returns {Promise<Object>} Autocomplete suggestions
 */
export const autocompleteAddress = async (search, maxResults = 10) => {
  try {
    const response = await fetch(`${API_BASE_URL}/autocomplete-address?search=${encodeURIComponent(search)}&maxResults=${maxResults}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Address autocomplete failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to get autocomplete suggestions',
      suggestions: []
    };
  }
};

/**
 * Format address for Smarty API
 * @param {Object} addressData - Address data from form
 * @param {string} prefix - 'res' or 'mail'
 * @returns {Object} Formatted address for Smarty API
 */
export const formatAddressForSmarty = (addressData, prefix = 'res') => {
  const street = addressData[`${prefix}Street`] || '';
  const address1 = addressData[`${prefix}Address1`] || '';
  const address2 = addressData[`${prefix}Address2`] || '';
  const apt = addressData[`${prefix}Apt`] || '';
  
  // Prioritize Address1 over Street (Street might have incorrect data)
  // Use Address1 if it exists and has content, otherwise use Street
  let combinedAddress1 = '';
  if (address1 && address1.trim().length > 0) {
    combinedAddress1 = address1.trim();
  } else if (street && street.trim().length > 0) {
    combinedAddress1 = street.trim();
  }
  
  // Handle Address2 and Apt. No
  // If Apt. No exists, combine it with Address2 or use it as secondary
  let combinedAddress2 = '';
  if (address2 && address2.trim().length > 0) {
    combinedAddress2 = address2.trim();
    if (apt && apt.trim().length > 0) {
      combinedAddress2 = `${apt.trim()}, ${combinedAddress2}`;
    }
  } else if (apt && apt.trim().length > 0) {
    combinedAddress2 = apt.trim();
  }
  
  // If Address1 contains unit/apartment info (like #107), extract it
  // Otherwise, if we have Apt. No, append it to Address1
  if (apt && apt.trim().length > 0 && !combinedAddress1.includes(apt.trim())) {
    // Check if Address1 already has unit info (contains #, Apt, Unit, etc.)
    const hasUnitInfo = /#|Apt|Unit|Suite|Ste/i.test(combinedAddress1);
    if (!hasUnitInfo) {
      combinedAddress1 = `${combinedAddress1} #${apt.trim()}`;
      combinedAddress2 = ''; // Clear Address2 if we added apt to Address1
    }
  }

  return {
    address1: combinedAddress1,
    address2: combinedAddress2,
    city: addressData[`${prefix}City`] || '',
    state: addressData[`${prefix}State`] || '',
    zip5: addressData[`${prefix}Zip`] || '',
    zip4: '' // ZIP+4 if available
  };
};

/**
 * Apply verified address to form data
 * @param {Object} verifiedAddress - Verified address from Smarty
 * @param {Object} currentAddressData - Current address data
 * @param {string} prefix - 'res' or 'mail'
 * @returns {Object} Updated address data
 */
export const applyVerifiedAddress = (verifiedAddress, currentAddressData, prefix = 'res') => {
  const updated = { ...currentAddressData };
  
  // Smarty returns standardized address
  if (verifiedAddress.address1) {
    updated[`${prefix}Street`] = verifiedAddress.address1;
    updated[`${prefix}Address1`] = verifiedAddress.address1;
  }
  
  if (verifiedAddress.address2) {
    updated[`${prefix}Address2`] = verifiedAddress.address2;
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
  
  // Store ZIP+4 if available (for display purposes)
  if (verifiedAddress.zip4) {
    // You can add a separate field for ZIP+4 if needed
    // For now, we'll just store it in the address data
    updated[`${prefix}Zip4`] = verifiedAddress.zip4;
  }
  
  return updated;
};

export default {
  verifyAddress,
  lookupZipCode,
  autocompleteAddress,
  formatAddressForSmarty,
  applyVerifiedAddress
};

