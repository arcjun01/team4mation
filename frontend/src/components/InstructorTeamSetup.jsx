import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/InstructorSetup.css';
import Header from './Header';
import ConfirmationModal from './ConfirmationModal';

const InstructorTeamSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const savedData = location.state?.formData;

  // 1. Initial state including 'useGpa'
  const [formData, setFormData] = useState(savedData || {
    courseName: '',
    classSize: '',
    minSize: '',
    maxSize: '',
    prevCourse: '',
    useGpa: false 
  });

  // States for Secure Key Generation
  const [generatedKey, setGeneratedKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [hasSavedKey, setHasSavedKey] = useState(false);

  // Validation and confirmation states
  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Function to generate a secure 32-character hex key
  const handleGenerateKey = () => {
    const randomKey = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0')).join('');
    setGeneratedKey(randomKey);
    clearError('key');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle checkbox separately
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
      clearError(name);
      return;
    }

    if ((name === 'minSize' || name === 'maxSize' || name === 'classSize') && value !== '') {
      if (parseInt(value) < 1) return;
    }
    setFormData({ ...formData, [name]: value });
    clearError(name);
  };

  const clearError = (field) => {
    setErrors(prev => ({
      ...prev,
      [field]: ""
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    // Validate courseName
    if (!formData.courseName.trim()) {
      newErrors.courseName = "Please enter a course name.";
    }

    // Validate classSize
    if (!formData.classSize || parseInt(formData.classSize, 10) < 1) {
      newErrors.classSize = "Please enter a valid class size.";
    }

    // Validate maxSize
    if (!formData.maxSize || parseInt(formData.maxSize, 10) < 1) {
      newErrors.maxSize = "Please enter a valid max group size.";
    }

    // Validate minSize if provided
    if (formData.minSize && parseInt(formData.minSize, 10) < 1) {
      newErrors.minSize = "Min size must be at least 1.";
    }

    // Validate that minSize <= maxSize
    if (formData.minSize && formData.maxSize) {
      const min = parseInt(formData.minSize, 10);
      const max = parseInt(formData.maxSize, 10);
      if (min > max) {
        newErrors.minSize = "Min size cannot be greater than max size.";
      }
    }

    // Validate useGpa - prevCourse is required if useGpa is true
    if (formData.useGpa && !formData.prevCourse.trim()) {
      newErrors.prevCourse = "Please enter the prerequisite course name.";
    }

    // Validate key generation and confirmation
    if (!generatedKey) {
      newErrors.key = "Please generate a decryption key.";
    }

    if (!hasSavedKey) {
      newErrors.saveConfirm = "Please confirm that you have saved the decryption key.";
    }

    setErrors(newErrors);

    // If there are errors, don't submit
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Show confirmation modal if all validations pass
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    setShowConfirmation(false);
    const uniqueId = crypto.randomUUID(); 

    // Coerce numbers and handle optional fields
    const payload = {
      uniqueId,
      courseName: formData.courseName,
      classSize: formData.classSize !== '' ? parseInt(formData.classSize, 10) : null,
      maxSize: formData.maxSize !== '' ? parseInt(formData.maxSize, 10) : null,
      minSize: formData.minSize !== '' ? parseInt(formData.minSize, 10) : null,
      useGpa: formData.useGpa ? 1 : 0,
      prevCourse: formData.prevCourse || null,
      // Include the salt/key for the database encryption process
      encryptionSalt: generatedKey
    };

    try {
      const response = await fetch('http://localhost:3001/api/config/save-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        console.log("Configuration Saved to DB");
        navigate(`/generate-link/${uniqueId}`, { state: { formData } });
      } else {
        const errorInfo = await response.json().catch(() => ({}));
        console.error("Save failed:", errorInfo);
        alert("Failed to save configuration: " + (errorInfo.error || response.statusText));
      }
    } catch (error) {
      console.error("Error connecting to server:", error);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <Header variant="page" />
      <div className="setup-wrapper">
      <div className="setup-container">
        <div className='question-container'><h1>Setting Up Student Surveys</h1></div>

        <div className="setup-card info-card">
          <p>Once you complete this setup, a link to a customized student survey will be generated.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="question-container">
            <label htmlFor="courseName">For which course is this team set-up for?</label>
            <input 
              id="courseName"
              className="input-field full-input"
              type="text" 
              name="courseName" 
              value={formData.courseName} 
              onChange={handleChange} 
              placeholder="e.g., SDEV 100"
            />
            {errors.courseName && <div className="error-message">{errors.courseName}</div>}
          </div>

          <div className="question-container">
            <label htmlFor="classSize">Enter or adjust class size</label>
            <input 
              id="classSize"
              className="input-field numeric-input"
              type="number" 
              name="classSize" 
              value={formData.classSize} 
              onChange={handleChange} 
              placeholder="20"
            />
            {errors.classSize && <div className="error-message">{errors.classSize}</div>}
          </div>

          <div className="question-container">
            <label>Enter or adjust group size</label>
            <div className="size-inputs">
              <div className="input-group">
                <span>Min:</span>
                <input 
                  className="input-field numeric-input"
                  type="number" 
                  name="minSize" 
                  placeholder="3" 
                  value={formData.minSize} 
                  onChange={handleChange} 
                />
              </div>
              <div className="input-group">
                <span>Max:</span>
                <input 
                  className="input-field numeric-input"
                  type="number" 
                  name="maxSize" 
                  placeholder="4" 
                  value={formData.maxSize} 
                  onChange={handleChange} 
                />
              </div>
            </div>
            {errors.minSize && <div className="error-message">{errors.minSize}</div>}
            {errors.maxSize && <div className="error-message">{errors.maxSize}</div>}
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
                name="prevCourse" 
                value={formData.prevCourse} 
                onChange={handleChange} 
                placeholder="e.g., SDEV 90"
              />
              {errors.prevCourse && <div className="error-message">{errors.prevCourse}</div>}
            </div>
          )}

          {/* Secure Data Access Key Section */}
          <div className="question-container">
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
                    onChange={(e) => {
                      setHasSavedKey(e.target.checked);
                      if (e.target.checked) clearError('saveConfirm');
                    }} 
                  />
                  <label htmlFor="saveConfirm" style={{ color: '#60a328', fontWeight: 'bold' }}>
                    I have saved this key. I understand it cannot be recovered.
                  </label>
                </div>
                {errors.saveConfirm && <div className="error-message">{errors.saveConfirm}</div>}
              </div>
            )}
            {errors.key && <div className="error-message">{errors.key}</div>}
          </div>

          <div className="button-group">
            <button 
              type="button" 
              className="button"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="button"
            >
              Create Student Survey
            </button>
          </div>
        </form>
      </div>
    </div>

    <ConfirmationModal 
      isOpen={showConfirmation}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
    </>
  );
};

export default InstructorTeamSetup;