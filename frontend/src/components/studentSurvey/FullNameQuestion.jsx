import React from "react";

export default function FullNameQuestion({ fullName, setFullName, error, onClear }) {
  return (
    <div className="question-container">
      <h2 className="question-title">What is your full name?</h2>
      <input
        type="text"
        className="full-name-input"
        value={fullName}
        onChange={(e) => {
          setFullName(e.target.value);
          if (error) onClear();
        }}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
