import { registerPatientWithValidation } from './services/api';
import React, { useState } from 'react';
import StepIndicator from './components/StepIndicator';
import PersonalInfo from './components/PersonalInfo';
import ContactInfo from './components/ContactInfo';
import AddressInfo from './components/AddressInfo';
import EmploymentInfo from './components/EmploymentInfo';
import PharmacyInfo from './components/PharmacyInfo';
import InsuranceInfo from './components/InsuranceInfo';
import MedicalHistory from './components/MedicalHistory';
import ConsentForms from './components/ConsentForms';
import Preferences from './components/Preferences';
import ReviewPage from './components/ReviewPage';
import { useFormState } from './hooks/useFormState';
import { validateStep } from './utils/validation';

const App = () => {
  const {
    formData,
    currentStep,
    stepCompletion,
    editedSteps,
    stepsWithErrors,
    realSSN,
    setCurrentStep,
    updateFormData,
    updateMedicalData,
    clearStep,
    markStepCompleted,
    addStepError,
    removeStepError,
    setRealSSN,
    setEditedSteps
  } = useFormState();

  const [message, setMessage] = useState({ text: '', type: 'info', show: false });
  const [stepValidationErrors, setStepValidationErrors] = useState({});

  const steps = [
    { component: PersonalInfo, title: 'Personal' },
    { component: ContactInfo, title: 'Contact' },
    { component: AddressInfo, title: 'Address' },
    { component: EmploymentInfo, title: 'Employment' },
    { component: PharmacyInfo, title: 'Pharmacy' },
    { component: InsuranceInfo, title: 'Insurance' },
    { component: MedicalHistory, title: 'Medical' },
    { component: ConsentForms, title: 'Consent' },
    { component: Preferences, title: 'Preferences' },
    { component: ReviewPage, title: 'Review' }
  ];

  const CurrentComponent = steps[currentStep].component;

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type, show: true });
    setTimeout(() => setMessage({ text: '', type: 'info', show: false }), 5000);
  };

  const nextStep = () => {
    // Validate current step before proceeding
    const validation = validateStep(currentStep, formData);
    
    if (!validation.isValid) {
      // Store validation errors for the current step
      setStepValidationErrors(prev => ({
        ...prev,
        [currentStep]: validation.errors
      }));
      
      // Show error message with details
      const errorCount = Object.keys(validation.errors).length;
      const errorList = Object.entries(validation.errors)
        .slice(0, 3)
        .map(([field]) => field.replace(/([A-Z])/g, ' $1').trim())
        .join(', ');
      const moreErrors = errorCount > 3 ? ` and ${errorCount - 3} more` : '';
      
      showMessage(
        `❌ Please complete all required fields: ${errorList}${moreErrors}. Please check the form above.`, 
        'error'
      );
      
      // Mark step as having errors
      addStepError(currentStep);
      
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      return; // Don't proceed to next step
    }
    
    // Clear validation errors for this step
    setStepValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[currentStep];
      return newErrors;
    });
    
    // All validations passed, proceed to next step
    markStepCompleted(currentStep);
    removeStepError(currentStep);
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      showMessage(`✅ Step completed. Moving to ${steps[currentStep + 1].title}...`, 'success');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      showMessage(`Moved to step ${currentStep}`, 'info');
    }
  };

  const goToStep = (step) => {
    if (step <= currentStep || (step === 9 && stepCompletion.slice(0, 9).every(completed => completed))) {
      setCurrentStep(step);
      showMessage(`Navigated to ${steps[step].title}`, 'info');
    }
  };

  const handleSubmit = async () => {
  try {
    showMessage('Submitting registration...', 'info');
    
    const result = await registerPatientWithValidation(formData);
    
    if (result.success) {
      showMessage(`✅ ${result.message} Patient ID: ${result.patientId}`, 'success');
      // Clear form or redirect here
    } else {
      showMessage(`❌ ${result.message}`, 'error');
    }
  } catch (error) {
    showMessage('❌ Registration failed. Please try again.', 'error');
    console.error('Submission error:', error);
  }
};

  const clearCurrentStep = () => {
    clearStep(currentStep);
    showMessage('Current step cleared', 'info');
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans antialiased flex flex-col items-center justify-center py-8">
      {/* Message Box */}
      {message.show && (
        <div className={`fixed top-4 right-4 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 z-50 ${
          message.type === 'error' ? 'bg-red-500' : 
          message.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
        }`}>
          {message.text}
        </div>
      )}

      {/* Header */}
      <div className="text-center mt-4 mb-6">
        <a href="#" className="text-blue-600 text-sm hover:underline">
          &larr; Back to Provider Directory
        </a>
        <h1 className="text-3xl font-bold mt-2 text-gray-800">
          Patient Management System
        </h1>
        <p className="text-gray-500">Your health, managed with care.</p>
      </div>

      {/* Main Form Container */}
      <div className="w-full max-w-4xl bg-white p-6 mt-6 rounded-lg shadow-lg">
        <h1 className="text-xl font-bold text-center mb-4">
          New Patient Registration
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Please complete all steps to create your profile.
        </p>

        {/* Step Indicator */}
        <StepIndicator 
          currentStep={currentStep}
          steps={steps}
          stepCompletion={stepCompletion}
          editedSteps={editedSteps}
          stepsWithErrors={stepsWithErrors}
          goToStep={goToStep}
        />

        {/* Form Content */}
        <div className="mt-8">
          <CurrentComponent
            formData={formData}
            updateFormData={updateFormData}
            updateMedicalData={updateMedicalData}
            currentStep={currentStep}
            markStepCompleted={markStepCompleted}
            addStepError={addStepError}
            removeStepError={removeStepError}
            realSSN={realSSN}
            setRealSSN={setRealSSN}
            goToStep={goToStep}
            validationErrors={stepValidationErrors[currentStep] || {}}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={prevStep}
            className={`bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors ${
              currentStep === 0 ? 'invisible' : ''
            }`}
          >
            <i className="fas fa-arrow-left mr-2"></i>Previous
          </button>

          <button
            type="button"
            onClick={clearCurrentStep}
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors ml-auto"
          >
            Clear
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={nextStep}
              className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors ml-auto"
            >
              Next<i className="fas fa-arrow-right ml-2"></i>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors ml-auto"
            >
              <i className="fas fa-check mr-2"></i>Submit Registration
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;