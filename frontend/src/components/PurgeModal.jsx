import React, { useState, useEffect } from 'react';
import '../css/PurgeModal.css';

const PurgeModal = ({ isOpen, onClose, onConfirm, isLoading, serverError }) => {
    const [confirmText, setConfirmText] = useState('');
    const REQUIRED_WORD = 'DELETE';

    // Reset input whenever modal opens/closes
    useEffect(() => {
        if (!isOpen) setConfirmText('');
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Confirm Permanent Purge</h3>
                <p>
                    This action <strong>cannot be undone</strong>. To ensure student privacy, 
                    this will wipe all survey responses from the database.
                </p>
                
                <div className="instruction">
                    Please type <strong>{REQUIRED_WORD}</strong> to confirm.
                </div>

                <input
                    type="text"
                    className="purge-input"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="Type here..."
                    disabled={isLoading}
                />

                {serverError && <p className="error-msg">{serverError}</p>}

                <div className="modal-actions">
                    <button onClick={onClose} disabled={isLoading} className="btn-secondary">
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={confirmText !== REQUIRED_WORD || isLoading}
                        className={`btn-danger ${confirmText === REQUIRED_WORD ? 'active' : ''}`}
                    >
                        {isLoading ? <div className="spinner"></div> : 'Purge Data'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PurgeModal;
