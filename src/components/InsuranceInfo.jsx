// components/InsuranceInfo.jsx
import React, { useState, useEffect } from 'react';

const InsuranceInfo = ({ formData, updateFormData, currentStep, addStepError, removeStepError }) => {
  const [localData, setLocalData] = useState(formData.insurance || {});
  const [showSecondary, setShowSecondary] = useState(false);
  const [errors, setErrors] = useState({});

  const insuranceProviders = [
    'Aetna Health and Life Insurance Company',
    'BlueCrossShield Health and Life Insurance Company', 
    'Cigna Health and Life Insurance Company',
    'CVS Health and Life Insurance Company',
    'Hartford Life and Accident Insurance Company'
  ];

  useEffect(() => {
    setLocalData(formData.insurance || {});
    setShowSecondary(!!formData.insurance?.provider2);
  }, [formData.insurance]);

  const handleChange = (field, value) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    updateFormData('insurance', newData);
    
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
      removeStepError(currentStep);
    }
  };

  const handleSecondaryToggle = (checked) => {
    setShowSecondary(checked);
    if (!checked) {
      // Clear secondary insurance data when unchecked
      const newData = { ...localData };
      delete newData.provider2;
      delete newData.policy2;
      delete newData.group2;
      delete newData.effective2;
      delete newData.termination2;
      setLocalData(newData);
      updateFormData('insurance', newData);
    }
  };

  const validateDates = (effectiveId, terminationId, prefix = '') => {
    const today = new Date().toISOString().split("T")[0];
    const eff = localData[effectiveId];
    const term = localData[terminationId];
    const newErrors = { ...errors };

    // Clear previous date errors
    Object.keys(newErrors).forEach(key => {
      if (key.includes(prefix) && (key.includes('Future') || key.includes('Logical') || key.includes('Invalid') || key.includes('Expired'))) {
        delete newErrors[key];
      }
    });

    if (eff && eff > today) {
      newErrors[`${prefix}Future`] = 'Effective Date cannot be a future Date.';
      addStepError(currentStep);
    }

    if (eff && term && eff >= term) {
      newErrors[`${prefix}Logical`] = 'Effective Date must be earlier than Termination Date.';
      addStepError(currentStep);
    }

    if (term && eff && term < eff) {
      newErrors[`${prefix}Invalid`] = 'Termination Date cannot be earlier than Effective Date.';
      addStepError(currentStep);
    }

    if (term && term < today) {
      newErrors[`${prefix}Expired`] = 'Termination Date cannot be before today\'s Date.';
      addStepError(currentStep);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).filter(key => key.includes(prefix)).length === 0;
  };

  const handleDateChange = (field, value, isSecondary = false) => {
    handleChange(field, value);
    
    // Validate dates after a short delay to ensure state is updated
    setTimeout(() => {
      if (isSecondary) {
        validateDates('effective2', 'termination2', 'secondary');
      } else {
        validateDates('effective', 'termination', 'primary');
      }
    }, 100);
  };

  const validateDuplicate = (primaryField, secondaryField, fieldName) => {
    const primaryValue = localData[primaryField] || '';
    const secondaryValue = localData[secondaryField] || '';
    
    if (showSecondary && primaryValue && secondaryValue && primaryValue === secondaryValue) {
      setErrors(prev => ({ 
        ...prev, 
        [secondaryField]: `${fieldName} cannot be the same as Primary Insurance` 
      }));
      addStepError(currentStep);
      return false;
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[secondaryField];
        return newErrors;
      });
      removeStepError(currentStep);
      return true;
    }
  };

  const ProviderDropdown = ({ id, value, onChange, error, isSecondary = false }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredProviders, setFilteredProviders] = useState(insuranceProviders);

    const filterProviders = (searchTerm) => {
      if (!searchTerm) {
        setFilteredProviders(insuranceProviders);
      } else {
        setFilteredProviders(
          insuranceProviders.filter(provider => 
            provider.toLowerCase().includes(searchTerm.toLowerCase())
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
            filterProviders(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => {
            setShowDropdown(true);
            filterProviders(value);
          }}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Type or select insurance provider"
        />
        
        {showDropdown && (
          <div className="absolute z-10 bg-white border mt-1 rounded w-full max-h-32 overflow-y-auto">
            {filteredProviders.map((provider, index) => (
              <div
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onMouseDown={() => {
                  onChange(provider);
                  setShowDropdown(false);
                }}
              >
                {provider}
              </div>
            ))}
          </div>
        )}
        
        {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-xl font-semibold mb-4">Insurance Information</h3>

      {/* Primary Insurance */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3">Primary Insurance</h4>
        
        <div className="grid grid-cols-1 gap-4">
          {/* Provider */}
          <div>
            <label htmlFor="provider" className="block text-gray-700 font-medium mb-1">
              <span className="text-red-500">*</span> Insurance Provider Name
            </label>
            <ProviderDropdown
              id="provider"
              value={localData.provider}
              onChange={(value) => handleChange('provider', value)}
              error={errors.provider}
            />
          </div>

          {/* Policy Number */}
          <div>
            <label htmlFor="policy" className="block text-gray-700 font-medium mb-1">
              <span className="text-red-500">*</span> Policy Number
            </label>
            <input
              type="text"
              id="policy"
              value={localData.policy || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/[^a-zA-Z0-9\-]/g, '').slice(0, 20);
                handleChange('policy', value);
                if (showSecondary) {
                  validateDuplicate('policy', 'policy2', 'Policy Number');
                }
              }}
              required
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.policy ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., A12345-B"
              maxLength="30"
            />
            {errors.policy && <span className="text-red-500 text-sm mt-1">{errors.policy}</span>}
          </div>

          {/* Group ID */}
          <div>
            <label htmlFor="group" className="block text-gray-700 font-medium mb-1">
              <span className="text-red-500">*</span> Group ID
            </label>
            <input
              type="text"
              id="group"
              value={localData.group || ''}
              onChange={(e) => {
                handleChange('group', e.target.value);
                if (showSecondary) {
                  validateDuplicate('group', 'group2', 'Group ID');
                }
              }}
              required
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.group ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter Group ID"
            />
            {errors.group && <span className="text-red-500 text-sm mt-1">{errors.group}</span>}
          </div>

          {/* Effective Date */}
          <div>
            <label htmlFor="effective" className="block text-gray-700 font-medium mb-1">
              <span className="text-red-500">*</span> Effective Date
            </label>
            <input
              type="date"
              id="effective"
              value={localData.effective || ''}
              onChange={(e) => handleDateChange('effective', e.target.value)}
              required
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.primaryFuture || errors.primaryLogical ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.primaryFuture && <p className="text-red-500 text-sm mt-1">{errors.primaryFuture}</p>}
            {errors.primaryLogical && <p className="text-red-500 text-sm mt-1">{errors.primaryLogical}</p>}
          </div>

          {/* Termination Date */}
          <div>
            <label htmlFor="termination" className="block text-gray-700 font-medium mb-1">
              <span className="text-red-500">*</span> Termination Date
            </label>
            <input
              type="date"
              id="termination"
              value={localData.termination || ''}
              onChange={(e) => handleDateChange('termination', e.target.value)}
              required
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.primaryInvalid || errors.primaryExpired ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.primaryInvalid && <p className="text-red-500 text-sm mt-1">{errors.primaryInvalid}</p>}
            {errors.primaryExpired && <p className="text-red-500 text-sm mt-1">{errors.primaryExpired}</p>}
          </div>
        </div>
      </div>

      {/* Secondary Insurance Toggle */}
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showSecondary}
            onChange={(e) => handleSecondaryToggle(e.target.checked)}
            className="mr-2"
          />
          <span className="text-gray-700">I have secondary insurance coverage</span>
        </label>
      </div>

      {/* Secondary Insurance Section */}
      {showSecondary && (
        <div className="border-t pt-4 mt-4">
          <h4 className="text-lg font-semibold mb-3">Secondary Insurance</h4>
          
          <div className="grid grid-cols-1 gap-4">
            {/* Provider 2 */}
            <div>
              <label htmlFor="provider2" className="block text-gray-700 font-medium mb-1">
                <span className="text-red-500">*</span> Insurance Provider Name
              </label>
              <ProviderDropdown
                id="provider2"
                value={localData.provider2}
                onChange={(value) => handleChange('provider2', value)}
                error={errors.provider2}
                isSecondary={true}
              />
            </div>

            {/* Policy Number 2 */}
            <div>
              <label htmlFor="policy2" className="block text-gray-700 font-medium mb-1">
                <span className="text-red-500">*</span> Policy Number
              </label>
              <input
                type="text"
                id="policy2"
                value={localData.policy2 || ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-Z0-9\-]/g, '').slice(0, 20);
                  handleChange('policy2', value);
                  validateDuplicate('policy', 'policy2', 'Policy Number');
                }}
                required
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.policy2 ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., A12345-B"
                maxLength="30"
              />
              {errors.policy2 && <span className="text-red-500 text-sm mt-1">{errors.policy2}</span>}
            </div>

            {/* Group ID 2 */}
            <div>
              <label htmlFor="group2" className="block text-gray-700 font-medium mb-1">
                <span className="text-red-500">*</span> Group ID
              </label>
              <input
                type="text"
                id="group2"
                value={localData.group2 || ''}
                onChange={(e) => {
                  handleChange('group2', e.target.value);
                  validateDuplicate('group', 'group2', 'Group ID');
                }}
                required
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.group2 ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter Group ID"
              />
              {errors.group2 && <span className="text-red-500 text-sm mt-1">{errors.group2}</span>}
            </div>

            {/* Effective Date 2 */}
            <div>
              <label htmlFor="effective2" className="block text-gray-700 font-medium mb-1">
                <span className="text-red-500">*</span> Effective Date
              </label>
              <input
                type="date"
                id="effective2"
                value={localData.effective2 || ''}
                onChange={(e) => handleDateChange('effective2', e.target.value, true)}
                required
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.secondaryFuture || errors.secondaryLogical ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.secondaryFuture && <p className="text-red-500 text-sm mt-1">{errors.secondaryFuture}</p>}
              {errors.secondaryLogical && <p className="text-red-500 text-sm mt-1">{errors.secondaryLogical}</p>}
            </div>

            {/* Termination Date 2 */}
            <div>
              <label htmlFor="termination2" className="block text-gray-700 font-medium mb-1">
                <span className="text-red-500">*</span> Termination Date
              </label>
              <input
                type="date"
                id="termination2"
                value={localData.termination2 || ''}
                onChange={(e) => handleDateChange('termination2', e.target.value, true)}
                required
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.secondaryInvalid || errors.secondaryExpired ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.secondaryInvalid && <p className="text-red-500 text-sm mt-1">{errors.secondaryInvalid}</p>}
              {errors.secondaryExpired && <p className="text-red-500 text-sm mt-1">{errors.secondaryExpired}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsuranceInfo;