import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/InstructorSetup.css';

import Navbar from './Navbar';

const InstructorTeamSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const savedData = location.state?.formData;

  // 1. Initial state (Uses your Min/Max variable names)
  const [formData, setFormData] = useState(savedData || {
    courseName: '',
    description: '',
    classSize: '',
    teamLimit: '4',
    limitType: 'Maximum', 
    prevCourse: '',
    useGpa: false,
    availabilityOptional: false
  });

  // States for Secure Key, Validation (from Team), and Modal (from Team)
  const [generatedKey, setGeneratedKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [hasSavedKey, setHasSavedKey] = useState(false);
  const [errors, setErrors] = useState({});

  const buildGroupSizes = (totalStudents, teamLimit, limitType) => {
    if (!Number.isInteger(totalStudents) || !Number.isInteger(teamLimit) || totalStudents < 1 || teamLimit < 2) {
      return [];
    }

    const normalized = (limitType || '').toLowerCase();
    const isMin = normalized.startsWith('min');
    let groupCount = isMin
      ? Math.floor(totalStudents / teamLimit)
      : Math.ceil(totalStudents / teamLimit);

    groupCount = Math.max(1, groupCount);

    const baseSize = Math.floor(totalStudents / groupCount);
    const remainder = totalStudents % groupCount;
    const groups = Array.from({ length: groupCount }, (_, index) => (
      index < remainder ? baseSize + 1 : baseSize
    ));

    return groups;
  };

  const getPreview = () => {
    const totalStudents = parseInt(formData.classSize, 10);
    const teamLimit = parseInt(formData.teamLimit, 10);
    const groups = buildGroupSizes(totalStudents, teamLimit, formData.limitType);

    if (!Number.isInteger(totalStudents) || totalStudents < 1) {
      return {
        ready: false,
        message: 'Enter a valid class size to preview team formations.'
      };
    }

    if (totalStudents > 100) {
      return {
        ready: false,
        message: 'Class size must be between 1 and 100.'
      };
    }

    if (!Number.isInteger(teamLimit) || teamLimit < 2) {
      return {
        ready: false,
        message: 'Team size must be at least 2 to generate a preview.'
      };
    }

    if (teamLimit > totalStudents) {
      return {
        ready: false,
        message: 'Team size cannot be greater than class size.'
      };
    }

    const ruleLabel = formData.limitType === 'Minimum' ? 'Minimum team size' : 'Maximum team size';
    const summary = groups.length > 0
      ? (() => {
          const countsBySize = groups.reduce((acc, size) => {
            acc[size] = (acc[size] || 0) + 1;
            return acc;
          }, {});
          const parts = Object.entries(countsBySize)
            .sort((a, b) => Number(b[0]) - Number(a[0]))
            .map(([size, count]) => `${count} ${count === 1 ? 'group' : 'groups'} of ${size}`);
          return parts.join(' and ');
        })()
      : 'No valid grouping possible with current settings.';

    return {
      ready: true,
      ruleLabel,
      groupCount: groups.length,
      summary
    };
  };


  const handleGenerateKey = () => {
    const randomKey = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0')).join('');
    setGeneratedKey(randomKey);
    clearError('key');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
      clearError(name);
      return;
    }
    // Logic to prevent negative numbers
    if ((name === 'teamLimit' || name === 'classSize') && value !== '') {
      if (parseInt(value) < 1) return;
    }
    setFormData({ ...formData, [name]: value });
    clearError(name);
  };

  const clearError = (field) => {
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  // Merged Validation: Combines your Min/Max checks with their full-form check
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    const limit = parseInt(formData.teamLimit, 10);
    const totalStudents = parseInt(formData.classSize, 10);

    if (!formData.courseName.trim()) newErrors.courseName = "Please enter a course name.";
    if (!formData.classSize || totalStudents < 1) newErrors.classSize = "Please enter a valid class size.";
    else if (totalStudents > 100 ) newErrors.classSize = "Class size cannot exceed 100";
    // Integrated your logic here
    if (!formData.teamLimit || limit < 2) {
      newErrors.teamLimit = "Team size must be at least 2.";
    } else if (totalStudents && limit > totalStudents) {
      newErrors.teamLimit = "Team size cannot be greater than class size.";
    }

    if (formData.useGpa && !formData.prevCourse.trim()) {
      newErrors.prevCourse = "Prerequisite course is required.";
    }
    if (!generatedKey) newErrors.key = "Please generate a decryption key.";
    if (!hasSavedKey) newErrors.saveConfirm = "Please confirm you have saved the key.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    handleConfirm() 
  };

  //save logic 
  const handleConfirm = async () => {
    const token = localStorage.getItem('auth_token');
    const instructorEmail = token ? atob(token).split(':')[0] : null;
   
    const uniqueId = typeof crypto.randomUUID === 'function'
  ? crypto.randomUUID()
  : Math.random().toString(36).slice(2) + Date.now().toString(36); 
    
    const payload = {
      uniqueId: uniqueId,
      courseName: formData.courseName?.trim() || null,
      description: formData.description?.trim() || null,
      classSize: parseInt(formData.classSize, 10) || null,
      teamLimit: parseInt(formData.teamLimit, 10) || null,
      limitType: formData.limitType || 'Maximum',
      useGpa: formData.useGpa ? 1 : 0,
      prevCourse: (formData.useGpa && formData.prevCourse?.trim() !== "") ? formData.prevCourse.trim() : null,
      encryptionSalt: generatedKey || null,
      availabilityOptional: formData.availabilityOptional ? 1 : 0,
      instructorEmail: instructorEmail
    };

    try {
      const response = await fetch('/api/config/save-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        navigate(`/generate-link/${uniqueId}`, { state: { formData } });
      } else {
        const errorInfo = await response.json();
        alert("Failed to save: " + errorInfo.details);
      }
    } catch (error) {
      console.error("Connection Error:", error);
    }
  };

  
  const preview = getPreview();

  return (
    <div className="instructor-page-shell">
      <Navbar />
      <div className="instructor-page-content">
        <div className="setup-wrapper">
        <div className="content-container">
          <div className='question-container'><h1>Setting Up Student Surveys</h1></div>
          <div className="setup-card info-card">
            <p>Once you complete this setup, a link to a customized student survey will be generated.</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Course Name */}
            <div className="question-container">
              <label htmlFor="courseName">For which course is this team set-up for?</label>
              <input id="courseName" className="input-field full-input" type="text" name="courseName" value={formData.courseName} onChange={handleChange} placeholder="e.g., SDEV 100" />
              {errors.courseName && <span className="error-message">{errors.courseName}</span>}
            </div>

            {/* Description */}
            <div className="question-container">
              <label htmlFor="description">Description (Optional)</label>
              <textarea
                id="description"
                className="input-field full-input"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows="4"
              />
            </div>

            {/* Class Size */}
            <div className="question-container">
              <label htmlFor="classSize">Enter or adjust class size</label>
              <input id="classSize" className="input-field numeric-input" type="number" name="classSize" value={formData.classSize} onChange={handleChange} placeholder="20" />
              {errors.classSize && <span className="error-message">{errors.classSize}</span>}
            </div>

            {/*Min/Max Select and Team Limit Input */}
            <div className="question-container">
              <label>Select team size constraint</label>
              <div className="size-inputs">
                <select name="limitType" value={formData.limitType} onChange={handleChange} className="input-field limit-type-select">
                  <option value="Minimum">Minimum</option>
                  <option value="Maximum">Maximum</option>
                </select>
                <span>team size:</span>
                <input name="teamLimit" type="number" className="input-field numeric-input" value={formData.teamLimit} onChange={handleChange} placeholder="4" />
              </div>
              {errors.teamLimit && <span className="error-message">{errors.teamLimit}</span>}
            </div>

            <div className="setup-card">
              <label className="preview-title">Team Formation Preview</label>
              
              {preview.ready ? (
                <>
                  <p className="preview-line">
                    <strong>{preview.ruleLabel}:</strong> {formData.teamLimit}
                  </p>
                  <p className="preview-line">
                    <strong>Estimated groups:</strong> {preview.groupCount}
                  </p>
                  <p className="preview-summary">{preview.summary}</p>
                </>
              ) : (
                <p className="preview-warning">{preview.message}</p>
              )}
            </div>

            {/* GPA Checkbox */}
            <div className="setup-card checkbox-section">
              <div className="checkbox-row">
                <input type="checkbox" id="useGpa" name="useGpa" checked={formData.useGpa} onChange={handleChange} />
                <label htmlFor="useGpa">Factor prerequisite GPA into team formation</label>
              </div>
            </div>

            {/* Prerequisite Course */}
            {formData.useGpa && (
              <div className="setup-card fade-in">
                <label htmlFor="prevCourse">Enter the name of the prerequisite course</label>
                <input id="prevCourse" className="input-field full-input" type="text" name="prevCourse" value={formData.prevCourse} onChange={handleChange} placeholder="e.g., SDEV 90" />
                {errors.prevCourse && <span className="error-message">{errors.prevCourse}</span>}
              </div>
            )}

            <div className="setup-card checkbox-section">
              <div className="checkbox-row">
                <input
                  type="checkbox"
                  id="factorAvailability"
                  name="factorAvailability"
                  checked={!formData.availabilityOptional}
                  onChange={(e) => {
                    setFormData({ ...formData, availabilityOptional: !e.target.checked });
                    clearError('availabilityOptional');
                  }}
                />
                <label htmlFor="factorAvailability">Factor students' availability into team formation</label>
              </div>
            </div>

            {/* Decryption Key */}
            <div className="question-container">
              <label>Secure Data Access Key</label>
              <p className="key-description">⚠️ Save your decryption key to access and view students' names later. This key cannot be recovered once lost!</p>
              {!generatedKey ? (
                <button type="button" className="incript-button" onClick={handleGenerateKey}>Generate Decryption Key</button>
              ) : (
                <div className="key-display-section">
                  <div className="key-actions-row">
                    <input className="input-field full-input" type={showKey ? "text" : "password"} value={generatedKey} readOnly />
                    <button type="button" className="incript-button" onClick={() => setShowKey(!showKey)}>{showKey ? "Hide" : "Reveal"}</button>
                    <button type="button" className="incript-button" onClick={() => {
                      if (navigator.clipboard) {
    		      navigator.clipboard.writeText(generatedKey);
  		      } else {
    		        const el = document.createElement('textarea');
    		        el.value = generatedKey;
    		        document.body.appendChild(el);
    		        el.select();
    		        document.execCommand('copy');
                        document.body.removeChild(el);
                     }
                     alert("Key copied!");
                    }}>Copy</button>
                  </div>
                  <div className="checkbox-row">
                    <input type="checkbox" id="saveConfirm" checked={hasSavedKey} onChange={(e) => { setHasSavedKey(e.target.checked); if (e.target.checked) clearError('saveConfirm'); }} />
                    <label htmlFor="saveConfirm" className="save-confirm-label">I have saved this key. I understand it cannot be recovered.</label>
                  </div>
                  {errors.saveConfirm && <span className="error-message">{errors.saveConfirm}</span>}
                </div>
              )}
              {errors.key && <span className="error-message">{errors.key}</span>}
            </div>

            <div className="button-group">
              <button type="button" className="button" onClick={() => navigate(-1)}>Cancel</button>
              <button type="submit" className="button">Create Student Survey</button>
            </div>
          </form>
        </div>
      </div>

      
      </div>
    </div>
  );
};

export default InstructorTeamSetup;
