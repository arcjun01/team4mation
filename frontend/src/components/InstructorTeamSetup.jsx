import React, { useState } from 'react';
import '../css/InstructorSetup.css';

const InstructorTeamSetup = () => {
  const [formData, setFormData] = useState({
    classSize: '',
    minSize: '',
    maxSize: '',
    prevCourse: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Team Criteria Saved:", formData);
    // WORK ON THIS NEXT: Add logic to navigate to the "Send Link" page 
    alert("Criteria saved! Moving to invitation screen...");
  };

  return (
    <div className="setup-container">
      <h1 className="setup-title">Instructor View: Team Setup</h1>
      <hr className="divider" />
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="classSize">Class Size:</label>
          <input 
            id="classSize"
            className="input-field small-input"
            type="number" 
            name="classSize" 
            value={formData.classSize} 
            onChange={handleChange} 
            placeholder="30"
          />
        </div>

        <div className="form-group">
          <label>Group Size:</label>
          <div className="size-inputs">
            <input 
              className="input-field small-input"
              type="number" 
              name="minSize" 
              placeholder="Min" 
              value={formData.minSize} 
              onChange={handleChange} 
            />
            <span>to</span>
            <input 
              className="input-field small-input"
              type="number" 
              name="maxSize" 
              placeholder="Max" 
              value={formData.maxSize} 
              onChange={handleChange} 
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="prevCourse">Previous Course Taken:</label>
          <input 
            id="prevCourse"
            className="input-field long-input"
            type="text" 
            name="prevCourse" 
            value={formData.prevCourse} 
            onChange={handleChange} 
            placeholder="e.g. CS 101"
          />
        </div>

        <button type="submit" className="create-button">
          Create
        </button>
      </form>
    </div>
  );
};

export default InstructorTeamSetup;