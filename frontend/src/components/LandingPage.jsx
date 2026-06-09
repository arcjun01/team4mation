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
      <Header />
      <main className="landing-main">
        <section className="landing-card top-gap">
          <div className="question-container "><h1>Smart Team Formation</h1></div>
          <div className="landing-content-card">
            <div className="landing-description">
              <p>
                Team4mation helps instructors create balanced student teams from survey responses.
                Set up a team formation survey, collect student information, review submissions,
                and generate organized groups based on different criteria.
              </p>
            </div>
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

