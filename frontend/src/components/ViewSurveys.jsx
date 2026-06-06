import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/ViewSurveys.css';
import Navbar from './Navbar';

const ViewSurveys = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const instructorEmail = token ? atob(token).split(':')[0] : null;
      const response = await fetch(`/api/surveys/open?email=${encodeURIComponent(instructorEmail)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch surveys');
      }
      
      const data = await response.json();
      setSurveys(data.surveys || []);
      
      if (data.surveys && data.surveys.length === 0) {
        setError('No surveys available at this time.');
      }
    } catch (err) {
      console.error('Error fetching surveys:', err);
      setError('Unable to load surveys. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSurvey = (surveyId) => {
    navigate(`/instructor/form/${surveyId}`);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="instructor-page-shell">
      <Navbar />
      <div className="instructor-page-content">
      <div className="view-surveys-container">
        <div className="survey-container">
          <div className="question-container">
            <h1>Select Survey</h1>
          </div>

          {loading ? (
            <div className="loading-message">
              <p>Loading surveys...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
              <button className="button" onClick={handleBack}>
                Back to Home
              </button>
            </div>
          ) : (
            <>
              <div className="surveys-list">
                {surveys.map((survey) => (
                  (() => {
                    const hasGroupsFormed = ['closed', 'formed'].includes((survey.status || '').toLowerCase());

                    return (
                      <div
                        key={survey.id}
                        className="survey-card"
                        onClick={() => handleOpenSurvey(survey.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleOpenSurvey(survey.id);
                          }
                        }}
                      >
                        <div className="survey-card-header">
                          <h3>{survey.course_name}</h3>
                        </div>
                        <div className="survey-card-details">
                          <p><strong>Created On:</strong> {survey.created_at ? new Date(survey.created_at).toLocaleString() : 'N/A'}</p>
                          <p><strong>Class Size:</strong> {survey.class_size}</p>
                          <p><strong>Team Limit:</strong> {survey.team_limit} ({survey.limit_type})</p>
                          {survey.prev_course && (
                            <p><strong>Previous Course:</strong> {survey.prev_course}</p>
                          )}
                          {hasGroupsFormed && (
                            <p className="groups-formed-status">Groups already formed</p>
                          )}
                        </div>
                      </div>
                    );
                  })()
                ))}
              </div>

              <div className="button-group">
                <button className="button" onClick={handleBack}>
                  Back to Home
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default ViewSurveys;
