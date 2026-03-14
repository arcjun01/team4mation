import React from 'react';
import '../css/ThankYouPage.css';
import Header from './Header';

const ThankYouPage = () => {
  return (
    <>
      <Header variant="large" />
      <div className="thank-you-page">
      <div className="thank-you-wrapper top-gap-large">
        <div className='question-container '><h1>Team Availability Match</h1></div>
        
        <div className="thank-you-card">
          <p style={{ fontSize: '18px', color: '#333', marginBottom: '10px' }}>
            Thank you for completing the survey
          </p>
          <p style={{ fontSize: '18px', color: '#333' }}>
            Your instructor will share the team formation results soon
          </p>
        </div>
      </div>
      </div>
    </>
  );
};

export default ThankYouPage;
