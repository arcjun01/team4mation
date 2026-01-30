import React, { useState } from "react";
import "./css/studentSurvey.css";

export default function StudentSurvey() {
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!gender) {
      setMessage("Please select a gender before submitting.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("http://localhost:3001/api/survey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gender }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit survey");
      }

      setMessage("Survey submitted successfully.");
      setGender("");
    } catch (err) {
      setMessage("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="survey-page">
      <div className="survey-wrapper">
        <div className="survey-card">
          <div className="survey-title">Student Survey</div>

          <form onSubmit={handleSubmit} className="survey-form">
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

            {message && (
              <div className="survey-message">{message}</div>
            )}

            <div className="survey-actions">
              <button
                type="submit"
                disabled={loading}
                className="survey-submit"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
