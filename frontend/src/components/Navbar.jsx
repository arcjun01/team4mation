import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/Team4mation_Logo_Clear_Background.svg';
import '../css/Navbar.css';

const Navbar = ({ surveyId }) => {
  const myFormPath = surveyId ? `/instructor/form/${surveyId}` : '/setup';
  const studentStatusPath = surveyId ? `/survey-submissions/${surveyId}` : '/view-surveys';

  const linkClassName = ({ isActive }) =>
    `instructor-nav-link${isActive ? ' active' : ''}`;

  return (
    <nav className="instructor-navbar" aria-label="Instructor navigation">
      <div className="instructor-navbar-inner">
        <div className="instructor-nav-links">
          <NavLink to="/" className={linkClassName}>
            Dashboard
          </NavLink>
          <NavLink to={myFormPath} className={linkClassName}>
            My Form
          </NavLink>
          <NavLink to={studentStatusPath} className={linkClassName}>
            Student Status
          </NavLink>
        </div>

        <NavLink to="/" className="instructor-nav-logo-link" aria-label="Go to home page">
          <img
            src={logo}
            alt="Team4mation"
            className="instructor-nav-logo"
          />
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
