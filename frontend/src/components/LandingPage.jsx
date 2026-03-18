import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/LandingPage.css';
import Header from './Header';

const LandingPage = () => {
  const navigate = useNavigate();
  const handleFormGroupsClick = () => {
    navigate('/setup');
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
              onClick={handleFormGroupsClick}
            >
              Form Groups
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;

