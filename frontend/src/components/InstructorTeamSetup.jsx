import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/InstructorSetup.css';

const InstructorTeamSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();


  const savedData = location.state?.formData;

  const [formData, setFormData] = useState(savedData || {
    courseName: '',
    classSize: '',
    minSize: '',
    maxSize: '',
    prevCourse: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Prevent numbers less than 1
    if ((name === 'minSize' || name === 'maxSize' || name === 'classSize') && value !== '') {
      if (parseInt(value) < 1) return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // To generate a unique ID for the survey
    const uniqueId = crypto.randomUUID(); 
    
    console.log("Team Criteria Saved:", formData);
    
    // Move to the link generation page with the new ID
    navigate(`/generate-link/${uniqueId}`);
  };

  return (
    <div className="setup-wrapper">
      <div className="setup-container">
        {/* Header */}
        <div className="setup-card header-card">
          <h1 className="setup-title">Setting Up Student Surveys</h1>
        </div>

        {/* Info Text */}
        <div className="setup-card info-card">
          <p>Once you complete this setup, a link to a customized student survey will be generated.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Question 1 */}
          <div className="setup-card">
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
          </div>

          {/* Question 2 */}
          <div className="setup-card">
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
          </div>

          {/* Question 3 */}
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
                  name="maxSize" 
                  placeholder="4" 
                  value={formData.maxSize} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          </div>

          {/* Question 4 */}
          <div className="setup-card">
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
          </div>

          {/* Buttons Section */}
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