// components/PersonalInfo.jsx
import React, { useState, useEffect, useRef } from 'react';

const PersonalInfo = ({ formData, updateFormData, currentStep, addStepError, removeStepError, validationErrors = {} }) => {
  const [localData, setLocalData] = useState(formData.personal || {});
  const [errors, setErrors] = useState({});
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showMaritalDropdown, setShowMaritalDropdown] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const calendarRef = useRef(null);
  const inputRef = useRef(null);

  const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];
  const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed', 'Separated', 'Domestic Partnership'];

  useEffect(() => {
    setLocalData(formData.personal || {});
  }, [formData.personal]);

  // Update errors when validationErrors prop changes (from App-level validation)
  useEffect(() => {
    if (Object.keys(validationErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...validationErrors }));
      // Mark step as having errors
      Object.keys(validationErrors).forEach(() => {
        if (addStepError) addStepError(currentStep);
      });
    }
  }, [validationErrors, currentStep, addStepError]);

  const handleChange = (field, value) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    updateFormData('personal', newData);
    
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
      if (removeStepError) removeStepError(currentStep);
    }
  };

  const handleFileChange = (field, event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size and type
      const maxSize = field === 'identityDocument' ? 10 * 1024 * 1024 : 3 * 1024 * 1024; // 10MB or 3MB
      if (file.size > maxSize) {
        setErrors(prev => ({ 
          ...prev, 
          [field]: `File size exceeds maximum allowed (${field === 'identityDocument' ? '10MB' : '3MB'})` 
        }));
        if (addStepError) addStepError(currentStep);
        return;
      }
      handleChange(field, file.name);
    }
  };

  // Convert dd-mm-yyyy to Date object
  const parseDate = (dateString) => {
    if (!dateString) return null;
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      const year = parseInt(parts[2], 10);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
    return null;
  };

  // Convert Date object to dd-mm-yyyy
  const formatDateToString = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatDate = (value) => {
    // Remove all non-digits
    const numbers = value.replace(/\D/g, '');
    
    if (!numbers) return '';
    
    // Format as dd-mm-yyyy
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}-${numbers.slice(2)}`;
    } else {
      return `${numbers.slice(0, 2)}-${numbers.slice(2, 4)}-${numbers.slice(4, 8)}`;
    }
  };

  const handleDateChange = (value) => {
    const formatted = formatDate(value);
    handleChange('dob', formatted);
    // Update calendar date if valid
    const parsed = parseDate(formatted);
    if (parsed) {
      setCalendarDate(parsed);
    }
  };

  // Calendar functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleCalendarDateSelect = (day) => {
    const selectedDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day);
    const formatted = formatDateToString(selectedDate);
    handleChange('dob', formatted);
    setCalendarDate(selectedDate);
    setShowCalendar(false);
  };

  const navigateMonth = (direction) => {
    setCalendarDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const navigateYear = (direction) => {
    setCalendarDate(prev => {
      const newDate = new Date(prev);
      newDate.setFullYear(prev.getFullYear() + direction);
      return newDate;
    });
  };

  // Initialize calendar date from existing dob
  useEffect(() => {
    if (localData.dob) {
      const parsed = parseDate(localData.dob);
      if (parsed) {
        setCalendarDate(parsed);
      }
    }
  }, [localData.dob]);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar]);

  const formatSSN = (value) => {
    // Remove all non-digits
    const numbers = value.replace(/\D/g, '');
    
    if (!numbers) return '';
    
    // Format as XXX-XX-XXXX
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 5) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 9)}`;
    }
  };

  const handleSSNChange = (value) => {
    const formatted = formatSSN(value);
    handleChange('ssn', formatted);
  };

  const validateField = (field, value) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'dob':
        if (!value) {
          newErrors.dob = 'Date of birth is required';
          if (addStepError) addStepError(currentStep);
        } else {
          // Validate date format dd-mm-yyyy
          const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
          if (!dateRegex.test(value)) {
            newErrors.dob = 'Please enter date in dd-mm-yyyy format';
            if (addStepError) addStepError(currentStep);
          } else {
            delete newErrors.dob;
            if (removeStepError) removeStepError(currentStep);
          }
        }
        break;
        
      case 'gender':
        if (!value) {
          newErrors.gender = 'Gender is required';
          if (addStepError) addStepError(currentStep);
        } else {
          delete newErrors.gender;
          if (removeStepError) removeStepError(currentStep);
        }
        break;
        
      case 'maritalStatus':
        if (!value) {
          newErrors.maritalStatus = 'Marital status is required';
          if (addStepError) addStepError(currentStep);
        } else {
          delete newErrors.maritalStatus;
          if (removeStepError) removeStepError(currentStep);
        }
        break;
        
      case 'ssn':
        if (!value) {
          newErrors.ssn = 'Social Security Number is required';
          if (addStepError) addStepError(currentStep);
        } else {
          // Validate SSN format XXX-XX-XXXX
          const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;
          if (!ssnRegex.test(value)) {
            newErrors.ssn = 'Please enter SSN in XXX-XX-XXXX format';
            if (addStepError) addStepError(currentStep);
          } else {
            delete newErrors.ssn;
            if (removeStepError) removeStepError(currentStep);
          }
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleBlur = (field, value) => {
    validateField(field, value);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-gray-700 font-medium mb-1">
            <span className="text-red-500">*</span>First Name
          </label>
          <input
            type="text"
            id="firstName"
            value={localData.firstName || ''}
            onChange={(e) => handleChange('firstName', e.target.value)}
            onBlur={(e) => handleBlur('firstName', e.target.value)}
            required
            maxLength="30"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your first name"
          />
          {errors.firstName && (
            <span className="text-red-500 text-sm mt-1">{errors.firstName}</span>
          )}
        </div>
        
        <div>
          <label htmlFor="middleName" className="block text-gray-700 font-medium mb-1">
            Middle Name
          </label>
          <input
            type="text"
            id="middleName"
            value={localData.middleName || ''}
            onChange={(e) => handleChange('middleName', e.target.value)}
            maxLength="30"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter your middle name"
          />
        </div>
        
        <div>
          <label htmlFor="lastName" className="block text-gray-700 font-medium mb-1">
            <span className="text-red-500">*</span>Last Name
          </label>
          <input
            type="text"
            id="lastName"
            value={localData.lastName || ''}
            onChange={(e) => handleChange('lastName', e.target.value)}
            onBlur={(e) => handleBlur('lastName', e.target.value)}
            required
            maxLength="30"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your last name"
          />
          {errors.lastName && (
            <span className="text-red-500 text-sm mt-1">{errors.lastName}</span>
          )}
        </div>
      </div>

      {/* Date of Birth, Gender, Marital Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div>
          <label htmlFor="dob" className="block text-gray-700 font-medium mb-1">
            <span className="text-red-500">*</span>Date of Birth
          </label>
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              id="dob"
              value={localData.dob || ''}
              onChange={(e) => handleDateChange(e.target.value)}
              onBlur={(e) => {
                handleBlur('dob', e.target.value);
              }}
              onFocus={() => {
                // Initialize calendar with current date or parsed date
                if (localData.dob) {
                  const parsed = parseDate(localData.dob);
                  if (parsed) setCalendarDate(parsed);
                }
              }}
              required
              maxLength="10"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.dob ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="dd-mm-yyyy"
            />
            <button
              type="button"
              onClick={() => {
                setShowCalendar(!showCalendar);
                if (!localData.dob) {
                  // Initialize with current date if no date set
                  const today = new Date();
                  setCalendarDate(today);
                } else {
                  const parsed = parseDate(localData.dob);
                  if (parsed) setCalendarDate(parsed);
                }
              }}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-purple-600 cursor-pointer"
            >
              <i className="fas fa-calendar"></i>
            </button>
            
            {/* Calendar Dropdown */}
            {showCalendar && (
              <div ref={calendarRef} className="absolute z-20 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 p-4 w-80">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    onClick={() => navigateYear(-1)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <i className="fas fa-angle-double-left text-gray-600"></i>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateMonth(-1)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <i className="fas fa-angle-left text-gray-600"></i>
                  </button>
                  <div className="text-center font-semibold text-gray-800">
                    {calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateMonth(1)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <i className="fas fa-angle-right text-gray-600"></i>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateYear(1)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <i className="fas fa-angle-double-right text-gray-600"></i>
                  </button>
                </div>

                {/* Calendar Days Header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs font-semibold text-gray-600 py-1">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: getFirstDayOfMonth(calendarDate) }).map((_, index) => (
                    <div key={`empty-${index}`} className="p-2"></div>
                  ))}
                  {Array.from({ length: getDaysInMonth(calendarDate) }, (_, i) => i + 1).map(day => {
                    const currentDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const compareDate = new Date(currentDate);
                    compareDate.setHours(0, 0, 0, 0);
                    
                    const isToday = compareDate.getTime() === today.getTime();
                    const isSelected = localData.dob && parseDate(localData.dob)?.toDateString() === currentDate.toDateString();
                    const isPast = compareDate <= today;
                    
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleCalendarDateSelect(day)}
                        disabled={!isPast}
                        className={`p-2 text-center rounded hover:bg-purple-100 transition-colors ${
                          isSelected 
                            ? 'bg-purple-600 text-white font-semibold' 
                            : isToday
                            ? 'bg-purple-100 text-purple-700 font-semibold'
                            : isPast
                            ? 'text-gray-700 hover:bg-gray-100'
                            : 'text-gray-300 cursor-not-allowed'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                {/* Today Button */}
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      const today = new Date();
                      const formatted = formatDateToString(today);
                      handleChange('dob', formatted);
                      setCalendarDate(today);
                      setShowCalendar(false);
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm"
                  >
                    Select Today
                  </button>
                </div>
              </div>
            )}
          </div>
          {errors.dob && (
            <span className="text-red-500 text-sm mt-1">{errors.dob}</span>
          )}
        </div>

        <div>
          <label htmlFor="gender" className="block text-gray-700 font-medium mb-1">
            <span className="text-red-500">*</span>Gender
          </label>
          <div className="relative">
            <input
              type="text"
              id="gender"
              value={localData.gender || ''}
              onChange={(e) => {
                handleChange('gender', e.target.value);
                setShowGenderDropdown(true);
              }}
              onFocus={() => setShowGenderDropdown(true)}
              onBlur={() => {
                setTimeout(() => setShowGenderDropdown(false), 200);
                handleBlur('gender', localData.gender);
              }}
              required
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.gender ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Type or select gender"
            />
            <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">▼</span>
            
            {showGenderDropdown && (
              <div className="absolute z-10 bg-white border mt-1 rounded w-full max-h-32 overflow-y-auto">
                {genderOptions
                  .filter(option => 
                    !localData.gender || 
                    option.toLowerCase().includes(localData.gender.toLowerCase())
                  )
                  .map((option, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onMouseDown={() => {
                        handleChange('gender', option);
                        setShowGenderDropdown(false);
                      }}
                    >
                      {option}
                    </div>
                  ))}
              </div>
            )}
          </div>
          {errors.gender && (
            <span className="text-red-500 text-sm mt-1">{errors.gender}</span>
          )}
        </div>

        <div>
          <label htmlFor="maritalStatus" className="block text-gray-700 font-medium mb-1">
            <span className="text-red-500">*</span>Marital Status
          </label>
          <div className="relative">
            <input
              type="text"
              id="maritalStatus"
              value={localData.maritalStatus || ''}
              onChange={(e) => {
                handleChange('maritalStatus', e.target.value);
                setShowMaritalDropdown(true);
              }}
              onFocus={() => setShowMaritalDropdown(true)}
              onBlur={() => {
                setTimeout(() => setShowMaritalDropdown(false), 200);
                handleBlur('maritalStatus', localData.maritalStatus);
              }}
              required
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.maritalStatus ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Type or select marital status"
            />
            <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">▼</span>
            
            {showMaritalDropdown && (
              <div className="absolute z-10 bg-white border mt-1 rounded w-full max-h-32 overflow-y-auto">
                {maritalStatusOptions
                  .filter(option => 
                    !localData.maritalStatus || 
                    option.toLowerCase().includes(localData.maritalStatus.toLowerCase())
                  )
                  .map((option, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onMouseDown={() => {
                        handleChange('maritalStatus', option);
                        setShowMaritalDropdown(false);
                      }}
                    >
                      {option}
                    </div>
                  ))}
              </div>
            )}
          </div>
          {errors.maritalStatus && (
            <span className="text-red-500 text-sm mt-1">{errors.maritalStatus}</span>
          )}
        </div>
      </div>

      {/* Social Security Number */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div>
          <label htmlFor="ssn" className="block text-gray-700 font-medium mb-1">
            <span className="text-red-500">*</span>Social Security Number
          </label>
          <input
            type="text"
            id="ssn"
            value={localData.ssn || ''}
            onChange={(e) => handleSSNChange(e.target.value)}
            onBlur={(e) => handleBlur('ssn', e.target.value)}
            required
            maxLength="11"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.ssn ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="XXX-XX-XXXX"
          />
          {errors.ssn && (
            <span className="text-red-500 text-sm mt-1">{errors.ssn}</span>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label htmlFor="identityUpload" className="block text-gray-700 font-medium mb-1">
            <span className="text-red-500">*</span>Upload Patient Identity <span className="text-red-500">(Passport, Driver's License)</span>
          </label>
          <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
            <input
              type="file"
              id="identityUpload"
              onChange={(e) => handleFileChange('identityDocument', e)}
              required
              accept=".jpg,.jpeg,.png,.pdf"
              className="hidden"
            />
            <p className="text-sm text-gray-600 mb-2">JPG, PNG, or PDF (Max 10MB)</p>
            <button
              type="button"
              className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700 transition-colors"
              onClick={() => document.getElementById('identityUpload').click()}
            >
              Choose File
            </button>
            <p className="text-sm mt-2">{localData.identityDocument || 'No file chosen'}</p>
            {errors.identityDocument && (
              <span className="text-red-500 text-sm mt-1 block">{errors.identityDocument}</span>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="photoUpload" className="block text-gray-700 font-medium mb-1">
            <span className="text-red-500">*</span>Upload Patient Photo
          </label>
          <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
            <input
              type="file"
              id="photoUpload"
              onChange={(e) => handleFileChange('patientPhoto', e)}
              required
              accept=".jpg,.jpeg,.png"
              className="hidden"
            />
            <p className="text-sm text-gray-600 mb-2">JPG or PNG (Max 3MB)</p>
            <button
              type="button"
              className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700 transition-colors"
              onClick={() => document.getElementById('photoUpload').click()}
            >
              Choose File
            </button>
            <p className="text-sm mt-2">{localData.patientPhoto || 'No file chosen'}</p>
            {errors.patientPhoto && (
              <span className="text-red-500 text-sm mt-1 block">{errors.patientPhoto}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;