import React from 'react';
import '../../css/ThankYouPage.css';
import Header from '../Header';

const ThankYouPage = () => {
  return (
    <>
      <Header variant="large" />
      <div className="thank-you-page">
      <div className="thank-you-wrapper top-gap-large">
        <div className='question-container '><h1>Team Availability Match</h1></div>
        
        <div className="thank-you-card">
          <p className="thank-you-message">
            Thank you for completing the survey
          </p>
          <p className="thank-you-message">
            Your instructor will share the team formation results soon
          </p>
        </div>
      </div>
      </div>
    </>
  );
};

export default ThankYouPage;
