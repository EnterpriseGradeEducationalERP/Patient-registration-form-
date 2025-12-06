// components/ReviewPage.jsx
import React, { useState, useEffect } from 'react';

const ReviewPage = ({ formData, goToStep }) => {
  const [collapsedSections, setCollapsedSections] = useState({});

  useEffect(() => {
    // Initialize all sections as expanded
    const sections = [
      'personal', 'contact', 'address', 'employment', 'pharmacy',
      'insurance', 'medical', 'preferences'
    ];
    const initialCollapsed = {};
    sections.forEach(section => {
      initialCollapsed[section] = false;
    });
    setCollapsedSections(initialCollapsed);
  }, []);

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatPhone = (phone) => {
    if (!phone) return '-';
    return phone;
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US');
  };

  const formatSSN = (ssn) => {
    if (!ssn) return '-';
    return ssn;
  };

  const ReviewSection = ({ id, title, step, children }) => (
    <section id={id} className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <div className="flex justify-between items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => toggleSection(id)}
        >
          <i className={`fas ${
            collapsedSections[id] ? 'fa-chevron-down' : 'fa-chevron-up'
          } text-gray-500 transition-transform`}></i>
          <h4 className="font-semibold text-lg">{title}</h4>
        </div>
        <button 
          type="button" 
          className="text-purple-600 hover:underline"
          onClick={() => goToStep(step)}
        >
          Edit
        </button>
      </div>
      
      {!collapsedSections[id] && (
        <div className="mt-3">
          <div className="text-gray-700 text-sm space-y-1">
            {children}
          </div>
        </div>
      )}
    </section>
  );

  const ReviewField = ({ label, value, fieldId, step }) => (
    <div id={`review-${fieldId}`}>
      <strong>{label}:</strong>{' '}
      <a
        href="javascript:void(0)"
        onClick={() => goToStep(step)}
        className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-all duration-200"
      >
        {value || '-'}
      </a>
    </div>
  );

  return (
    <div className="step-content">
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 max-w-4xl mx-auto">
        <h3 className="text-2xl font-semibold mb-4 text-center">Review Your Information</h3>
        <p className="text-center text-gray-600 mb-8">
          Please review all details below. You can edit any section before final submission.
        </p>

        {/* Personal Information */}
        <ReviewSection id="personal" title="Personal Information" step={0}>
          <ReviewField label="First Name" value={formData.personal?.firstName} fieldId="firstName" step={0} />
          <ReviewField label="Middle Name" value={formData.personal?.middleName} fieldId="middleName" step={0} />
          <ReviewField label="Last Name" value={formData.personal?.lastName} fieldId="lastName" step={0} />
          <ReviewField label="Date of Birth" value={formatDate(formData.personal?.dob)} fieldId="dob" step={0} />
          <ReviewField label="Gender" value={formData.personal?.gender} fieldId="gender" step={0} />
          <ReviewField label="Marital Status" value={formData.personal?.maritalStatus} fieldId="maritalStatus" step={0} />
          <ReviewField label="SSN" value={formatSSN(formData.personal?.ssn)} fieldId="ssn" step={0} />
          <ReviewField label="Patient Identity Document" value={formData.personal?.identityDocument} fieldId="identityUpload" step={0} />
          <ReviewField label="Patient Photo" value={formData.personal?.patientPhoto} fieldId="photoUpload" step={0} />
        </ReviewSection>

        {/* Contact Information */}
        <ReviewSection id="contact" title="Contact Information" step={1}>
          <ReviewField label="Email" value={formData.contact?.email} fieldId="email" step={1} />
          <ReviewField label="Primary Contact" value={formatPhone(formData.contact?.primaryContact)} fieldId="primaryContact" step={1} />
          <ReviewField label="Secondary Contact" value={formatPhone(formData.contact?.secondaryContact)} fieldId="secondaryContact" step={1} />
          <ReviewField label="Emergency Contact Name" value={formData.contact?.emergencyName} fieldId="emergencyName" step={1} />
          <ReviewField label="Emergency Contact Number" value={formatPhone(formData.contact?.emergencyContact)} fieldId="emergencyContact" step={1} />
          <ReviewField label="Preferred Mode" value={formData.contact?.preferredMode} fieldId="preferredMode" step={1} />
        </ReviewSection>

        {/* Address Information */}
        <ReviewSection id="address" title="Address Information" step={2}>
          <ReviewField label="Residential Apt No" value={formData.address?.resApt} fieldId="resApt" step={2} />
          <ReviewField label="Residential Address 1" value={formData.address?.resAddress1} fieldId="resAddress1" step={2} />
          <ReviewField label="Residential Address 2" value={formData.address?.resAddress2} fieldId="resAddress2" step={2} />
          <ReviewField label="Residential Street" value={formData.address?.resStreet} fieldId="resStreet" step={2} />
          <ReviewField label="Residential City" value={formData.address?.resCity} fieldId="resCity" step={2} />
          <ReviewField label="Residential State" value={formData.address?.resState} fieldId="resState" step={2} />
          <ReviewField label="Residential ZIP Code" value={formData.address?.resZip} fieldId="resZip" step={2} />
          
          <hr className="my-2" />
          
          <ReviewField label="Mailing Apt" value={formData.address?.mailApt} fieldId="mailApt" step={2} />
          <ReviewField label="Mailing Address 1" value={formData.address?.mailAddress1} fieldId="mailAddress1" step={2} />
          <ReviewField label="Mailing Address 2" value={formData.address?.mailAddress2} fieldId="mailAddress2" step={2} />
          <ReviewField label="Mailing Street" value={formData.address?.mailStreet} fieldId="mailStreet" step={2} />
          <ReviewField label="Mailing City" value={formData.address?.mailCity} fieldId="mailCity" step={2} />
          <ReviewField label="Mailing State" value={formData.address?.mailState} fieldId="mailState" step={2} />
          <ReviewField label="Mailing ZIP Code" value={formData.address?.mailZip} fieldId="mailZip" step={2} />
        </ReviewSection>

        {/* Employment Details */}
        <ReviewSection id="employment" title="Employment Details" step={3}>
          <ReviewField label="Employment Status" value={formData.employment?.employmentStatus} fieldId="employmentStatus" step={3} />
          <ReviewField label="Occupation" value={formData.employment?.occupation} fieldId="occupation" step={3} />
          <ReviewField label="Annual Income" value={formData.employment?.income} fieldId="income" step={3} />
        </ReviewSection>

        {/* Pharmacy Information */}
        <ReviewSection id="pharmacy" title="Pharmacy Information" step={4}>
          <ReviewField label="Area ZIP Code" value={formData.pharmacy?.zipCode} fieldId="zipCode" step={4} />
          <ReviewField label="Preferred Pharmacy Location" value={formData.pharmacy?.pharmacyInput} fieldId="pharmacyInput" step={4} />
        </ReviewSection>

        {/* Insurance Details */}
        <ReviewSection id="insurance" title="Insurance Details" step={5}>
          <ReviewField label="Insurance Provider" value={formData.insurance?.provider} fieldId="provider" step={5} />
          <ReviewField label="Policy Number" value={formData.insurance?.policy} fieldId="policy" step={5} />
          <ReviewField label="Group ID" value={formData.insurance?.group} fieldId="group" step={5} />
          <ReviewField label="Effective Date" value={formatDate(formData.insurance?.effective)} fieldId="effective" step={5} />
          <ReviewField label="Termination Date" value={formatDate(formData.insurance?.termination)} fieldId="termination" step={5} />
          
          {(formData.insurance?.provider2 || formData.insurance?.policy2) && (
            <>
              <hr className="my-2" />
              <ReviewField label="Secondary Insurance Provider" value={formData.insurance?.provider2} fieldId="provider2" step={5} />
              <ReviewField label="Secondary Policy Number" value={formData.insurance?.policy2} fieldId="policy2" step={5} />
              <ReviewField label="Secondary Group ID" value={formData.insurance?.group2} fieldId="group2" step={5} />
              <ReviewField label="Secondary Effective Date" value={formatDate(formData.insurance?.effective2)} fieldId="effective2" step={5} />
              <ReviewField label="Secondary Termination Date" value={formatDate(formData.insurance?.termination2)} fieldId="termination2" step={5} />
            </>
          )}
        </ReviewSection>

        {/* Medical History */}
        <ReviewSection id="medical" title="Medical History" step={6}>
          <ReviewField label="Height" value={formData.medical?.heightValue} fieldId="heightValue" step={6} />
          <ReviewField label="Weight" value={formData.medical?.weightValue} fieldId="weightValue" step={6} />
          <ReviewField label="Blood Pressure" value={formData.medical?.bpValue} fieldId="bpValue" step={6} />
          <ReviewField 
            label="Diagnoses" 
            value={formData.medical?.diagnoses?.join(', ') || '-'} 
            fieldId="diagnosisList" 
            step={6} 
          />
          <ReviewField 
            label="Allergies" 
            value={formData.medical?.allergies?.join(', ') || '-'} 
            fieldId="allergyList" 
            step={6} 
          />
          <ReviewField 
            label="Surgeries" 
            value={formData.medical?.surgeries?.join(', ') || '-'} 
            fieldId="surgeryList" 
            step={6} 
          />
          <ReviewField 
            label="Medications & Supplements" 
            value={formData.medical?.medications?.join(', ') || '-'} 
            fieldId="medList" 
            step={6} 
          />
          <ReviewField label="Family Medical History" value={formData.medical?.familyHistory} fieldId="familyHistory" step={6} />
        </ReviewSection>

        {/* Preferences */}
        <ReviewSection id="preferences" title="Preferences" step={8}>
          <ReviewField label="Language" value={formData.preferences?.language} fieldId="language" step={8} />
          <ReviewField label="Communication" value={formData.preferences?.commMethod} fieldId="communication" step={8} />
          <ReviewField label="Documentation Method" value={formData.preferences?.delivery} fieldId="delivery" step={8} />
        </ReviewSection>

        {/* Consent Forms Status */}
        <section className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-lg">Consent Forms</h4>
            <button 
              type="button" 
              className="text-purple-600 hover:underline"
              onClick={() => goToStep(7)}
            >
              Edit
            </button>
          </div>
          <div className="mt-3 text-gray-700 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div><strong>General Treatment Consent:</strong> {formData.consent?.form1?.signed ? '✓ Signed' : '❌ Not Signed'}</div>
              <div><strong>HIPAA Authorization:</strong> {formData.consent?.form2?.signed ? '✓ Signed' : '❌ Not Signed'}</div>
              <div><strong>Financial Responsibility:</strong> {formData.consent?.form3?.signed ? '✓ Signed' : '❌ Not Signed'}</div>
              <div><strong>Release of Information:</strong> {formData.consent?.form4?.signed ? '✓ Signed' : '❌ Not Signed'}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ReviewPage;