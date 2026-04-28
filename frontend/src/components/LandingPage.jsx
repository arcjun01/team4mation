import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isResolvingSurvey, setIsResolvingSurvey] = useState(false);

  const handleFormGroupsClick = async () => {
    setIsResolvingSurvey(true);
    try {
      const response = await fetch('http://localhost:3001/api/surveys/open');
      if (response.ok) {
        const data = await response.json();
        const latestSurveyId = data?.surveys?.[0]?.id;
        if (latestSurveyId) {
          navigate(`/instructor/form/${latestSurveyId}`);
          return;
        }
      }
    } catch (error) {
      console.error('Error resolving existing survey setup:', error);
    } finally {
      setIsResolvingSurvey(false);
    }

    navigate('/setup');
  };

  const handleViewSurveysClick = () => {
    navigate('/view-surveys');
  };

  return (
    <div className="landing-page">
      <main className="landing-main">
        <section className="landing-card top-gap-large">
          <div className="question-container "><h1>Smart Team Formation</h1></div>
          <div className="landing-content-card">
            <button
              className="landing-primary-button"
              onClick={handleFormGroupsClick}
              disabled={isResolvingSurvey}
            >
              {isResolvingSurvey ? 'Loading...' : 'Form Groups'}
            </button>
            <button
              className="landing-secondary-button"
              onClick={handleViewSurveysClick}
            >
              View Survey Results
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;

