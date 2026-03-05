import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GenderQuestion from "./components/GenderQuestion";
import GpaQuestion from "./components/GpaQuestion";
import AvailabilityQuestion from "./components/AvailabilityQuestion";
import "../css/studentSurvey.css";

export default function StudentSurvey() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [gpa, setGpa] = useState(2.0);
  const [gpaError, setGpaError] = useState("");
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName) {
      setMessage("Please enter your full name.");
      return;
    }

    if (!gender) {
      setMessage("Please select a gender before submitting.");
      return;
    }

    if (gpaError || gpa < 1.0 || gpa > 4.0) {
      setMessage("Please enter a valid GPA between 1.0 and 4.0.");
      return;
    }

    const selectedSlots = Object.keys(availability).filter(
      (key) => availability[key]
    );

    if (selectedSlots.length === 0) {
      setMessage("Please select at least one time slot for availability.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("http://localhost:5000/api/survey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          gender,
          gpa,
          availability_schedule: JSON.stringify(availability),
          survey_id: id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit survey");
      }

      setMessage("Survey submitted successfully! Redirecting...");

      setTimeout(() => {
        navigate(`/generate-link/${id}`);
      }, 2000);

    } catch (err) {
      console.error("Submission error:", err);
      setMessage("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="survey-page">
      <div className="survey-wrapper">
        <div className="survey-card">

          <div className="survey-header" style={{ textAlign: "center", marginBottom: "20px" }}>
            <h2 className="survey-title">SDEV 372 Group Formation Survey</h2>
          </div>

          <form onSubmit={handleSubmit} className="survey-form">

            <div className="form-section">
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

            <GenderQuestion gender={gender} setGender={setGender} />

            <GpaQuestion
              gpa={gpa}
              gpaError={gpaError}
              setGpa={setGpa}
              setGpaError={setGpaError}
            />

            <AvailabilityQuestion
              availability={availability}
              setAvailability={setAvailability}
            />

            {message && (
              <div
                className="survey-message"
                style={{
                  marginTop: "15px",
                  fontWeight: "bold",
                  color: message.includes("failed") ? "red" : "green",
                }}
              >
                {message}
              </div>
            )}

            <div className="survey-actions" style={{ marginTop: "20px" }}>
              <button
                type="submit"
                disabled={loading}
                className="survey-submit"
              >
                {loading ? "Submitting..." : "Submit Survey"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}