import React from 'react';

const StepIndicator = ({ currentStep, steps, stepCompletion, editedSteps, stepsWithErrors, goToStep }) => {
  const progressPercentage = (currentStep / (steps.length - 1)) * 100;

  const getStepIcon = (stepIndex, title) => {
    const icons = {
      'Personal': 'fa-user',
      'Contact': 'fa-phone', 
      'Address': 'fa-map-marker-alt',
      'Employment': 'fa-briefcase',
      'Pharmacy': 'fa-pills',
      'Insurance': 'fa-id-card',
      'Medical': 'fa-heartbeat',
      'Consent': 'fa-check-circle',
      'Preferences': 'fa-comments',
      'Review': 'fa-eye'
    };
    return icons[title] || 'fa-circle';
  };

  const getStepState = (index) => {
    if (stepsWithErrors.has(index)) return 'error';
    if (index < currentStep) {
      if (editedSteps.has(index)) return 'editing';
      return 'completed';
    }
    if (index === currentStep) return 'active';
    return 'inactive';
  };

  return (
    <div className="flex justify-between items-center mb-8 relative">
      {/* Background line */}
      <div className="absolute inset-x-0 h-1 bg-gray-200 top-[40%] transform -translate-y-1/2 z-0"></div>
      
      {/* Progress fill line */}
      <div 
        className="absolute left-0 h-1 bg-green-600 top-[40%] transform -translate-y-1/2 z-10 transition-all duration-300 ease-in-out"
        style={{ width: `${progressPercentage}%` }}
      ></div>
      
      {/* Progress Steps */}
      {steps.map((step, index) => {
        const state = getStepState(index);
        
        return (
          <div key={index} className="flex flex-col items-center relative z-20 flex-1 px-2">
            <div 
              className={`step-icon ${state} cursor-pointer`}
              onClick={() => goToStep(index)}
            >
              <i className={`fas ${getStepIcon(index, step.title)}`}></i>
            </div>
            <span className={`text-sm mt-2 text-center ${
              index === currentStep ? 'text-purple-600 font-semibold' : 'text-gray-500'
            }`}>
              {step.title}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;