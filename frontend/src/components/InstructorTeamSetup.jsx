import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/InstructorSetup.css';

const InstructorTeamSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const savedData = location.state?.formData;

  // 1. Initial state including 'useGpa'
  const [formData, setFormData] = useState(savedData || {
    courseName: '',
    classSize: '',
    teamLimit: '4',
    limitType: 'Maximum', 
    prevCourse: '',
    useGpa: false
  });

  // States for Secure Key Generation
  const [generatedKey, setGeneratedKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [hasSavedKey, setHasSavedKey] = useState(false);

  // Helper function to calculate errors for inline display
  const getTeamSizeError = () => {
    const limit = parseInt(formData.teamLimit, 10);
    const totalStudents = parseInt(formData.classSize, 10);

    if (!formData.teamLimit) return null;
    if (limit < 2) return "Team size must be at least 2."; 
    if (totalStudents && limit > totalStudents) return "Team size cannot be greater than the total class size."; 
    return null;
  };

  const teamSizeError = getTeamSizeError();

  // Function to generate a secure 32-character hex key
  const handleGenerateKey = () => {
    const randomKey = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0')).join('');
    setGeneratedKey(randomKey);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle checkbox separately
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
      return;
    }
    if ((name === 'teamLimit' || name === 'classSize' ) && value !== '') {
      if (parseInt(value) < 1) return;
    }
    setFormData({ ...formData, [name]: value });
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    if (teamSizeError) return;

    const uniqueId = crypto.randomUUID(); 
    
  const payload = {
    uniqueId: uniqueId ?? null,
    courseName: formData.courseName?.trim() || null,
    classSize: parseInt(formData.classSize, 10) || null,
    teamLimit: parseInt(formData.teamLimit, 10) || null,
    limitType: formData.limitType ?? 'Maximum',
    useGpa: formData.useGpa ? 1 : 0,
    prevCourse: (formData.useGpa && formData.prevCourse?.trim() !== "") 
      ? formData.prevCourse.trim() 
      : null,
    encryptionSalt: generatedKey || null
};

    console.log("Payload being sent:", payload);

    try {
      const response = await fetch('http://localhost:3001/api/config/save-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        navigate(`/generate-link/${uniqueId}`, { state: { formData } });
      } else {
        const errorInfo = await response.json();
        console.error("Save failed details:", errorInfo.details); 
        alert("Failed to save: " + errorInfo.details);
      }
    } catch (error) {
      console.error("Connection Error:", error);
    }
};

  return (
    <div className="setup-wrapper">
      <div className="setup-container">
        <div className="setup-card header-card">
          <h1 className="setup-title">Setting Up Student Surveys</h1>
        </div>

        <div className="setup-card info-card">
          <p>Once you complete this setup, a link to a customized student survey will be generated.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="setup-card">
            <label htmlFor="courseName">For which course is this team set-up for?</label>
            <input 
              id="courseName"
              className="input-field full-input"
              type="text" 
              required
              name="courseName" 
              value={formData.courseName} 
              onChange={handleChange} 
              placeholder="e.g., SDEV 100"
            />
          </div>

          <div className="setup-card">
            <label htmlFor="classSize">Enter or adjust class size</label>
            <input 
              id="classSize"
              className="input-field numeric-input"
              type="number" 
              required
              name="classSize" 
              value={formData.classSize} 
              onChange={handleChange} 
              placeholder="20"
            />
          </div>

          <div className="setup-card">
            <label>Select team size constraint</label>
            <div className="size-inputs" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <select 
                name="limitType" 
                value={formData.limitType} 
                onChange={handleChange}
                className="input-field"
                style={{ padding: '8px' }}
              >
                <option value="Minimum">Minimum</option>
                <option value="Maximum">Maximum</option>
              </select>
              <span>team size:</span>
              <input 
                name="teamLimit" 
                type="number" 
                required 
                className={`input-field numeric-input ${teamSizeError ? 'input-error' : ''}`} 
                value={formData.teamLimit} 
                onChange={handleChange} 
                placeholder="4" 
              />
            </div>
            {/* Inline Error Message displayed under the question */}
            {teamSizeError && (
              <p style={{ color: '#d9534f', fontSize: '14px', marginTop: '8px', fontWeight: 'bold' }}>
                {teamSizeError}
              </p>
            )}
          </div>

          {/* Question 4: The Optional Checkbox */}
          <div className="setup-card checkbox-section">
            <div className="checkbox-row">
              <input 
                type="checkbox" 
                id="useGpa" 
                name="useGpa"
                checked={formData.useGpa}
                onChange={handleChange}
              />
              <label htmlFor="useGpa">Factor prerequisite GPA into team formation</label>
            </div>
          </div>

          {/* Conditional Question: Only shows if useGpa is true */}
          {formData.useGpa && (
            <div className="setup-card fade-in">
              <label htmlFor="prevCourse">Enter the name of the prerequisite course</label>
              <input 
                id="prevCourse"
                className="input-field full-input"
                type="text" 
                required={formData.useGpa} 
                name="prevCourse" 
                value={formData.prevCourse} 
                onChange={handleChange} 
                placeholder="e.g., SDEV 90"
              />
            </div>
          )}

          {/* Secure Data Access Key Section */}
          <div className="setup-card">
            <label>Secure Data Access Key</label>
            <p className="info-card p" style={{ marginBottom: '15px' }}>
              Generate a key to decrypt student names later.
            </p>
            <p> <strong> NOTE: The system will not save this key.</strong> </p>
            
            {!generatedKey ? (
              <button type="button" className="btn-cancel" style={{ backgroundColor: '#fff', border: '1px solid #ccc' }} onClick={handleGenerateKey}>
                Generate Decryption Key
              </button>
            ) : (
              <div className="key-display-section">
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                  <input 
                    className="input-field full-input"
                    type={showKey ? "text" : "password"} 
                    value={generatedKey} 
                    readOnly 
                  />
                  <button type="button" className="btn-cancel" style={{ padding: '10px 20px' }} onClick={() => setShowKey(!showKey)}>
                    {showKey ? "Hide" : "Reveal"}
                  </button>
                  <button type="button" className="btn-cancel" style={{ padding: '10px 20px' }} onClick={() => {
                    navigator.clipboard.writeText(generatedKey);
                    alert("Key copied to clipboard!");
                  }}>Copy</button>
                </div>
                
                <div className="checkbox-row">
                  <input 
                    type="checkbox" 
                    id="saveConfirm" 
                    checked={hasSavedKey} 
                    onChange={(e) => setHasSavedKey(e.target.checked)} 
                  />
                  <label htmlFor="saveConfirm" style={{ color: '#d9534f', fontWeight: 'bold' }}>
                    I have saved this key. I understand it cannot be recovered.
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="button-group">
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-create"
              disabled={!hasSavedKey} 
            >
              Create Student Survey
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InstructorTeamSetup;