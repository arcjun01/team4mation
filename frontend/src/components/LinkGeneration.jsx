import React, { useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import '../css/LinkGeneration.css';

const LinkGeneration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isClosed, setIsClosed] = useState(false);

  const formData = location.state?.formData;
  const surveyUrl = `${window.location.origin}/survey/${id}`;

  const handleEdit = () => {
    navigate('/', { state: { formData } });
  };

  const handleClose = () => {
    if (window.confirm("Are you sure you want to close this survey? This will stop data collection and allow you to view submissions.")) {
      setIsClosed(true);
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

  return (
    <div className="link-page-container">
      <div className="card-container">
        <h2 className="card-title">Student Survey Link</h2>
        
        <p className="instruction-text" style={{ color: '#666', marginBottom: '20px' }}>
          {isClosed ? "Survey is now closed. You can proceed to view and decrypt submissions." : "Copy the link or click Share to send it via Outlook."}
        </p>
        
        <div className="action-row">
          <div className="url-box">
            <Link to={`/survey/${id}`} className="survey-active-link">
                {surveyUrl}
            </Link>
          </div>

          <div className="icon-group">
            <button className="icon-btn" onClick={handleCopy} title="Copy Link" disabled={isClosed}>
              📋
            </button>
            <button className="icon-btn" onClick={handleEmailClick} title="Send via Outlook" disabled={isClosed}>
              ✉️
            </button>
          </div>
        </div>
      </div>
      
      <div className={`footer-action-row ${isClosed ? 'centered' : ''}`}>
        {isClosed ? (
          <button 
            className="footer-btn open-submissions-btn" 
            onClick={() => navigate(`/instructor/decrypt/${id}`)}
          >
            Open Submissions
          </button>
        ) : (
          <>
            <button className="footer-btn" onClick={handleEdit}>Edit Survey</button>
            <button className="footer-btn" onClick={handleClose}>Close Survey</button>
          </>
        )}
      </div>
    </div>
  );
};

export default LinkGeneration;