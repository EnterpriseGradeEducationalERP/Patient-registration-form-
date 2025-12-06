// Comprehensive validation utilities
export const validators = {
  required: (value) => ({
    isValid: value && value.toString().trim().length > 0,
    message: 'This field is required'
  }),

  email: (value) => ({
    isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Valid email address is required'
  }),

  phone: (value) => {
    const digits = value?.replace(/\D/g, '') || '';
    return {
      isValid: digits.length === 10,
      message: 'Phone number must be 10 digits'
    };
  },

  zipCode: (value) => ({
    isValid: /^\d{5}$/.test(value),
    message: 'ZIP code must be 5 digits'
  }),

  noNumbers: (value) => ({
    isValid: !value || !/\d/.test(value),
    message: 'This field should not contain numbers'
  }),

  ssn: (value) => {
    const digits = value?.replace(/\D/g, '') || '';
    return {
      isValid: digits.length === 9,
      message: 'SSN must be 9 digits'
    };
  },

  dateNotFuture: (value) => {
    if (!value) return { isValid: true, message: '' };
    
    const today = new Date().toISOString().split('T')[0];
    return {
      isValid: value <= today,
      message: 'Date cannot be in the future'
    };
  },

  dateLogical: (effective, termination) => ({
    isValid: !effective || !termination || effective < termination,
    message: 'Effective date must be earlier than termination date'
  }),

  minLength: (value, min) => ({
    isValid: !value || value.length >= min,
    message: `Must be at least ${min} characters`
  }),

  maxLength: (value, max) => ({
    isValid: !value || value.length <= max,
    message: `Cannot exceed ${max} characters`
  }),

  numbersOnly: (value) => ({
    isValid: !value || /^\d+$/.test(value),
    message: 'Only numbers are allowed'
  }),

  lettersOnly: (value) => ({
    isValid: !value || /^[A-Za-z\s]+$/.test(value),
    message: 'Only letters are allowed'
  })
};

// Step-by-step validation
export const validateStep = (step, formData) => {
  const errors = {};
  let hasErrors = false;

  switch (step) {
    case 0: // Personal Information
      if (!formData.personal?.firstName) {
        errors.firstName = 'First name is required';
        hasErrors = true;
      }
      if (!formData.personal?.lastName) {
        errors.lastName = 'Last name is required';
        hasErrors = true;
      }
      if (!formData.personal?.dob) {
        errors.dob = 'Date of birth is required';
        hasErrors = true;
      } else {
        // Validate date format dd-mm-yyyy
        const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
        if (!dateRegex.test(formData.personal.dob)) {
          errors.dob = 'Please enter date in dd-mm-yyyy format';
          hasErrors = true;
        } else {
          // Validate date is not in future
          const parts = formData.personal.dob.split('-');
          const dateObj = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (dateObj > today) {
            errors.dob = 'Date of birth cannot be in the future';
            hasErrors = true;
          }
        }
      }
      if (!formData.personal?.gender) {
        errors.gender = 'Gender is required';
        hasErrors = true;
      }
      if (!formData.personal?.maritalStatus) {
        errors.maritalStatus = 'Marital status is required';
        hasErrors = true;
      }
      if (!formData.personal?.ssn || !validators.ssn(formData.personal.ssn).isValid) {
        errors.ssn = 'Valid SSN is required (9 digits)';
        hasErrors = true;
      }
      if (!formData.personal?.identityDocument) {
        errors.identityDocument = 'Patient identity document is required';
        hasErrors = true;
      }
      if (!formData.personal?.patientPhoto) {
        errors.patientPhoto = 'Patient photo is required';
        hasErrors = true;
      }
      break;

    case 1: // Contact Information
      if (!formData.contact?.email) {
        errors.email = 'Email is required';
        hasErrors = true;
      } else if (!validators.email(formData.contact.email).isValid) {
        errors.email = 'Valid email address is required';
        hasErrors = true;
      }
      
      if (!formData.contact?.primaryContact) {
        errors.primaryContact = 'Primary contact is required';
        hasErrors = true;
      } else if (!validators.phone(formData.contact.primaryContact).isValid) {
        errors.primaryContact = 'Valid primary contact is required (10 digits)';
        hasErrors = true;
      }
      
      if (formData.contact?.emergencyName && validators.noNumbers(formData.contact.emergencyName).isValid === false) {
        errors.emergencyName = 'Emergency name should not contain numbers';
        hasErrors = true;
      }
      
      if (!formData.contact?.preferredMode) {
        errors.preferredMode = 'Preferred contact method is required';
        hasErrors = true;
      }
      break;

    case 2: // Address Information
      if (!formData.address?.resAddress1) {
        errors.resAddress1 = 'Address 1 is required';
        hasErrors = true;
      }
      if (!formData.address?.resStreet) {
        errors.resStreet = 'Street is required';
        hasErrors = true;
      }
      if (!formData.address?.resCity) {
        errors.resCity = 'City is required';
        hasErrors = true;
      }
      if (!formData.address?.resState) {
        errors.resState = 'State is required';
        hasErrors = true;
      }
      if (!formData.address?.resZip) {
        errors.resZip = 'ZIP code is required';
        hasErrors = true;
      } else if (!validators.zipCode(formData.address.resZip).isValid) {
        errors.resZip = 'Valid ZIP code is required (5 digits)';
        hasErrors = true;
      }
      
      // MANDATORY: Residential address must be verified
      if (!formData.address?.resVerified) {
        errors.resVerified = 'Residential address must be verified before proceeding';
        hasErrors = true;
      }
      
      // Mailing address validation if different
      if (formData.address?.mailAddress1) {
        if (!validators.zipCode(formData.address.mailZip).isValid) {
          errors.mailZip = 'Valid mailing ZIP code is required';
          hasErrors = true;
        }
        // MANDATORY: Mailing address must be verified if provided
        if (!formData.address?.mailVerified) {
          errors.mailVerified = 'Mailing address must be verified before proceeding';
          hasErrors = true;
        }
      }
      break;

    case 3: // Employment Information
      if (!formData.employment?.employmentStatus) {
        errors.employmentStatus = 'Employment status is required';
        hasErrors = true;
      }
      if (formData.employment?.employmentStatus === 'Employed' || formData.employment?.employmentStatus === 'Self-Employed') {
        if (!formData.employment?.occupation) {
          errors.occupation = 'Occupation is required';
          hasErrors = true;
        }
        if (!formData.employment?.income) {
          errors.income = 'Annual income is required';
          hasErrors = true;
        }
      }
      break;

    case 4: // Pharmacy Information
      if (!formData.pharmacy?.zipCode) {
        errors.zipCode = 'ZIP code is required';
        hasErrors = true;
      } else if (!validators.zipCode(formData.pharmacy.zipCode).isValid) {
        errors.zipCode = 'Valid ZIP code is required (5 digits)';
        hasErrors = true;
      }
      if (!formData.pharmacy?.pharmacyInput) {
        errors.pharmacyInput = 'Pharmacy location is required';
        hasErrors = true;
      }
      break;

    case 5: // Insurance Information
      if (!formData.insurance?.provider) {
        errors.provider = 'Insurance provider is required';
        hasErrors = true;
      }
      if (!formData.insurance?.policy) {
        errors.policy = 'Policy number is required';
        hasErrors = true;
      }
      if (!formData.insurance?.group) {
        errors.group = 'Group ID is required';
        hasErrors = true;
      }
      if (!formData.insurance?.effective) {
        errors.effective = 'Effective date is required';
        hasErrors = true;
      } else if (validators.dateNotFuture(formData.insurance.effective).isValid === false) {
        errors.effective = 'Effective date cannot be in the future';
        hasErrors = true;
      }
      if (!formData.insurance?.termination) {
        errors.termination = 'Termination date is required';
        hasErrors = true;
      } else if (validators.dateLogical(formData.insurance.effective, formData.insurance.termination).isValid === false) {
        errors.termination = 'Termination date must be after effective date';
        hasErrors = true;
      }

      // Secondary insurance validation
      if (formData.insurance?.provider2) {
        if (!formData.insurance.policy2) {
          errors.policy2 = 'Secondary policy number is required';
          hasErrors = true;
        }
        if (!formData.insurance.group2) {
          errors.group2 = 'Secondary group ID is required';
          hasErrors = true;
        }
        if (formData.insurance.policy2 === formData.insurance.policy) {
          errors.policy2 = 'Secondary policy cannot be same as primary';
          hasErrors = true;
        }
        if (formData.insurance.group2 === formData.insurance.group) {
          errors.group2 = 'Secondary group cannot be same as primary';
          hasErrors = true;
        }
      }
      break;

    case 6: // Medical History - No validation needed
      break;

    case 7: // Consent Forms
      const requiredConsents = ['form1', 'form2', 'form3', 'form4'];
      const unsignedConsents = requiredConsents.filter(formId => 
        !formData.consent?.[formId]?.signed
      );
      if (unsignedConsents.length > 0) {
        errors.consent = 'All consent forms must be signed';
        hasErrors = true;
      }
      break;

    case 8: // Preferences
      if (!formData.preferences?.language) {
        errors.language = 'Preferred language is required';
        hasErrors = true;
      }
      if (!formData.preferences?.commMethod) {
        errors.commMethod = 'Communication method is required';
        hasErrors = true;
      }
      if (!formData.preferences?.delivery) {
        errors.delivery = 'Documentation method is required';
        hasErrors = true;
      }
      break;

    default:
      break;
  }

  return {
    isValid: !hasErrors,
    errors
  };
};

// Field-specific validation
export const validateField = (field, value, formData = {}) => {
  switch (field) {
    case 'email':
      return validators.email(value);
    case 'primaryContact':
    case 'secondaryContact':
    case 'emergencyContact':
      return validators.phone(value);
    case 'resZip':
    case 'mailZip':
    case 'zipCode':
      return validators.zipCode(value);
    case 'emergencyName':
      return validators.noNumbers(value);
    case 'ssn':
      return validators.ssn(value);
    case 'dob':
    case 'effective':
    case 'termination':
      return validators.dateNotFuture(value);
    case 'firstName':
    case 'lastName':
    case 'resCity':
    case 'mailCity':
      return validators.lettersOnly(value);
    default:
      return validators.required(value);
  }
};

export default {
  validators,
  validateStep,
  validateField
};