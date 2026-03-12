import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/LandingPage.css';
import largeHeaderImg from '../assets/largeHeader.svg';

const LandingPage = () => {
  const navigate = useNavigate();
  const handleFormGroupsClick = () => {
    navigate('/setup');
  };

  return (
    <div className="landing-page">
      <header className="landing-header">
        <img
          src={largeHeaderImg}
          alt="Team4mation header"
          className="landing-header-image"
        />
      </header>

      <main className="landing-main">
        <section className="landing-card">
          <h1 className="landing-title">Smart Team Formation</h1>
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

