import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../css/LinkGeneration.css';

const LinkGeneration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const formData = location.state?.formData;
  
  const surveyUrl = `/team4mation/survey/${id}`;

  const handleEdit = () => {
    // Navigate back to setup and pass the data back to populate the fields
    navigate('/', { state: { formData } });
  };

  const handleClose = () => {
    if (window.confirm("Are you sure you want to exit?")) {
      navigate('/'); // Redirects to start
    }
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

  // NEW: Navigate to the submissions status page
  const handleViewStatus = () => {
    navigate(`/survey-stats/${id}`);
  };

  return (
    <div className="link-page-container">
      <div className="card-container">
        <h2 className="card-title">Student Survey Link</h2>
        
        <p className="instruction-text" style={{ color: '#666', marginBottom: '20px' }}>
          Copy the link or click Share to send it via Outlook.
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
        <button className="footer-btn" onClick={handleEdit}>Edit Survey</button>
        
        <button className="footer-btn" onClick={handleViewStatus} style={{ backgroundColor: '#a3c1ad' }}>View Submissions</button>
        <button className="footer-btn" onClick={handleClose}>Close Survey</button>
      </div>
    </div>
  );
};

export default LinkGeneration;