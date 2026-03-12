import React, { useState } from "react";

export default function GenderQuestion({ setGender }) {

  const [genderSelection, setGenderSelection] = useState("");

  const handleGenderChange = (value) => {

    setGenderSelection(value); // controls which radio is selected

    if (value === "prefer_not") {
      setGender("other"); // backend value
    } else {
      setGender(value);
    }
  };

  return (
    <div className="question-container">
      <h2 className="question-title">What is your gender?</h2>

      <div className="survey-options">

        <label className="survey-option">
          <input
            type="radio"
            name="gender"
            value="male"
            checked={genderSelection === "male"}
            onChange={(e) => handleGenderChange(e.target.value)}
          />
          <span>Male</span>
        </label>


        <label className="survey-option">
          <input
            type="radio"
            name="gender"
            value="female"
            checked={genderSelection === "female"}
            onChange={(e) => handleGenderChange(e.target.value)}
          />
          <span>Female</span>
        </label>


        <label className="survey-option">
          <input
            type="radio"
            name="gender"
            value="other"
            checked={genderSelection === "other"}
            onChange={(e) => handleGenderChange(e.target.value)}
          />
          <span>Other</span>
        </label>


        {genderSelection === "other" && (
          <div className="other-input">
            <label>Please specify:</label>
            <input type="text" />
          </div>
        )}


        <label className="survey-option">
          <input
            type="radio"
            name="gender"
            value="prefer_not"
            checked={genderSelection === "prefer_not"}
            onChange={(e) => handleGenderChange(e.target.value)}
          />
          <span>Prefer not to self-identify</span>
        </label>

      </div>
    </div>
  );
}
