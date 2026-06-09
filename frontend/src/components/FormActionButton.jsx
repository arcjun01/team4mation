import React from 'react';
import '../css/InstructorFormDetails.css';

const FormActionButton = ({ 
  icon, 
  onClick, 
  title = '', 
  ariaLabel = '', 
  disabled = false 
}) => {
  return (
    <button
      type="button"
      className="form-actions-rail-button"
      onClick={onClick}
      title={title}
      aria-label={ariaLabel || title}
      disabled={disabled}
    >
      <img src={icon} alt="" />
    </button>
  );
};

export default FormActionButton;
