import React, { useState } from "react";

export default function CommitmentQuestion({ commitment, setCommitment, error, onClear }) {
  const [commitmentSelection, setCommitmentSelection] = useState(commitment || "");

  const handleCommitmentChange = (value) => {
    setCommitmentSelection(value);
    setCommitment(value);    if (error) onClear();  };

  return (
    <div className="question-container">
      <h2 className="question-title">On average, how many hours per week can you dedicate to the upcoming group project?</h2>

      <div className="survey-options">
        <label className="survey-option">
          <input
            type="radio"
            name="commitment"
            value="1-3"
            checked={commitmentSelection === "1-3"}
            onChange={(e) => handleCommitmentChange(e.target.value)}
          />
          <span>1-3 hr</span>
        </label>

        <label className="survey-option">
          <input
            type="radio"
            name="commitment"
            value="4-6"
            checked={commitmentSelection === "4-6"}
            onChange={(e) => handleCommitmentChange(e.target.value)}
          />
          <span>4-6 hr</span>
        </label>

        <label className="survey-option">
          <input
            type="radio"
            name="commitment"
            value="7-9"
            checked={commitmentSelection === "7-9"}
            onChange={(e) => handleCommitmentChange(e.target.value)}
          />
          <span>7-9 hr</span>
        </label>

        <label className="survey-option">
          <input
            type="radio"
            name="commitment"
            value="10+"
            checked={commitmentSelection === "10+"}
            onChange={(e) => handleCommitmentChange(e.target.value)}
          />
          <span>10+ hr (Whatever it takes)</span>
        </label>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
