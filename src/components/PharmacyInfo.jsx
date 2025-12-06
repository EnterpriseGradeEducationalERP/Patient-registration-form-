// components/PharmacyInfo.jsx
import React, { useState, useEffect, useRef } from 'react';
import { searchPharmacies, formatPharmacyName } from '../services/pharmacyApi';

const PharmacyInfo = ({ formData, updateFormData, currentStep, addStepError, removeStepError }) => {
  const [localData, setLocalData] = useState(formData.pharmacy || {});
  const [errors, setErrors] = useState({});
  const [pharmacyOptions, setPharmacyOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingPharmacies, setLoadingPharmacies] = useState(false);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    setLocalData(formData.pharmacy || {});
  }, [formData.pharmacy]);

  const handleChange = (field, value) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    updateFormData('pharmacy', newData);
    
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
      removeStepError(currentStep);
    }

    // Auto-search pharmacies when zip code is complete
    if (field === 'zipCode' && value.length === 5) {
      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      
      // Wait 500ms after user stops typing, then search
      searchTimeoutRef.current = setTimeout(() => {
        searchPharmaciesByZip(value);
      }, 500);
    }

    // Filter pharmacy options when typing in pharmacy input
    if (field === 'pharmacyInput') {
      filterPharmacyOptions(value);
      setShowDropdown(true);
    }
  };

  /**
   * Search pharmacies by ZIP code using Google Places API
   */
  const searchPharmaciesByZip = async (zipCode) => {
    if (!zipCode || zipCode.length !== 5) return;

    setLoadingPharmacies(true);
    
    try {
      const result = await searchPharmacies(zipCode);
      
      if (result.success && result.pharmacies) {
        // Format pharmacies for display
        const formattedPharmacies = result.pharmacies.map(pharmacy => ({
          ...pharmacy,
          displayName: formatPharmacyName(pharmacy)
        }));
        
        setPharmacyOptions(formattedPharmacies);
        
        // Auto-show dropdown if pharmacies found
        if (formattedPharmacies.length > 0) {
          setShowDropdown(true);
        }
      } else {
        // Show error or empty message
        setPharmacyOptions([]);
        if (result.error) {
          console.warn('Pharmacy search:', result.error);
          // Show user-friendly message for billing error
          if (result.error.includes('Billing') || result.error.includes('REQUEST_DENIED')) {
            console.warn('💡 Enable billing on Google Cloud to use pharmacy search');
          }
        }
      }
    } catch (error) {
      console.error('Pharmacy search error:', error);
      setPharmacyOptions([]);
    } finally {
      setLoadingPharmacies(false);
    }
  };

  const filterPharmacyOptions = (searchTerm) => {
    if (!searchTerm) {
      // Show all when empty (pharmacyOptions already has all)
      return;
    } else {
      // Filter is handled by showing all and letting user type
      // The dropdown will show matching pharmacies
      setShowDropdown(true);
    }
  };

  const validateField = (field, value) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'zipCode':
        if (!value) {
          newErrors.zipCode = 'ZIP Code is required';
          addStepError(currentStep);
        } else if (!/^\d{5}$/.test(value)) {
          newErrors.zipCode = 'Please enter a valid 5-digit ZIP code';
          addStepError(currentStep);
        } else {
          delete newErrors.zipCode;
          removeStepError(currentStep);
        }
        break;
        
      case 'pharmacyInput':
        if (!value) {
          newErrors.pharmacyInput = 'Pharmacy location is required';
          addStepError(currentStep);
        } else {
          delete newErrors.pharmacyInput;
          removeStepError(currentStep);
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleBlur = (field, value) => {
    validateField(field, value);
    if (field === 'pharmacyInput') {
      setTimeout(() => setShowDropdown(false), 200);
    }
  };

  const handlePharmacySelect = (pharmacy) => {
    // Use displayName if available, otherwise use name
    const displayValue = pharmacy.displayName || pharmacy.name || pharmacy;
    handleChange('pharmacyInput', displayValue);
    setShowDropdown(false);
    
    // Clear error when pharmacy is selected
    if (errors.pharmacyInput) {
      setErrors(prev => ({ ...prev, pharmacyInput: '' }));
      removeStepError(currentStep);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-xl font-semibold mb-4">Pharmacy Details</h3>
      
      <div className="grid grid-cols-1 gap-4">
        {/* ZIP Code */}
        <div>
          <label htmlFor="zipCode" className="block text-gray-700 font-medium mb-1">
            <span className="text-red-500">*</span> Area ZIP Code
          </label>
          <div className="relative">
            <input
              type="text"
              id="zipCode"
              value={localData.zipCode || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                handleChange('zipCode', value);
              }}
              onBlur={(e) => handleBlur('zipCode', e.target.value)}
              required
              maxLength="5"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.zipCode ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="example: 75094"
            />
            {loadingPharmacies && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <i className="fas fa-spinner fa-spin text-purple-600"></i>
              </div>
            )}
          </div>
          {errors.zipCode && (
            <span className="text-red-500 text-sm mt-1">{errors.zipCode}</span>
          )}
        </div>

        {/* Pharmacy Location */}
        <div>
          <label htmlFor="pharmacyInput" className="block text-gray-700 font-medium mb-1">
            <span className="text-red-500">*</span> Preferred Pharmacy Location
          </label>
          <div className="relative">
            <input
              type="text"
              id="pharmacyInput"
              value={localData.pharmacyInput || ''}
              onChange={(e) => handleChange('pharmacyInput', e.target.value)}
              onFocus={() => setShowDropdown(true)}
              onBlur={(e) => handleBlur('pharmacyInput', e.target.value)}
              required
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.pharmacyInput ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Type or select pharmacy"
            />
            
            {showDropdown && pharmacyOptions.length > 0 && (
              <div className="absolute z-10 bg-white border mt-1 rounded w-full max-h-60 overflow-y-auto shadow-lg">
                <div className="p-2 text-xs text-gray-500 border-b">
                  {pharmacyOptions.length} pharmacy{pharmacyOptions.length !== 1 ? 'ies' : ''} found
                </div>
                {pharmacyOptions
                  .filter(pharmacy => {
                    // Filter by search term if user is typing
                    const searchTerm = (localData.pharmacyInput || '').toLowerCase();
                    if (!searchTerm) return true;
                    const pharmacyName = (pharmacy.displayName || pharmacy.name || '').toLowerCase();
                    return pharmacyName.includes(searchTerm);
                  })
                  .map((pharmacy) => (
                    <div
                      key={pharmacy.id || pharmacy.name}
                      className="p-3 hover:bg-purple-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onMouseDown={() => handlePharmacySelect(pharmacy)}
                    >
                      <div className="font-medium text-gray-800">
                        {pharmacy.name}
                      </div>
                      {pharmacy.address && (
                        <div className="text-sm text-gray-600 mt-1">
                          {pharmacy.address}
                        </div>
                      )}
                      {pharmacy.rating && (
                        <div className="text-xs text-gray-500 mt-1">
                          ⭐ {pharmacy.rating} {pharmacy.userRatingsTotal ? `(${pharmacy.userRatingsTotal} reviews)` : ''}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
            
            {showDropdown && !loadingPharmacies && pharmacyOptions.length === 0 && localData.zipCode?.length === 5 && (
              <div className="absolute z-10 bg-white border mt-1 rounded w-full p-3 text-sm">
                <div className="text-gray-500 mb-2">
                  No pharmacies found near this ZIP code.
                </div>
                <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                  💡 Tip: If you see this for all ZIP codes, you may need to enable billing on your Google Cloud project.
                </div>
              </div>
            )}
          </div>
          {errors.pharmacyInput && (
            <span className="text-red-500 text-sm mt-1">{errors.pharmacyInput}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PharmacyInfo;