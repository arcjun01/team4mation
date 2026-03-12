import React from "react";

export default function FullNameQuestion({ fullName, setFullName }) {
  return (
    <div className="question-container">
      <h2 className="question-title">What is your full name?</h2>
      <input
        type="text"
        className="full-name-input"
        placeholder="Enter your name..."
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />
    </div>
  );
}
