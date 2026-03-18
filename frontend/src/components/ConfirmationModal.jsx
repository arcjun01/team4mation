import React from 'react';
import '../css/confirmationModal.css';

const ConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Confirm Survey Submission</h2>
        </div>
        
        <p className="modal-message">
          Are you sure you want to submit your survey? You won't be able to make changes after this.
        </p>
        
        <div className="modal-actions">
          <button 
            className="modal-btn modal-btn-cancel" 
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            className="modal-btn modal-btn-confirm" 
            onClick={onConfirm}
          >
            Confirm & Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
