// components/MedicalHistory.jsx
import React, { useState, useEffect } from 'react';

const MedicalHistory = ({ formData, updateMedicalData }) => {
  const [localData, setLocalData] = useState(formData.medical || {
    diagnoses: [],
    allergies: [],
    surgeries: [],
    medications: [],
    heightValue: '',
    weightValue: '',
    bpValue: '',
    familyHistory: ''
  });

  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [newSurgery, setNewSurgery] = useState({ type: '', year: '' });
  const [newMedication, setNewMedication] = useState('');

  useEffect(() => {
    setLocalData(formData.medical || {
      diagnoses: [],
      allergies: [],
      surgeries: [],
      medications: [],
      heightValue: '',
      weightValue: '',
      bpValue: '',
      familyHistory: ''
    });
  }, [formData.medical]);

  const handleInputChange = (field, value) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    updateMedicalData('medical', newData);
  };

  const addMedicalItem = (type, value) => {
    if (!value || (typeof value === 'object' && (!value.type || !value.year))) return;

    const newArray = [...localData[type]];
    
    if (type === 'surgeries') {
      const surgery = `${value.type} (${value.year})`;
      if (!newArray.some(s => s.startsWith(value.type))) {
        newArray.push(surgery);
      }
    } else {
      if (!newArray.includes(value)) {
        newArray.push(value);
      }
    }

    const newData = { ...localData, [type]: newArray };
    setLocalData(newData);
    updateMedicalData('medical', newData);

    // Clear input fields
    if (type === 'diagnoses') setNewDiagnosis('');
    if (type === 'allergies') setNewAllergy('');
    if (type === 'surgeries') setNewSurgery({ type: '', year: '' });
    if (type === 'medications') setNewMedication('');
  };

  const removeMedicalItem = (type, index) => {
    const newArray = localData[type].filter((_, i) => i !== index);
    const newData = { ...localData, [type]: newArray };
    setLocalData(newData);
    updateMedicalData('medical', newData);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-xl font-semibold mb-4">Medical History</h3>

      {/* Vitals Section */}
      <div className="mb-6 bg-white p-4 rounded-lg border">
        <h4 className="text-lg font-semibold mb-3">Vitals</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Height */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Height</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={localData.heightValue || ''}
                onChange={(e) => handleInputChange('heightValue', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter height"
              />
              <select className="px-3 py-2 border border-gray-300 rounded-md">
                <option value="cm">cm</option>
                <option value="ft">ft</option>
              </select>
            </div>
          </div>

          {/* Weight */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Weight</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={localData.weightValue || ''}
                onChange={(e) => handleInputChange('weightValue', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter weight"
              />
              <select className="px-3 py-2 border border-gray-300 rounded-md">
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
              </select>
            </div>
          </div>

          {/* Blood Pressure */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Blood Pressure</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={localData.bpValue || ''}
                onChange={(e) => handleInputChange('bpValue', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter BP"
              />
              <select className="px-3 py-2 border border-gray-300 rounded-md">
                <option value="Systolic">Systolic</option>
                <option value="Diastolic">Diastolic</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnoses Section */}
      <div className="mb-6 bg-white p-4 rounded-lg border">
        <h4 className="text-lg font-semibold mb-3">Diagnoses</h4>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newDiagnosis}
            onChange={(e) => setNewDiagnosis(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g., Hypertension"
          />
          <button
            type="button"
            onClick={() => addMedicalItem('diagnoses', newDiagnosis)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {localData.diagnoses?.map((diagnosis, index) => (
            <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              {diagnosis}
              <button
                type="button"
                onClick={() => removeMedicalItem('diagnoses', index)}
                className="ml-1 text-purple-600 hover:text-purple-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Allergies Section */}
      <div className="mb-6 bg-white p-4 rounded-lg border">
        <h4 className="text-lg font-semibold mb-3">Allergies</h4>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newAllergy}
            onChange={(e) => setNewAllergy(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g., Penicillin"
          />
          <button
            type="button"
            onClick={() => addMedicalItem('allergies', newAllergy)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {localData.allergies?.map((allergy, index) => (
            <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
              {allergy}
              <button
                type="button"
                onClick={() => removeMedicalItem('allergies', index)}
                className="ml-1 text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Family History */}
      <div className="bg-white p-4 rounded-lg border">
        <h4 className="text-lg font-semibold mb-3">Family Medical History</h4>
        <textarea
          value={localData.familyHistory || ''}
          onChange={(e) => handleInputChange('familyHistory', e.target.value)}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="e.g., Father - Hypertension; Mother - Type 2 Diabetes"
        />
      </div>
    </div>
  );
};

export default MedicalHistory;