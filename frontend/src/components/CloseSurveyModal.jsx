import React from 'react';

const CloseSurveyModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;
    return(
        <div className="modal-overlay">
            <div className='modal-content'>
                <h3>Close Survey</h3>
                <p>Are you sure you want to close this survey? Students won't be able to submit anymore.</p>
                <div className='modal-actions'>
                    <button onClick={onClose} className='btn-secondary'>
                        Cancel
                    </button>
                    <button onClick={onConfirm} className='btn-danger active'>
                        Confirm & Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CloseSurveyModal;
