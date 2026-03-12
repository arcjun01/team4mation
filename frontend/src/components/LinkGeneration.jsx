import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../css/LinkGeneration.css';
import largeHeaderImg from '../assets/largeHeader.svg';

const LinkGeneration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const formData = location.state?.formData;
  const surveyUrl = `/team4mation/survey/${id}`;

  const handleEdit = () => {
    navigate('/setup', { state: { formData } });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(surveyUrl);
    alert("Unique link copied to clipboard!");
  };

  const handleEmailClick = () => {
    const subject = encodeURIComponent("Action Required: Student Survey");
    const body = encodeURIComponent(`Please complete the team survey at this link: ${surveyUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleViewStatus = () => {
    navigate(`/instructor/decrypt/${id}`);
  };

  return (
    <div className="link-page-wrapper">
      <header className="link-page-header">
        <img
          src={largeHeaderImg}
          alt="Team4mation header"
          className="link-page-header-image"
        />
      </header>
    <div className="link-page-container">
      <div className="card-container">
        <h2 className="card-title">Student Survey Link</h2>
        
        <p className="instruction-text" style={{ color: '#666', marginBottom: '20px' }}>
          Copy the link or click the mail icon to share it with your students via Outlook.
        </p>
        
        <div className="action-row">
          <a href={surveyUrl} target="_blank" rel="noopener noreferrer" className="url-box">
            {surveyUrl}
          </a>

          <div className="icon-group">
            <button className="icon-btn" onClick={handleCopy} title="Copy Link">
              📋
            </button>
            <button className="icon-btn" onClick={handleEmailClick} title="Send via Outlook">
              ✉️
            </button>
          </div>
        </div>
      </div>
      
      <div className="footer-action-row">
        <button className="footer-btn" onClick={handleEdit}>
          Edit Survey
        </button>

        <button 
          className="footer-btn" 
          onClick={handleViewStatus}
          style={{ backgroundColor: '#a3c1ad', fontWeight: 'bold' }}
        >
          View Submission Status
        </button>
      </div>
    </div>
    </div>
  );
};

export default LinkGeneration;