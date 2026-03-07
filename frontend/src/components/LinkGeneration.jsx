import React from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import '../css/LinkGeneration.css';

const LinkGeneration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Grab form data if we came from the setup page so we can edit it
  const formData = location.state?.formData;
  const surveyUrl = `${window.location.origin}/survey/${id}`;

  const handleEdit = () => {
    navigate('/', { state: { formData } });
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
    navigate(`/survey-stats/${id}`);
  };

  return (
    <div className="link-page-container">
      <div className="card-container">
        <h2 className="card-title">Student Survey Link</h2>
        
        <p className="instruction-text" style={{ color: '#666', marginBottom: '20px' }}>
          Copy the link or click the mail icon to share it with your students via Outlook.
        </p>
        
        <div className="action-row">
          <div className="url-box">
            <Link to={`/survey/${id}`} className="survey-active-link">
              {surveyUrl}
            </Link>
          </div>

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
  );
};

export default LinkGeneration;