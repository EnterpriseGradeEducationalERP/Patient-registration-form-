// components/Preferences.jsx
import React, { useState, useEffect } from 'react';

const Preferences = ({ formData, updateFormData, currentStep, addStepError, removeStepError }) => {
  const [localData, setLocalData] = useState(formData.preferences || {});
  const [errors, setErrors] = useState({});
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const languageOptions = [
    'English', 'Spanish', 'Mandarin', 'French', 'German', 'Hindi', 'Arabic'
  ];

  useEffect(() => {
    setLocalData(formData.preferences || {});
  }, [formData.preferences]);

  const handleChange = (field, value) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    updateFormData('preferences', newData);
    
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
      removeStepError(currentStep);
    }
  };

  const validateField = (field, value) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'language':
        if (!value) {
          newErrors.language = 'Preferred language is required';
          addStepError(currentStep);
        } else {
          delete newErrors.language;
          removeStepError(currentStep);
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleBlur = (field, value) => {
    validateField(field, value);
    if (field === 'language') {
      setTimeout(() => setShowLanguageDropdown(false), 200);
    }
  };

  const filterLanguages = (searchTerm) => {
    if (!searchTerm) {
      return languageOptions;
    }
    return languageOptions.filter(language =>
      language.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleLanguageSelect = (language) => {
    handleChange('language', language);
    setShowLanguageDropdown(false);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-xl font-semibold mb-4">Language & Communication Preferences</h3>

      {/* Preferred Language */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <span className="text-red-600">*</span> Preferred Language:
        </label>
        <div className="relative">
          <input
            type="text"
            value={localData.language || ''}
            onChange={(e) => {
              handleChange('language', e.target.value);
              setShowLanguageDropdown(true);
            }}
            onFocus={() => setShowLanguageDropdown(true)}
            onBlur={(e) => handleBlur('language', e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.language ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Type or select language"
          />
          
          {showLanguageDropdown && (
            <div className="absolute z-10 bg-white border mt-1 rounded w-full max-h-32 overflow-y-auto">
              {filterLanguages(localData.language).map((language, index) => (
                <div
                  key={index}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onMouseDown={() => handleLanguageSelect(language)}
                >
                  {language}
                </div>
              ))}
            </div>
          )}
        </div>
        {errors.language && (
          <p className="text-red-600 text-sm mt-1">{errors.language}</p>
        )}
      </div>

      {/* Communication Method */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <span className="text-red-600">*</span> Communication Method:
        </label>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="commMethod"
              value="Email"
              checked={localData.commMethod === 'Email'}
              onChange={(e) => handleChange('commMethod', e.target.value)}
              className="text-blue-600"
            />
            <span className="text-gray-700">Email</span>
          </label>
        </div>
      </div>

      {/* Preferred Documentation Method */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <span className="text-red-600">*</span> Preferred Documentation Method:
        </label>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="delivery"
              value="Paper"
              checked={localData.delivery === 'Paper'}
              onChange={(e) => handleChange('delivery', e.target.value)}
              className="text-blue-600"
            />
            <span className="text-gray-700">Paper</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="delivery"
              value="Paperless"
              checked={localData.delivery === 'Paperless'}
              onChange={(e) => handleChange('delivery', e.target.value)}
              className="text-blue-600"
            />
            <span className="text-gray-700">Paperless</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Preferences;