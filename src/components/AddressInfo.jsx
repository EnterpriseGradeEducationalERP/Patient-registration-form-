// components/AddressInfo.jsx
import React, { useState, useEffect, useRef } from 'react';
import { verifyAddress, formatAddressForSmarty, applyVerifiedAddress, lookupZipCode } from '../services/addressApi';

const AddressInfo = ({ formData, updateFormData, currentStep, addStepError, removeStepError, validationErrors = {} }) => {
  const [localData, setLocalData] = useState(formData.address || {});
  const [differentMailing, setDifferentMailing] = useState(!!formData.address?.mailAddress1);
  const [errors, setErrors] = useState({});
  const [verificationStatus, setVerificationStatus] = useState({
    res: { verifying: false, verified: false, error: null, details: null },
    mail: { verifying: false, verified: false, error: null, details: null }
  });

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  // Refs for timers
  const verificationTimerRef = useRef({});

  // Sync with formData when step changes
  useEffect(() => {
    setLocalData(formData.address || {});
    setDifferentMailing(!!formData.address?.mailAddress1);
    
    // Restore verification status from formData
    if (formData.address?.resVerified) {
      setVerificationStatus(prev => ({
        ...prev,
        res: {
          verifying: false,
          verified: true,
          error: null,
          details: formData.address.resVerificationDetails || null
        }
      }));
    }
    if (formData.address?.mailVerified) {
      setVerificationStatus(prev => ({
        ...prev,
        mail: {
          verifying: false,
          verified: true,
          error: null,
          details: formData.address.mailVerificationDetails || null
        }
      }));
    }
  }, [formData.address]);

  // Update errors when validationErrors prop changes (from App-level validation)
  useEffect(() => {
    if (Object.keys(validationErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...validationErrors }));
      Object.keys(validationErrors).forEach(() => {
        if (addStepError) addStepError(currentStep);
      });
    }
  }, [validationErrors, currentStep, addStepError]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(verificationTimerRef.current).forEach(timer => {
        if (timer) clearTimeout(timer);
      });
    };
  }, []);

  // Handle field changes - EXACTLY like PersonalInfo and ContactInfo (simple synchronous update)
  const handleChange = (field, value) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    updateFormData('address', newData);
    
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
      if (removeStepError) removeStepError(currentStep);
    }
    
    // Clear verification status when address is modified
    const prefix = field.startsWith('res') ? 'res' : field.startsWith('mail') ? 'mail' : null;
    if (prefix && verificationStatus[prefix]?.verified) {
      setVerificationStatus(prev => ({
        ...prev,
        [prefix]: { verifying: false, verified: false, error: null, details: null }
      }));
      
      const clearedData = { ...newData };
      clearedData[`${prefix}Verified`] = false;
      delete clearedData[`${prefix}VerificationDetails`];
      setLocalData(clearedData);
      updateFormData('address', clearedData);
    }
  };

  // Field-level validation
  const validateField = (field, value) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'resZip':
      case 'mailZip':
        if (!value) {
          newErrors[field] = 'ZIP code is required';
          addStepError(currentStep);
        } else if (!/^\d{5}$/.test(value)) {
          newErrors[field] = 'ZIP code must be exactly 5 digits';
          addStepError(currentStep);
        } else {
          delete newErrors[field];
          removeStepError(currentStep);
        }
        break;
        
      case 'resCity':
      case 'mailCity':
        if (!value) {
          newErrors[field] = 'City is required';
          addStepError(currentStep);
        } else if (/[^A-Za-z\s]/.test(value)) {
          newErrors[field] = 'City should contain only letters';
          addStepError(currentStep);
        } else {
          delete newErrors[field];
          removeStepError(currentStep);
        }
        break;
        
      case 'resAddress1':
      case 'mailAddress1':
        if (!value || value.trim().length === 0) {
          newErrors[field] = 'Address 1 is required';
          addStepError(currentStep);
        } else {
          delete newErrors[field];
          removeStepError(currentStep);
        }
        break;
        
      case 'resStreet':
      case 'mailStreet':
        if (!value || value.trim().length === 0) {
          newErrors[field] = 'Street is required';
          addStepError(currentStep);
        } else {
          delete newErrors[field];
          removeStepError(currentStep);
        }
        break;
        
      case 'resState':
      case 'mailState':
        if (!value || value.trim().length === 0) {
          newErrors[field] = 'State is required';
          addStepError(currentStep);
        } else {
          delete newErrors[field];
          removeStepError(currentStep);
        }
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  // Auto-verify address when user finishes entering required fields
  const handleAutoVerify = (prefix, field) => {
    const keyFields = [`${prefix}Address1`, `${prefix}Street`, `${prefix}City`, `${prefix}State`, `${prefix}Zip`];
    if (!keyFields.includes(field)) return;

    if (verificationTimerRef.current[prefix]) {
      clearTimeout(verificationTimerRef.current[prefix]);
    }

    verificationTimerRef.current[prefix] = setTimeout(() => {
      const requiredFields = [`${prefix}Address1`, `${prefix}City`, `${prefix}State`, `${prefix}Zip`];
      const hasAllFields = requiredFields.every(f => {
        const value = localData[f];
        return value && value.trim().length > 0;
      });

      const hasStreet = localData[`${prefix}Street`] && localData[`${prefix}Street`].trim().length > 0;
      
      if (hasAllFields || (hasStreet && localData[`${prefix}City`] && localData[`${prefix}State`] && localData[`${prefix}Zip`])) {
        handleVerifyAddress(prefix);
      }
    }, 1000);
  };
  
  // Verify address using Smarty Streets API
  const handleVerifyAddress = async (prefix) => {
    const requiredFields = [`${prefix}Address1`, `${prefix}City`, `${prefix}State`, `${prefix}Zip`];
    const missingFields = requiredFields.filter(field => !localData[field] || !localData[field].trim());
    
    if (missingFields.length > 0) {
      setVerificationStatus(prev => ({
        ...prev,
        [prefix]: {
          verifying: false,
          verified: false,
          error: 'Please fill in all required fields (Address 1, City, State, ZIP Code) before verifying',
          details: null
        }
      }));
      return;
    }
    
    setVerificationStatus(prev => ({
      ...prev,
      [prefix]: { verifying: true, verified: false, error: null, details: null }
    }));
    
    try {
      const smartyAddress = formatAddressForSmarty(localData, prefix);
      const result = await verifyAddress(smartyAddress);
      
      if (result.success && result.verified && result.address) {
        const updatedAddress = applyVerifiedAddress(result.address, localData, prefix);
        setLocalData(updatedAddress);
        updateFormData('address', updatedAddress);
        
        const verificationDetails = {
          message: result.verificationMessage || result.message || 'Address verified successfully',
          precision: result.metadata?.precision || null,
          hasCorrections: result.hasCorrections || false,
          zip4: result.address.zip4 || null
        };
        
        setVerificationStatus(prev => ({
          ...prev,
          [prefix]: { 
            verifying: false, 
            verified: true, 
            error: null,
            details: verificationDetails
          }
        }));
        
        const newData = { ...updatedAddress };
        newData[`${prefix}Verified`] = true;
        newData[`${prefix}VerificationDetails`] = verificationDetails;
        setLocalData(newData);
        updateFormData('address', newData);
        
        // Clear errors for this address
        const newErrors = { ...errors };
        Object.keys(newErrors).forEach(key => {
          if (key.startsWith(prefix)) {
            delete newErrors[key];
          }
        });
        setErrors(newErrors);
        removeStepError(currentStep);
      } else {
        const errorMessage = result.error || 
          (result.verificationMessage && result.verificationMessage !== 'Verification failed' 
            ? result.verificationMessage 
            : 'Address could not be verified. Please check the address and try again.');
        
        setVerificationStatus(prev => ({
          ...prev,
          [prefix]: {
            verifying: false,
            verified: false,
            error: errorMessage,
            details: null
          }
        }));
        
        const failedData = { ...localData };
        failedData[`${prefix}Verified`] = false;
        delete failedData[`${prefix}VerificationDetails`];
        setLocalData(failedData);
        updateFormData('address', failedData);
      }
    } catch (error) {
      console.error('Address verification error:', error);
      setVerificationStatus(prev => ({
        ...prev,
        [prefix]: {
          verifying: false,
          verified: false,
          error: 'Failed to verify address. Please check your connection and try again.',
          details: null
        }
      }));
      
      const errorData = { ...localData };
      errorData[`${prefix}Verified`] = false;
      delete errorData[`${prefix}VerificationDetails`];
      setLocalData(errorData);
      updateFormData('address', errorData);
    }
  };
  
  // Auto-fill city and state from ZIP code
  const handleZipCodeLookup = async (zipCode, prefix) => {
    if (!zipCode || zipCode.length !== 5) return;
    
    try {
      const result = await lookupZipCode(zipCode);
      if (result.success && result.city && result.state) {
        const newData = { ...localData };
        newData[`${prefix}City`] = result.city;
        newData[`${prefix}State`] = result.state;
        setLocalData(newData);
        updateFormData('address', newData);
      }
    } catch (error) {
      console.error('ZIP code lookup error:', error);
    }
  };

  // Handle mailing address toggle
  const handleMailingToggle = (checked) => {
    setDifferentMailing(checked);
    if (!checked) {
      const newData = { ...localData };
      delete newData.mailApt;
      delete newData.mailAddress1;
      delete newData.mailAddress2;
      delete newData.mailStreet;
      delete newData.mailCity;
      delete newData.mailState;
      delete newData.mailZip;
      delete newData.mailVerified;
      delete newData.mailVerificationDetails;
      setLocalData(newData);
      updateFormData('address', newData);
      
      setVerificationStatus(prev => ({
        ...prev,
        mail: { verifying: false, verified: false, error: null, details: null }
      }));
      
      const newErrors = { ...errors };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith('mail')) delete newErrors[key];
      });
      setErrors(newErrors);
      removeStepError(currentStep);
    }
  };

  // State Dropdown Component
  const StateDropdown = ({ id, value, onChange, onBlur, error, placeholder = "Type or select state" }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredStates, setFilteredStates] = useState(states);

    const filterStates = (searchTerm) => {
      if (!searchTerm) {
        setFilteredStates(states);
      } else {
        setFilteredStates(
          states.filter(state => 
            state.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }
    };

    return (
      <div className="relative">
        <input
          type="text"
          id={id}
          value={value || ''}
          onChange={(e) => {
            onChange(e.target.value);
            filterStates(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => {
            setShowDropdown(true);
            filterStates(value);
          }}
          onBlur={(e) => {
            setTimeout(() => setShowDropdown(false), 200);
            if (onBlur) onBlur();
          }}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder={placeholder}
        />
        
        {showDropdown && (
          <div className="absolute z-10 bg-white border mt-1 rounded w-full max-h-32 overflow-y-auto shadow-lg">
            {filteredStates.map((state, index) => (
              <div
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(state);
                  setShowDropdown(false);
                }}
              >
                {state}
              </div>
            ))}
          </div>
        )}
        
        {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
      </div>
    );
  };

  // Address Section Component
  const AddressSection = ({ prefix, title, isRequired = true }) => {
    const isMailing = prefix === 'mail';
    const isActuallyRequired = isRequired && (!isMailing || differentMailing);
    const status = verificationStatus[prefix];

    return (
      <div className={isMailing ? 'mt-6' : ''}>
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">{title}</h4>
          <button
            type="button"
            onClick={() => handleVerifyAddress(prefix)}
            disabled={status.verifying}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              status.verified
                ? 'bg-green-600 text-white hover:bg-green-700'
                : status.verifying
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {status.verifying ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>Verifying...
              </>
            ) : status.verified ? (
              <>
                <i className="fas fa-check-circle mr-2"></i>Verified
              </>
            ) : (
              <>
                <i className="fas fa-search-location mr-2"></i>Verify Address
              </>
            )}
          </button>
        </div>
        
        {/* Verification Status Messages */}
        {status.verified && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-start text-green-800">
              <i className="fas fa-check-circle mr-2 mt-0.5"></i>
              <div className="flex-1">
                <div className="text-sm font-medium mb-1">
                  {status.details?.message || 'Address verified successfully'}
                </div>
                {status.details?.zip4 && (
                  <div className="text-xs text-green-700 mt-1">
                    ZIP+4: {status.details.zip4}
                  </div>
                )}
                {status.details?.precision && (
                  <div className="text-xs text-green-700 mt-1">
                    Precision: {status.details.precision}
                  </div>
                )}
                {status.details?.hasCorrections && (
                  <div className="text-xs text-yellow-700 mt-1">
                    <i className="fas fa-info-circle mr-1"></i>
                    Address was corrected during verification
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {!status.verified && !status.verifying && !status.error && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-center text-yellow-800">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              <span className="text-sm font-medium">
                Address verification is required before proceeding to the next step. Please click "Verify Address" button.
              </span>
            </div>
          </div>
        )}
        
        {status.error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center text-red-800">
              <i className="fas fa-exclamation-circle mr-2"></i>
              <span className="text-sm">{status.error}</span>
            </div>
          </div>
        )}
        
        {/* Show validation error if verification is required but not done */}
        {errors[`${prefix}Verified`] && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center text-red-800">
              <i className="fas fa-exclamation-circle mr-2"></i>
              <span className="text-sm font-medium">{errors[`${prefix}Verified`]}</span>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Apt No */}
          <div>
            <label htmlFor={`${prefix}Apt`} className="block text-gray-700 font-medium mb-1">
              Apt. No
            </label>
            <input
              type="text"
              id={`${prefix}Apt`}
              value={localData[`${prefix}Apt`] || ''}
              onChange={(e) => handleChange(`${prefix}Apt`, e.target.value)}
              maxLength="20"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter Apt-No"
              autoComplete="off"
            />
          </div>

          {/* Address 1 */}
          <div>
            <label htmlFor={`${prefix}Address1`} className="block text-gray-700 font-medium mb-1">
              {isActuallyRequired && <span className="text-red-500">*</span>} Address 1
            </label>
            <input
              type="text"
              id={`${prefix}Address1`}
              value={localData[`${prefix}Address1`] || ''}
              onChange={(e) => handleChange(`${prefix}Address1`, e.target.value)}
              onBlur={(e) => {
                validateField(`${prefix}Address1`, e.target.value);
                handleAutoVerify(prefix, `${prefix}Address1`);
              }}
              required={isActuallyRequired}
              maxLength="50"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors[`${prefix}Address1`] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter Address 1"
            />
            {errors[`${prefix}Address1`] && (
              <span className="text-red-500 text-sm mt-1">{errors[`${prefix}Address1`]}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Address 2 */}
          <div>
            <label htmlFor={`${prefix}Address2`} className="block text-gray-700 font-medium mb-1">
              Address 2
            </label>
            <input
              type="text"
              id={`${prefix}Address2`}
              value={localData[`${prefix}Address2`] || ''}
              onChange={(e) => handleChange(`${prefix}Address2`, e.target.value)}
              maxLength="50"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter Address 2"
            />
          </div>

          {/* Street */}
          <div>
            <label htmlFor={`${prefix}Street`} className="block text-gray-700 font-medium mb-1">
              {isActuallyRequired && <span className="text-red-500">*</span>} Street
            </label>
            <input
              type="text"
              id={`${prefix}Street`}
              value={localData[`${prefix}Street`] || ''}
              onChange={(e) => handleChange(`${prefix}Street`, e.target.value)}
              onBlur={(e) => {
                validateField(`${prefix}Street`, e.target.value);
                handleAutoVerify(prefix, `${prefix}Street`);
              }}
              required={isActuallyRequired}
              maxLength="50"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors[`${prefix}Street`] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter Street"
            />
            {errors[`${prefix}Street`] && (
              <span className="text-red-500 text-sm mt-1">{errors[`${prefix}Street`]}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* City */}
          <div>
            <label htmlFor={`${prefix}City`} className="block text-gray-700 font-medium mb-1">
              {isActuallyRequired && <span className="text-red-500">*</span>} City
            </label>
            <input
              type="text"
              id={`${prefix}City`}
              value={localData[`${prefix}City`] || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/[^A-Za-z\s]/g, '');
                handleChange(`${prefix}City`, value);
              }}
              onBlur={(e) => {
                validateField(`${prefix}City`, e.target.value);
                handleAutoVerify(prefix, `${prefix}City`);
              }}
              required={isActuallyRequired}
              maxLength="50"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors[`${prefix}City`] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter City"
            />
            {errors[`${prefix}City`] && (
              <span className="text-red-500 text-sm mt-1">{errors[`${prefix}City`]}</span>
            )}
          </div>

          {/* State */}
          <div>
            <label htmlFor={`${prefix}State`} className="block text-gray-700 font-medium mb-1">
              {isActuallyRequired && <span className="text-red-500">*</span>} State
            </label>
            <StateDropdown
              id={`${prefix}State`}
              value={localData[`${prefix}State`] || ''}
              onChange={(value) => {
                handleChange(`${prefix}State`, value);
                setTimeout(() => handleAutoVerify(prefix, `${prefix}State`), 100);
              }}
              onBlur={() => {
                validateField(`${prefix}State`, localData[`${prefix}State`]);
              }}
              error={errors[`${prefix}State`]}
              placeholder="Type or select state"
            />
          </div>

          {/* ZIP Code */}
          <div>
            <label htmlFor={`${prefix}Zip`} className="block text-gray-700 font-medium mb-1">
              {isActuallyRequired && <span className="text-red-500">*</span>} ZIP Code
            </label>
            <div className="relative">
              <input
                type="text"
                id={`${prefix}Zip`}
                value={localData[`${prefix}Zip`] || ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                  handleChange(`${prefix}Zip`, value);
                }}
                onBlur={(e) => {
                  validateField(`${prefix}Zip`, e.target.value);
                  if (e.target.value.length === 5) {
                    handleZipCodeLookup(e.target.value, prefix).then(() => {
                      handleAutoVerify(prefix, `${prefix}Zip`);
                    });
                  } else {
                    handleAutoVerify(prefix, `${prefix}Zip`);
                  }
                }}
                required={isActuallyRequired}
                maxLength="5"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors[`${prefix}Zip`] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter ZIP Code"
              />
              {localData[`${prefix}Zip`]?.length === 5 && (
                <button
                  type="button"
                  onClick={() => handleZipCodeLookup(localData[`${prefix}Zip`], prefix)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800 text-sm"
                  title="Auto-fill city and state from ZIP code"
                >
                  <i className="fas fa-search"></i>
                </button>
              )}
            </div>
            {errors[`${prefix}Zip`] && (
              <span className="text-red-500 text-sm mt-1">{errors[`${prefix}Zip`]}</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-xl font-semibold mb-4">Address Information</h3>

      {/* Residential Address */}
      <AddressSection prefix="res" title="Residential Address" />

      {/* Mailing Address Toggle */}
      <div className="mt-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={differentMailing}
            onChange={(e) => handleMailingToggle(e.target.checked)}
            className="mr-2"
          />
          <span className="text-gray-700">Mailing address is different from residential address</span>
        </label>
      </div>

      {/* Mailing Address */}
      {differentMailing && (
        <AddressSection prefix="mail" title="Mailing Address" />
      )}
    </div>
  );
};

export default AddressInfo;

