import React from "react";

export default function FullNameQuestion({ fullName, setFullName }) {
  return (
    <div className="question-container">
      <label className="gpa-question">What is your full name?</label>
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