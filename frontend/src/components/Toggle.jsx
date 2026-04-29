import React from 'react';
import '../css/Toggle.css';

const Toggle = ({ isSelected, onToggle, className }) => {
  return (
    <div className={`toggle ${className || ''}`} onClick={onToggle} id={isSelected ? "node-1063_3383" : "node-1063_3373"}>
      <div className="toggle-frame" id={isSelected ? "node-1063_3384" : "node-1063_3374"} />
      {isSelected && <div className="toggle-container" data-node-id="1063:3385" />}
    </div>
  );
};

export default Toggle;