import React, { useState } from "react";
import GenderQuestion from "./components/GenderQuestion";
import GpaQuestion from "./components/GpaQuestion";
import AvailabilityQuestion from "./components/AvailabilityQuestion";
import "./css/studentSurvey.css";

export default function StudentSurvey() {
  const [gender, setGender] = useState("");
  const [gpa, setGpa] = useState(2.0);
  const [gpaError, setGpaError] = useState("");
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

    const selectedSlots = Object.keys(availability).filter(key => availability[key]);
    if (selectedSlots.length === 0) {
      setMessage("Please select at least one time slot for availability.");
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
        body: JSON.stringify({ 
          gender, 
          gpa,
          availability_schedule: JSON.stringify(availability)
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit survey");
      }

      setMessage("Survey submitted successfully.");
      setGender("");
      setGpa(2.0);
      setGpaError("");
      setAvailability({});
    } catch (err) {
      setMessage("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="survey-page">
      <div className="survey-card">
        <h1 className="survey-title">Group Formation Survey</h1>

        <form onSubmit={handleSubmit} className="survey-form">
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
  );
}
