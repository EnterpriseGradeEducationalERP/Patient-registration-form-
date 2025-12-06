// components/ConsentForms.jsx
import React, { useState, useEffect, useRef } from 'react';
import SignatureCanvas from './SignatureCanvas';

const ConsentForms = ({ formData, updateFormData }) => {
  const [localData, setLocalData] = useState(formData.consent || {});
  const [activeModal, setActiveModal] = useState(null);
  const [signature, setSignature] = useState(null);
  const [signatureDate, setSignatureDate] = useState(null);

  const formTitles = {
    form1: 'General Treatment Consent',
    form2: 'HIPAA Authorization', 
    form3: 'Financial Responsibility Agreement',
    form4: 'Release of Information (ROI)'
  };

  const relationshipOptions = [
    'Patient', 'Parent', 'Sibling', 'Spouse', 'Legal Guardian', 'Authorized Representative'
  ];

  const formTexts = {
    form1: `General Treatment Consent\n\nPatient Name: {PATIENT_NAME}\nDate of Birth: {DOB}\n\nI hereby authorize...`,
    form2: `HIPAA Authorization Consent Form\n\nPatient Name: {PATIENT_NAME}\nDate of Birth: {DOB}\n\nAuthorization to Use...`,
    form3: `Financial Responsibility Agreement\n\nPatient Name: {PATIENT_NAME}\nDate of Birth: {DOB}\n\nPatient Financial Responsibility...`,
    form4: `Release of Information Consent\n\nPatient Name: {PATIENT_NAME}\nDate of Birth: {DOB}\nI hereby authorize...`
  };

  useEffect(() => {
    // Load signature from localStorage
    const savedSignature = localStorage.getItem('global_signature');
    const savedDate = localStorage.getItem('global_signature_date');
    if (savedSignature) {
      setSignature(savedSignature);
    }
    if (savedDate) {
      setSignatureDate(savedDate);
    } else if (savedSignature) {
      // If signature exists but no date, set current date
      const currentDate = new Date().toLocaleDateString();
      setSignatureDate(currentDate);
      localStorage.setItem('global_signature_date', currentDate);
    }
    
    setLocalData(formData.consent || {});
  }, [formData.consent]);

  const getPatientInfo = () => {
    const personal = formData.personal || {};
    return {
      name: [personal.firstName, personal.middleName, personal.lastName].filter(Boolean).join(' '),
      dob: personal.dob || ''
    };
  };

  const fillConsentTemplate = (formId, fieldData = {}) => {
    const patientInfo = getPatientInfo();
    let text = formTexts[formId]
      .replace(/{PATIENT_NAME}/g, patientInfo.name || '___________________________')
      .replace(/{DOB}/g, patientInfo.dob || '___________________________')
      .replace(/{RELATIONSHIP}/g, fieldData.relationship || '');

    // Add signature if exists
    if (signature) {
      text = text.replace('Signature: ___________________________', 'Signature: [SIGNED]');
    }

    if (signatureDate) {
      text = text.replace('Date Signed: ___________________________', `Date Signed: ${signatureDate}`);
    }

    return text;
  };

  const openModal = (formId) => {
    setActiveModal(formId);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleAgree = (formId) => {
    if (!signature) {
      alert('Please sign first before agreeing to the terms.');
      return;
    }

    const newData = {
      ...localData,
      [formId]: {
        signed: true,
        relationship: localData[formId]?.relationship || '',
        timestamp: new Date().toLocaleString(),
        signature: signature,
        signatureDate: signatureDate
      }
    };

    setLocalData(newData);
    updateFormData('consent', newData);
    
    // Save to localStorage
    localStorage.setItem('global_signature', signature);
    localStorage.setItem('global_signature_date', signatureDate);
    
    closeModal();
  };

  const clearAllConsents = () => {
    setSignature(null);
    setSignatureDate(null);
    const newData = {};
    setLocalData(newData);
    updateFormData('consent', newData);
    localStorage.removeItem('global_signature');
    localStorage.removeItem('global_signature_date');
  };

  const downloadFormPDF = (formId) => {
    if (!signature) {
      alert('Signature is required to download.');
      return;
    }

    // PDF generation logic using jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const formContent = fillConsentTemplate(formId, localData[formId]);
    
    doc.setFontSize(16);
    doc.text(formTitles[formId], 10, 15);
    
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(formContent, 180);
    let yPosition = 30;
    
    lines.forEach(line => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 10, yPosition);
      yPosition += 6;
    });

    // Add signature image
    if (signature) {
      const signatureImage = new Image();
      signatureImage.src = signature;
      signatureImage.onload = () => {
        doc.addImage(signatureImage, 'PNG', 10, yPosition + 10, 50, 20);
        doc.save(`${formTitles[formId].replace(/ /g, '_')}_Signed.pdf`);
      };
    }
  };

  const isFormSigned = (formId) => {
    return localData[formId]?.signed && signature;
  };

  const ConsentModal = ({ formId }) => {
    const [relationship, setRelationship] = useState(localData[formId]?.relationship || '');

    if (!activeModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
        <div className="bg-white rounded-lg w-[92%] max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold text-purple-800">{formTitles[formId]}</h2>
            <button className="text-gray-600 hover:text-gray-800" onClick={closeModal}>✕</button>
          </div>
          
          <div className="mt-4 text-sm text-gray-800 whitespace-pre-wrap">
            {fillConsentTemplate(formId, { relationship })}
          </div>
          
          {/* Relationship Field */}
          <div className="mt-4 p-4 border border-gray-300 rounded-md bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relationship to Patient:
            </label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select...</option>
              {relationshipOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Signature Canvas */}
          <div className="mt-4 p-4 border border-gray-300 rounded-md bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sign below:
              {signature && (
                <span className="ml-2 text-green-600 text-sm">✓ Signature saved</span>
              )}
            </label>
            <SignatureCanvas onSignatureChange={(sigData) => {
              setSignature(sigData);
              if (sigData) {
                setSignatureDate(new Date().toLocaleDateString());
                localStorage.setItem('global_signature', sigData);
                localStorage.setItem('global_signature_date', new Date().toLocaleDateString());
              }
            }} />
          </div>

          {/* Agree Button */}
          <div className="mt-4 p-3">
            <button
              onClick={() => handleAgree(formId)}
              className={`w-full py-2 px-4 rounded-md ${
                isFormSigned(formId) 
                  ? 'bg-green-600 text-white' 
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {isFormSigned(formId) ? '✓ Signed and Agreed' : 'I Agree with the Terms and Conditions'}
            </button>
          </div>

          {/* Download PDF */}
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => downloadFormPDF(formId)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              disabled={!isFormSigned(formId)}
            >
              Download as PDF
            </button>
            <button 
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Consent Forms</h3>
      
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-purple-600 text-white">
            <th className="p-3 border border-gray-300 text-left">Title</th>
            <th className="p-3 border border-gray-300 text-left">Current Date</th>
            <th className="p-3 border border-gray-300 text-left">Signature & Consent</th>
            <th className="p-3 border border-gray-300 text-left">Last Reviewed Date</th>
          </tr>
        </thead>
        <tbody>
          {['form1', 'form2', 'form3', 'form4'].map(formId => (
            <tr key={formId} className="border-t border-gray-300">
              <td className="p-3 border border-gray-300">
                <span className="text-red-500">*</span>
                <button
                  onClick={() => openModal(formId)}
                  className="text-purple-600 hover:text-purple-800 underline ml-1"
                >
                  {formTitles[formId]}
                </button>
              </td>
              <td className="p-3 border border-gray-300 text-sm">
                {isFormSigned(formId) ? new Date().toLocaleDateString() : ''}
              </td>
              <td className="p-3 border border-gray-300">
                {isFormSigned(formId) ? (
                  <div className="flex items-center">
                    <img src={signature} alt="Signature" className="h-8" />
                    <span className="ml-2 text-green-600">Signed</span>
                  </div>
                ) : (
                  <div className="not-signed text-red-500">Not Signed</div>
                )}
              </td>
              <td className="p-3 border border-gray-300 text-sm">
                {isFormSigned(formId) ? localData[formId]?.timestamp : ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Clear All Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={clearAllConsents}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Clear All Signatures
        </button>
      </div>

      {/* Modal */}
      <ConsentModal formId={activeModal} />
    </div>
  );
};

export default ConsentForms;