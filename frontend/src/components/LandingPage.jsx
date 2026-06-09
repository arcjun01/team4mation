import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/LandingPage.css';
import Header from './Header';
import InfoModal from './InfoModal';

const LandingPage = () => {
  const navigate = useNavigate();

  /* Controls whether the info modal is visible */
  const [showInfoModal, setShowInfoModal] = useState(false);

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

          <div className="landing-title-container">
            <h1>Smart Team Formation</h1>
            {/* Info icon */}
            <div
              className="info-icon-wrapper"
              title="Click for more info about this page"
              onClick={() => setShowInfoModal(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
          </div>

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

      {/* Info Modal - renders when info icon is clicked */}
      <InfoModal
        isOpen={showInfoModal}
        title="Smart Team Formation"
        onClose={() => setShowInfoModal(false)}
      />
    </div>
  );
};

export default LandingPage;