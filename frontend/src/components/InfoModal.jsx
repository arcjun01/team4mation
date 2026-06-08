import React from 'react';
import '../css/InfoModal.css';

const InfoModal = ({ isOpen, title, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="info-modal-overlay">
      <div className="info-modal-content">
        <div className="info-modal-header">
          {/* Info icon in header */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#5ba89f"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="modal-icon"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <h2>{title}</h2>
        </div>

        {/* Structured description body */}
        <div className="info-modal-message">
          <p className="info-modal-intro">
            Team4mation is a smart team formation tool designed to help instructors
            build balanced, well-rounded student teams. Here's how it works:
          </p>

          <ul className="info-modal-steps">
            {/* Set Up a Survey - Clipboard */}
            <li>
              <span className="info-step-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5ba89f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
                  <rect x="9" y="3" width="6" height="4" rx="1" ry="1"/>
                  <line x1="9" y1="12" x2="15" y2="12"/>
                  <line x1="9" y1="16" x2="13" y2="16"/>
                </svg>
              </span>
              <div>
                <strong>Set Up a Survey</strong> — Create a custom team formation
                survey tailored to your course needs. Define the questions that
                matter most for grouping students effectively.
              </div>
            </li>

            {/* Collect Student Info - Link */}
            <li>
              <span className="info-step-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5ba89f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
              </span>
              <div>
                <strong>Collect Student Info</strong> — Share a unique survey link
                with your students. They fill out the survey with details like
                skills, availability, and preferences.
              </div>
            </li>

            {/* Review Submissions - Eye */}
            <li>
              <span className="info-step-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5ba89f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </span>
              <div>
                <strong>Review Submissions</strong> — View and manage all student
                responses in one place. See who has submitted and track
                participation before forming groups.
              </div>
            </li>

            {/* Generate Balanced Teams - Shuffle */}
            <li>
              <span className="info-step-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5ba89f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 3 21 3 21 8"/>
                  <line x1="4" y1="20" x2="21" y2="3"/>
                  <polyline points="21 16 21 21 16 21"/>
                  <line x1="15" y1="15" x2="21" y2="21"/>
                  <line x1="4" y1="4" x2="9" y2="9"/>
                </svg>
              </span>
              <div>
                <strong>Generate Balanced Teams</strong> — Use Team4mation's
                grouping tools to automatically organize students into balanced
                teams based on their survey responses and your chosen criteria.
              </div>
            </li>
          </ul>

          <p className="info-modal-footer">
            Get started by clicking <strong>New Group Formation</strong> to create
            a new survey, or <strong>Existing Group Formation</strong> to continue
            working with a previously created one.
          </p>
        </div>

        <div className="info-modal-actions">
          <button className="info-modal-btn" onClick={onClose}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;