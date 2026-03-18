import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/ViewSurveys.css';
import Header from './Header';

const ViewSurveys = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOpenSurveys();
  }, []);

  const fetchOpenSurveys = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/surveys/open');
      
      if (!response.ok) {
        throw new Error('Failed to fetch surveys');
      }
      
      const data = await response.json();
      setSurveys(data.surveys || []);
      
      if (data.surveys && data.surveys.length === 0) {
        setError('No open surveys available at this time.');
      }
    } catch (err) {
      console.error('Error fetching surveys:', err);
      setError('Unable to load surveys. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSurvey = (surveyId) => {
    setSelectedSurveyId(surveyId);
  };

  const handleViewResults = () => {
    if (!selectedSurveyId) {
      setError('Please select a survey first.');
      return;
    }
    
    // Navigate to SmartTeamsDashboard with survey ID
    navigate(`/instructor/smart-teams/${selectedSurveyId}`, {
      state: { surveyId: selectedSurveyId }
    });
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="page-wrapper">
      <Header variant="large" />
      <div className="page-container top-gap-large">
        <div className="survey-container">
          <div className="question-container">
            <h1>Select a Survey</h1>
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
                  <div
                    key={survey.id}
                    className={`survey-card ${selectedSurveyId === survey.id ? 'selected' : ''}`}
                    onClick={() => handleSelectSurvey(survey.id)}
                  >
                    <div className="survey-card-header">
                      <h3>{survey.course_name}</h3>
                      <span className={`status-badge ${survey.status}`}>
                        {survey.status === 'open' ? 'Open' : 'Closed'}
                      </span>
                    </div>
                    <div className="survey-card-details">
                      <p><strong>Survey ID:</strong> {survey.id}</p>
                      <p><strong>Class Size:</strong> {survey.class_size}</p>
                      <p><strong>Team Limit:</strong> {survey.team_limit} ({survey.limit_type})</p>
                      {survey.prev_course && (
                        <p><strong>Previous Course:</strong> {survey.prev_course}</p>
                      )}
                    </div>
                    {selectedSurveyId === survey.id && (
                      <div className="survey-card-selected-indicator">
                        ✓ Selected
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="button-group">
                <button className="button" onClick={handleBack}>
                  Back to Home
                </button>
                <button
                  className="button primary"
                  onClick={handleViewResults}
                  disabled={!selectedSurveyId}
                >
                  View Results
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewSurveys;
