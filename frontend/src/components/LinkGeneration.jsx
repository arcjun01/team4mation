import React, { useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/LinkGeneration.css';
import Navbar from './Navbar';

const LinkGeneration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courseName, setCourseName] = useState("course"); // State to hold the course name
  
  useEffect(() => {
    // Fetch the course name from the config endpoint
    fetch(`/api/config/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.course_name) {
          // Clean the name: "SDEV 202" becomes "sdev202"
          const formattedName = data.course_name.replace(/\s+/g, '').toLowerCase();
          setCourseName(formattedName);
        }
      })
      .catch((err) => console.error("Error fetching course details:", err));
  }, [id]);

  // Updated URL structure: domain/courseName/survey/id
  const surveyUrl = `${window.location.origin}/${courseName}/survey/${id}`;
  const handleCopy = () => {
    navigator.clipboard.writeText(surveyUrl);
    alert("Unique link copied to clipboard!");
  };

  const handleEmailClick = () => {
    const subject = encodeURIComponent("Action Required: Student Survey");
    const body = encodeURIComponent(`Please complete the team survey at this link: ${surveyUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleViewSubmissions = () => {
    navigate(`/survey-submissions/${id}`);
  };

  return (
    <div className="instructor-page-shell">
      <Navbar surveyId={id} />
      <div className="instructor-page-content">
        <div className="content-container link-generation-layout">
          <div className="question-container link-generation-title-card">
            <h1>Student Survey Link</h1>
          </div>

          <div className="question-container link-generation-link-card">
            <p className="link-generation-info-text">
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

          <div className="button-group link-generation-actions">
            <button className="button" onClick={handleGoBack}>
              Go Back
            </button>
            <button className="button" onClick={handleViewSubmissions}>
              View Submissions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkGeneration;
