// components/ContactInfo.jsx
import React, { useState, useEffect } from 'react';

const ContactInfo = ({ formData, updateFormData, currentStep, markStepCompleted, addStepError, removeStepError }) => {
  const [localData, setLocalData] = useState(formData.contact || {});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setLocalData(formData.contact || {});
  }, [formData.contact]);

  const handleChange = (field, value) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    updateFormData('contact', newData);
    
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
      removeStepError(currentStep);
    }
  };

  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return `(${numbers}`;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)})-${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)})-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const handlePhoneChange = (field, value) => {
    const formatted = formatPhoneNumber(value);
    handleChange(field, formatted);
  };

  const validateField = (field, value) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors.email = 'Valid email is required';
          addStepError(currentStep);
        } else {
          delete newErrors.email;
          removeStepError(currentStep);
        }
        break;
        
      case 'primaryContact':
        const digits = value.replace(/\D/g, '');
        if (digits.length !== 10) {
          newErrors.primaryContact = 'Primary contact must be 10 digits';
          addStepError(currentStep);
        } else {
          delete newErrors.primaryContact;
          removeStepError(currentStep);
        }
        break;
        
      case 'emergencyName':
        if (value && /\d/.test(value)) {
          newErrors.emergencyName = 'Emergency name should not contain numbers';
          addStepError(currentStep);
        } else {
          delete newErrors.emergencyName;
          removeStepError(currentStep);
        }
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field, value) => {
    validateField(field, value);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
            <span className="text-red-500">*</span> Email Address
          </label>
          <input
            type="email"
            id="email"
            value={localData.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={(e) => handleBlur('email', e.target.value)}
            required
            maxLength="30"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="example@example.com"
          />
          {errors.email && (
            <span className="text-red-500 text-sm mt-1">{errors.email}</span>
          )}
        </div>

        {/* Primary Contact */}
        <div>
          <label htmlFor="primaryContact" className="block text-gray-700 font-medium mb-1">
            <span className="text-red-500">*</span> Primary Contact Number
          </label>
          <input
            type="tel"
            id="primaryContact"
            value={localData.primaryContact || ''}
            onChange={(e) => handlePhoneChange('primaryContact', e.target.value)}
            onBlur={(e) => handleBlur('primaryContact', e.target.value)}
            required
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.primaryContact ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="(123)-456-7890"
          />
          {errors.primaryContact && (
            <span className="text-red-500 text-sm mt-1">{errors.primaryContact}</span>
          )}
        </div>

        {/* Secondary Contact */}
        <div>
          <label htmlFor="secondaryContact" className="block text-gray-700 font-medium mb-1">
            Secondary Contact Number
          </label>
          <input
            type="tel"
            id="secondaryContact"
            value={localData.secondaryContact || ''}
            onChange={(e) => handlePhoneChange('secondaryContact', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="(123)-456-7890"
          />
        </div>

        {/* Emergency Contact Name */}
        <div>
          <label htmlFor="emergencyName" className="block text-gray-700 font-medium mb-1">
            Emergency Contact Name
          </label>
          <input
            type="text"
            id="emergencyName"
            value={localData.emergencyName || ''}
            onChange={(e) => handleChange('emergencyName', e.target.value)}
            onBlur={(e) => handleBlur('emergencyName', e.target.value)}
            maxLength="30"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.emergencyName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter emergency contact name"
          />
          {errors.emergencyName && (
            <span className="text-red-500 text-sm mt-1">{errors.emergencyName}</span>
          )}
        </div>

        {/* Emergency Contact Number */}
        <div>
          <label htmlFor="emergencyContact" className="block text-gray-700 font-medium mb-1">
            Emergency Contact Number
          </label>
          <input
            type="tel"
            id="emergencyContact"
            value={localData.emergencyContact || ''}
            onChange={(e) => handlePhoneChange('emergencyContact', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="(123)-456-7890"
          />
        </div>

        {/* Preferred Mode of Contact */}
        <div>
          <label htmlFor="preferredMode" className="block text-gray-700 font-medium mb-1">
            <span className="text-red-500">*</span> Preferred Mode of Contact
          </label>
          <select
            id="preferredMode"
            value={localData.preferredMode || ''}
            onChange={(e) => handleChange('preferredMode', e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select preferred contact method</option>
            <option value="Primary Contact">Primary Contact Number</option>
            <option value="Secondary contact">Secondary Contact Number</option>
            <option value="Email">Email</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;