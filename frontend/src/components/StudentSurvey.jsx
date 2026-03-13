import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import FullNameQuestion from "./FullNameQuestion";
import GenderQuestion from "./GenderQuestion";
import GpaQuestion from "./GpaQuestion";
import CommitmentQuestion from "./studentSurvey/CommitmentQuestion";
import AvailabilityQuestion from "./AvailabilityQuestion";

export default function StudentSurvey() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [gpa, setGpa] = useState(2.5);
  const [gpaError, setGpaError] = useState("");
  const [commitment, setCommitment] = useState("");
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    

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

      const response = await fetch("http://localhost:3001/api/survey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          gender,
          gpa,
          commitment,
          availability_schedule: JSON.stringify(availability),
          surveyId: id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit survey");
      }

      setMessage("Survey submitted successfully! Redirecting...");

      setTimeout(() => {
        navigate(`/generate-link/${id}`);
      }, 2000);

      setFullName("");
      setGender("");
      setGpa(2.0);
      setGpaError("");
      setCommitment("");
      setAvailability({});
    } catch (err) {
      console.error(err);
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

          <FullNameQuestion
            fullName={fullName}
            setFullName={setFullName}
          />

          <GenderQuestion
            gender={gender}
            setGender={setGender}
          />

          <GpaQuestion
            gpa={gpa}
            gpaError={gpaError}
            setGpa={setGpa}
            setGpaError={setGpaError}
          />

          <CommitmentQuestion
            commitment={commitment}
            setCommitment={setCommitment}
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