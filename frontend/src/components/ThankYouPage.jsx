import React from 'react';
import '../css/studentSurvey.css';

const ThankYouPage = () => {
  return (
    <div className="survey-page">
      <div className="survey-card">
        <h1 className="survey-title">Team Availability Match</h1>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p style={{ fontSize: '18px', color: '#333', marginBottom: '10px' }}>
            Thank you for completing the survey.
          </p>
          <p style={{ fontSize: '18px', color: '#333' }}>
            Your instructor will share the team formation results soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
