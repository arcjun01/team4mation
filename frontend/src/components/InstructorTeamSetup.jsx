import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/InstructorSetup.css';

const InstructorTeamSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const savedData = location.state?.formData;

  // 1. Add 'useGpa' to your initial state
  const [formData, setFormData] = useState(savedData || {
    courseName: '',
    classSize: '',
    minSize: '',
    maxSize: '',
    prevCourse: '',
    useGpa: false 
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle checkbox separately
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
      return;
    }

    if ((name === 'minSize' || name === 'maxSize' || name === 'classSize') && value !== '') {
      if (parseInt(value) < 1) return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const uniqueId = crypto.randomUUID(); 

  // coerce numbers and handle optional minSize
  const payload = {
    uniqueId,
    courseName: formData.courseName,
    classSize: formData.classSize !== '' ? parseInt(formData.classSize, 10) : null,
    maxSize: formData.maxSize !== '' ? parseInt(formData.maxSize, 10) : null,
    minSize: formData.minSize !== '' ? parseInt(formData.minSize, 10) : null,
    useGpa: formData.useGpa ? 1 : 0,
    prevCourse: formData.prevCourse || null,
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
                  required
                  name="maxSize" 
                  placeholder="4" 
                  value={formData.maxSize} 
                  onChange={handleChange} 
                />
              </div>
            </div>
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

          <div className="button-group">
            <button type="button" className="btn-cancel">Cancel</button>
            <button type="submit" className="btn-create">Create Student Survey</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InstructorTeamSetup;