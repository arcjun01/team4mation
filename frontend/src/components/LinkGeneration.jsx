import React from 'react';
import '../css/LinkGeneration.css';

const LinkGeneration = () => {
  return (
    <div className="link-page-container">
      <div className="card-container">
        <h2 className="card-title">Student Survey Link</h2>
        
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Copy the link or click Share to send it via Outlook.
        </p>
        
        <div className="url-box" style={{ 
          background: '#f1f3f5', 
          padding: '15px 30px', 
          borderRadius: '8px', 
          border: '1px solid #dee2e6',
          color: '#007bff'
        }}>
          https://www.studentsurveyexample.com
        </div>
      </div>
    </div>
  );
};

export default LinkGeneration;