import React from 'react';
import '../css/LinkGeneration.css';

const LinkGeneration = () => {
  const surveyUrl = "https://www.studentsurveyexample.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(surveyUrl);
    alert("Link copied to clipboard!"); 
  };

  return (
    <div className="link-page-container">
      <div className="card-container">
        <h2 className="card-title">Student Survey Link</h2>
        
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Copy the link or click Share to send it via Outlook.
        </p>
        
        <div className="action-row" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="url-box" style={{ 
            background: '#f1f3f5', 
            padding: '25px 30px', 
            borderRadius: '8px', 
            border: '1px solid #dee2e6',
            color: '#007bff'
          }}>
            {surveyUrl}
          </div>

          <div className="icon-group" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <button className="icon-btn" onClick={handleCopy} title="Copy Link">
              📋
            </button>
            <button className="icon-btn" title="Send via Outlook">
              ✉️
            </button>
          </div>
        </div>
      </div>
      
      <div className="footer-action-row">
        <button className="footer-btn">Edit Survey</button>
        <button className="footer-btn">Close Survey</button>
      </div>
    </div>
  );
};

export default LinkGeneration;