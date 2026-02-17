import React, { useState } from "react";
import "./css/studentSurvey.css";

export default function StudentSurvey() {
  const [gender, setGender] = useState("");
  const [gpa, setGpa] = useState(2.0);
  const [gpaError, setGpaError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleGpaChange = (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setGpa("");
      setGpaError("");
      return;
    }

    if (numValue < 1.0 || numValue > 4.0) {
      setGpaError("GPA must be between 1.0 and 4.0");
    } else {
      setGpaError("");
    }
    setGpa(numValue);
  };

  const handleGpaIncrement = () => {
    const newValue = Math.min(gpa + 0.1, 4.0);
    setGpa(Math.round(newValue * 10) / 10);
    setGpaError("");
  };

  const handleGpaDecrement = () => {
    const newValue = Math.max(gpa - 0.1, 1.0);
    setGpa(Math.round(newValue * 10) / 10);
    setGpaError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!gender) {
      setMessage("Please select a gender before submitting.");
      return;
    }

    if (gpaError || gpa < 1.0 || gpa > 4.0) {
      setMessage("Please enter a valid GPA between 1.0 and 4.0.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("http://localhost:3001/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gender, gpa }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit survey");
      }

      setMessage("Survey submitted successfully.");
      setGender("");
      setGpa(2.0);
      setGpaError("");
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

            <div>
              <label className="gpa-question">What was your final GPA in SDEV 344? Enter or adjust below</label>
              <p className="gpa-info">You can view your GPA in <a href="https://csprd.ctclink.us/psc/csprd_9/EMPLOYEE/SA/c/SSR_STUDENT_ACAD_REC_FL.SSR_MD_ACAD_REC_FL.GBL?Action=U&MD=Y&GMenu=SSR_STUDENT_ACAD_REC_FL&GComp=SSR_ACADREC_NAV_FL&GPage=SCC_START_PAGE_FL&scname=CTC_ACADEMIC_RECORDS_NAVCOL&AJAXTRANSFER=Y" target="_blank" rel="noopener noreferrer">ctcLink</a> under Academic Records → Course History.</p>
              
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="4.0"
                value={gpa}
                onChange={(e) => handleGpaChange(e.target.value)}
                className="gpa-input"
              />
              {gpaError && <div className="gpa-error">{gpaError}</div>}
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
