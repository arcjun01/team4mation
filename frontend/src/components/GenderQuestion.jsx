import React from "react";

export default function GenderQuestion({ gender, setGender }) {
  return (
    <div>
      <label className="survey-question">What is your gender?</label>

      <div className="survey-options">
        <label className="survey-option">
          <input
            type="radio"
            name="gender"
            value="male"
            checked={gender === "male"}
            onChange={(e) => setGender(e.target.value)}
          />
          <span>Male</span>
        </label>

        <label className="survey-option">
          <input
            type="radio"
            name="gender"
            value="female"
            checked={gender === "female"}
            onChange={(e) => setGender(e.target.value)}
          />
          <span>Female</span>
        </label>

        <label className="survey-option">
          <input
            type="radio"
            name="gender"
            value="other"
            checked={gender === "other"}
            onChange={(e) => setGender(e.target.value)}
          />
          <span>Other</span>
        </label>
      </div>
    </div>
  );
}
