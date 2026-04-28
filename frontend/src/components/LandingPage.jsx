import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/LandingPage.css';
import Header from './Header';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleNewGroupFormationClick = () => {
    navigate('/setup');
  };

  const handleExistingGroupFormationClick = () => {
    navigate('/view-surveys');
  };

  return (
    <div className="landing-page">
      <Header variant="large" />
      <main className="landing-main">
        <section className="landing-card top-gap-large">
          <div className="question-container "><h1>Smart Team Formation</h1></div>
          <div className="landing-content-card">
            <button
              className="landing-primary-button"
              onClick={handleNewGroupFormationClick}
            >
              New Group Formation
            </button>
            <button
              className="landing-secondary-button"
              onClick={handleExistingGroupFormationClick}
            >
              Existing Group Formation
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;

