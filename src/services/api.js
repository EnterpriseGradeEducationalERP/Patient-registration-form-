// API service layer for patient registration
// Use proxy from vite.config.js in development, or direct URL in production
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

// Transform React form data to match your server schema EXACTLY
export const formatPatientDataForAPI = (formData) => {
  const personal = formData.personal || {};
  const contact = formData.contact || {};
  const address = formData.address || {};
  const employment = formData.employment || {};
  const pharmacy = formData.pharmacy || {};
  const insurance = formData.insurance || {};
  const medical = formData.medical || {};
  const preferences = formData.preferences || {};

  return {
    // Personal Information
    firstName: personal.firstName || '',
    middleName: personal.middleName || '',
    lastName: personal.lastName || '',
    dob: personal.dob || '',
    gender: personal.gender || '',
    maritalStatus: personal.maritalStatus || '',
    ssn: personal.ssn || '',
    
    // Contact Information
    email: contact.email || '',
    primaryContact: contact.primaryContact || '',
    secondaryContact: contact.secondaryContact || '',
    emergencyName: contact.emergencyName || '',
    emergencyContact: contact.emergencyContact || '',
    preferredMode: contact.preferredMode || '',
    
    // Residential Address
    resApt: address.resApt || '',
    resAddress1: address.resAddress1 || '',
    resAddress2: address.resAddress2 || '',
    resStreet: address.resStreet || '',
    resCity: address.resCity || '',
    resState: address.resState || '',
    resZip: address.resZip || '',
    
    // Mailing Address
    mailApt: address.mailApt || '',
    mailAddress1: address.mailAddress1 || '',
    mailAddress2: address.mailAddress2 || '',
    mailStreet: address.mailStreet || '',
    mailCity: address.mailCity || '',
    mailState: address.mailState || '',
    mailZip: address.mailZip || '',
    
    // Employment Information
    employmentStatus: employment.employmentStatus || '',
    occupation: employment.occupation || '',
    income: employment.income || '',
    
    // Pharmacy Information
    zipCode: pharmacy.zipCode || '',
    pharmacyInput: pharmacy.pharmacyInput || '',
    
    // Primary Insurance
    provider: insurance.provider || '',
    policy: insurance.policy || '',
    group: insurance.group || '',
    effective: insurance.effective || '',
    termination: insurance.termination || '',
    
    // Secondary Insurance
    provider2: insurance.provider2 || '',
    policy2: insurance.policy2 || '',
    group2: insurance.group2 || '',
    effective2: insurance.effective2 || '',
    termination2: insurance.termination2 || '',
    
    // Medical History
    heightValue: medical.heightValue || '',
    weightValue: medical.weightValue || '',
    bpValue: medical.bpValue || '',
    diagnoses: medical.diagnoses || [],
    allergies: medical.allergies || [],
    surgeries: medical.surgeries || [],
    medications: medical.medications || [],
    familyHistory: medical.familyHistory || '',
    
    // Preferences
    languageInput: preferences.language || '',
    commMethod: preferences.commMethod || '',
    delivery: preferences.delivery || '',
    
    // File uploads (you'll need to handle these separately)
    identityUpload: personal.identityDocument || '',
    photoUpload: personal.patientPhoto || ''
  };
};

// Main API service functions
export const patientAPI = {
  // Register a new patient
  registerPatient: async (patientData) => {
    try {
      console.log('📤 Sending patient data to server:', patientData);
      
      const response = await fetch(`${API_BASE_URL}/register-patient`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData)
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
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }
      
      console.log('✅ Patient registration successful:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Patient registration failed:', error);
      throw error;
    }
  },

  // Fetch all patients
  getPatients: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/patients`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
      
    } catch (error) {
      console.error('❌ Failed to fetch patients:', error);
      throw error;
    }
  },

  // Test email functionality
  testEmail: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/test-email`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
      
    } catch (error) {
      console.error('❌ Email test failed:', error);
      throw error;
    }
  },

  // Check if patient already exists (duplicate detection)
  checkDuplicatePatient: async (patientData) => {
    try {
      // This would be a separate endpoint for real-time duplicate checking
      const checkData = {
        firstName: patientData.firstName,
        lastName: patientData.lastName,
        dob: patientData.dob,
        ssn: patientData.ssn
      };
      
      const response = await fetch(`${API_BASE_URL}/check-duplicate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
      
    } catch (error) {
      console.error('❌ Duplicate check failed:', error);
      // Don't throw error for duplicate check - fail gracefully
      return { isDuplicate: false };
    }
  }
};

// Utility functions for API interactions
export const apiUtils = {
  // Handle API errors consistently
  handleApiError: (error) => {
    console.error('API Error:', error);
    
    if (error.message.includes('Failed to fetch')) {
      return {
        success: false,
        message: 'Network error. Please check if the server is running.',
        details: 'Make sure your backend server is running on http://localhost:3000 or check your API configuration'
      };
    }
    
    if (error.message.includes('409')) {
      return {
        success: false,
        message: 'Patient already exists in our system.',
        details: 'This patient appears to be already registered.'
      };
    }
    
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      details: 'Please try again or contact support if the problem persists.'
    };
  },

  // Validate data before sending to API
  validatePatientData: (patientData) => {
    const errors = [];
    
    // Required field validation
    if (!patientData.firstName?.trim()) errors.push('First name is required');
    if (!patientData.lastName?.trim()) errors.push('Last name is required');
    if (!patientData.dob) errors.push('Date of birth is required');
    if (!patientData.email?.trim()) errors.push('Email is required');
    if (!patientData.primaryContact?.trim()) errors.push('Primary contact is required');
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (patientData.email && !emailRegex.test(patientData.email)) {
      errors.push('Valid email address is required');
    }
    
    // Phone number validation (digits only)
    const phoneDigits = patientData.primaryContact?.replace(/\D/g, '');
    if (phoneDigits && phoneDigits.length !== 10) {
      errors.push('Primary contact must be 10 digits');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Format dates for API (ensure consistent format)
  formatDateForAPI: (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // YYYY-MM-DD format
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString;
    }
  },

  // Format phone numbers for API (remove formatting)
  formatPhoneForAPI: (phoneNumber) => {
    if (!phoneNumber) return '';
    return phoneNumber.replace(/\D/g, ''); // Remove all non-digits
  },

  // Prepare final data for API submission
  prepareForSubmission: (formData) => {
    const apiData = formatPatientDataForAPI(formData);
    
    // Apply additional formatting
    apiData.dob = apiUtils.formatDateForAPI(apiData.dob);
    apiData.effective = apiUtils.formatDateForAPI(apiData.effective);
    apiData.termination = apiUtils.formatDateForAPI(apiData.termination);
    apiData.effective2 = apiUtils.formatDateForAPI(apiData.effective2);
    apiData.termination2 = apiUtils.formatDateForAPI(apiData.termination2);
    
    apiData.primaryContact = apiUtils.formatPhoneForAPI(apiData.primaryContact);
    apiData.secondaryContact = apiUtils.formatPhoneForAPI(apiData.secondaryContact);
    apiData.emergencyContact = apiUtils.formatPhoneForAPI(apiData.emergencyContact);
    
    return apiData;
  }
};

// Enhanced registration function with comprehensive error handling
export const registerPatientWithValidation = async (formData) => {
  try {
    // Prepare data for API
    const patientData = apiUtils.prepareForSubmission(formData);
    
    // Validate data
    const validation = apiUtils.validatePatientData(patientData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    // Optional: Check for duplicates before submitting
    // const duplicateCheck = await patientAPI.checkDuplicatePatient(patientData);
    // if (duplicateCheck.isDuplicate) {
    //   throw new Error('Patient appears to be already registered in the system.');
    // }
    
    // Submit to API
    const result = await patientAPI.registerPatient(patientData);
    
    return {
      success: true,
      data: result,
      patientId: result.patientId,
      message: result.message || 'Patient registered successfully!'
    };
    
  } catch (error) {
    const errorInfo = apiUtils.handleApiError(error);
    return {
      success: false,
      error: errorInfo,
      message: errorInfo.message
    };
  }
};

// Export everything for convenience
export default {
  patientAPI,
  apiUtils,
  formatPatientDataForAPI,
  registerPatientWithValidation
};