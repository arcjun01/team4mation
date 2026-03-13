import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../css/LinkGeneration.css';
import Header from './Header';

const LinkGeneration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const formData = location.state?.formData;
  const surveyUrl = `${window.location.origin}/team4mation/survey/${id}`;

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
    navigate(`/survey-submissions/${id}`);
  };

  return (
    <div className="link-page-wrapper">
      <Header variant="large" />
      <div className="link-page-container top-gap">
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
        
          <div className="button-group">
            <button className="button" onClick={handleEdit}>
              Edit Survey
            </button>

            <button 
              className="button" 
              onClick={handleViewStatus}
            >
              View Submission Status
            </button>
          </div>
      </div>
    </div>
  );
};

export default LinkGeneration;