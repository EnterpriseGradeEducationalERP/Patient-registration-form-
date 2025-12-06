import { useState, useEffect } from 'react';

export const useFormState = () => {
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('patientRegistration');
    const defaultData = {
      personal: {},
      contact: {},
      address: {},
      employment: {},
      pharmacy: {},
      insurance: {},
      medical: {
        diagnoses: [],
        allergies: [],
        surgeries: [],
        medications: []
      },
      consent: {},
      preferences: {}
    };
    return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [stepCompletion, setStepCompletion] = useState(Array(10).fill(false));
  const [editedSteps, setEditedSteps] = useState(new Set());
  const [stepsWithErrors, setStepsWithErrors] = useState(new Set());
  const [realSSN, setRealSSN] = useState('');

  useEffect(() => {
    localStorage.setItem('patientRegistration', JSON.stringify(formData));
  }, [formData]);

  const updateFormData = (step, data) => {
    setFormData(prev => ({
      ...prev,
      [step]: { ...prev[step], ...data }
    }));
  };

  const updateMedicalData = (type, data) => {
    setFormData(prev => ({
      ...prev,
      medical: { ...prev.medical, [type]: data }
    }));
  };

  const clearStep = (stepIndex) => {
    const stepKeys = ['personal', 'contact', 'address', 'employment', 'pharmacy', 'insurance', 'medical', 'consent', 'preferences'];
    const stepKey = stepKeys[stepIndex];
    
    setFormData(prev => ({
      ...prev,
      [stepKey]: stepKey === 'medical' ? { diagnoses: [], allergies: [], surgeries: [], medications: [] } : {}
    }));
  };

  const markStepCompleted = (step) => {
    setStepCompletion(prev => {
      const newCompletion = [...prev];
      newCompletion[step] = true;
      return newCompletion;
    });
  };

  const addStepError = (step) => {
    setStepsWithErrors(prev => new Set([...prev, step]));
  };

  const removeStepError = (step) => {
    setStepsWithErrors(prev => {
      const newSet = new Set(prev);
      newSet.delete(step);
      return newSet;
    });
  };

  return {
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
  };
};