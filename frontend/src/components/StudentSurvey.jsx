import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import "../css/studentSurvey.css";

export default function StudentSurvey() {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName) {
      setMessage("Please enter your name before submitting.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("http://localhost:5000/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          fullName, 
          survey_id: id
        }),
      });

      if (!response.ok) throw new Error("Failed to submit");

      // Success feedback and automatic redirection
      setMessage("Survey submitted successfully! Redirecting to dashboard...");
      
      // Delay for 2 seconds so the student can read the success message
      setTimeout(() => {
        navigate(`/generate-link/${id}`); 
      }, 2000);

    } catch (err) {
      console.error("Submission error:", err);
      setMessage("Submission failed. Ensure your backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="survey-page">
      <div className="survey-wrapper">
        <div className="survey-card">
          <div className="survey-header" style={{ textAlign: 'center', marginBottom: '20px' }}>
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

            {message && (
              <div className="survey-message" style={{ marginTop: '15px', fontWeight: 'bold', color: message.includes("failed") ? "red" : "green" }}>
                {message}
              </div>
            )}

            <div className="survey-actions" style={{ marginTop: '20px' }}>
              <button type="submit" disabled={loading} className="survey-submit">
                {loading ? "Submitting..." : "Submit Survey"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}