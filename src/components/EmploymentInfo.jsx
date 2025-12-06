// components/EmploymentInfo.jsx
import React, { useState, useEffect } from 'react';

const EmploymentInfo = ({ formData, updateFormData, currentStep, addStepError, removeStepError }) => {
  const [localData, setLocalData] = useState(formData.employment || {});
  const [errors, setErrors] = useState({});
  const [showOccupation, setShowOccupation] = useState(false);
  const [showIncome, setShowIncome] = useState(false);

  const employmentOptions = ['Employed', 'Self-Employed', 'Retired', 'Unemployed'];

  useEffect(() => {
    setLocalData(formData.employment || {});
    
    // Show occupation/income fields based on employment status
    const status = formData.employment?.employmentStatus;
    setShowOccupation(status === 'Employed' || status === 'Self-Employed');
    setShowIncome(status === 'Employed' || status === 'Self-Employed');
  }, [formData.employment]);

  const handleChange = (field, value) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    updateFormData('employment', newData);
    
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
      removeStepError(currentStep);
    }

    // Handle employment status changes
    if (field === 'employmentStatus') {
      const showFields = value === 'Employed' || value === 'Self-Employed';
      setShowOccupation(showFields);
      setShowIncome(showFields);
      
      if (!showFields) {
        // Clear occupation and income if not needed
        newData.occupation = '';
        newData.income = '';
        setLocalData(newData);
        updateFormData('employment', newData);
      }
    }
  };

  const validateField = (field, value) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'employmentStatus':
        if (!value) {
          newErrors.employmentStatus = 'Employment Status is required';
          addStepError(currentStep);
        } else {
          delete newErrors.employmentStatus;
          removeStepError(currentStep);
        }
        break;
        
      case 'occupation':
        if (showOccupation && !value) {
          newErrors.occupation = 'Occupation is required';
          addStepError(currentStep);
        } else {
          delete newErrors.occupation;
          removeStepError(currentStep);
        }
        break;
        
      case 'income':
        if (showIncome && !value) {
          newErrors.income = 'Annual Income is required';
          addStepError(currentStep);
        } else {
          delete newErrors.income;
          removeStepError(currentStep);
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleBlur = (field, value) => {
    validateField(field, value);
  };

  const EmploymentDropdown = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState(employmentOptions);

    const filterOptions = (searchTerm) => {
      if (!searchTerm) {
        setFilteredOptions(employmentOptions);
      } else {
        setFilteredOptions(
          employmentOptions.filter(option => 
            option.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }
    };

    return (
      <div className="relative">
        <input
          type="text"
          id="employmentStatus"
          value={localData.employmentStatus || ''}
          onChange={(e) => {
            handleChange('employmentStatus', e.target.value);
            filterOptions(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => {
            setShowDropdown(true);
            filterOptions(localData.employmentStatus);
          }}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            errors.employmentStatus ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Type or select employment status"
          required
        />
        
        <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">▼</span>
        
        {showDropdown && (
          <div className="absolute z-10 bg-white border mt-1 rounded w-full max-h-32 overflow-y-auto">
            {filteredOptions.map((option, index) => (
              <div
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onMouseDown={() => {
                  handleChange('employmentStatus', option);
                  setShowDropdown(false);
                }}
              >
                {option}
              </div>
            ))}
          </div>
        )}
        
        {errors.employmentStatus && (
          <span className="text-red-500 text-sm mt-1">{errors.employmentStatus}</span>
        )}
      </div>
    );
  };

  const formatIncome = (value) => {
    // Remove all non-digits
    const numbers = value.replace(/\D/g, '');
    
    if (!numbers) return '';
    
    // Format with commas
    return parseInt(numbers, 10).toLocaleString('en-US');
  };

  const handleIncomeChange = (value) => {
    const formatted = formatIncome(value);
    handleChange('income', formatted);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-xl font-semibold mb-4">Employment Information</h3>
      
      <div className="grid grid-cols-1 gap-4">
        {/* Employment Status */}
        <div>
          <label htmlFor="employmentStatus" className="block text-gray-700 font-medium mb-1">
            <span className="text-red-500">*</span> Employment Status
          </label>
          <EmploymentDropdown />
        </div>

        {/* Occupation (Conditional) */}
        {showOccupation && (
          <div>
            <label htmlFor="occupation" className="block text-gray-700 font-medium mb-1">
              <span className="text-red-500">*</span> Occupation
            </label>
            <input
              type="text"
              id="occupation"
              value={localData.occupation || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/[^A-Za-z\s]/g, '').slice(0, 20);
                handleChange('occupation', value);
              }}
              onBlur={(e) => handleBlur('occupation', e.target.value)}
              required
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.occupation ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter Occupation"
            />
            {errors.occupation && (
              <span className="text-red-500 text-sm mt-1">{errors.occupation}</span>
            )}
          </div>
        )}

        {/* Annual Income (Conditional) */}
        {showIncome && (
          <div>
            <label htmlFor="income" className="block text-gray-700 font-medium mb-1">
              <span className="text-red-500">*</span> Total Annual Income ($)
            </label>
            <input
              type="text"
              id="income"
              value={localData.income || ''}
              onChange={(e) => handleIncomeChange(e.target.value)}
              onBlur={(e) => handleBlur('income', e.target.value)}
              required
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.income ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter income in dollars"
            />
            {errors.income && (
              <span className="text-red-500 text-sm mt-1">{errors.income}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmploymentInfo;