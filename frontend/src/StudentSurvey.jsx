import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FullNameQuestion from "./components/studentSurvey/FullNameQuestion";
import GenderQuestion from "./components/studentSurvey/GenderQuestion";
import GpaQuestion from "./components/studentSurvey/GpaQuestion";
import AvailabilityQuestion from "./components/studentSurvey/AvailabilityQuestion";
import CommitmentQuestion from "./components/studentSurvey/CommitmentQuestion";
import ConfirmationModal from "./components/ConfirmationModal";
import "./css/studentSurvey.css";

export default function StudentSurvey() {
  const { id: surveyId } = useParams();
  const navigate = useNavigate();
  
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [gpa, setGpa] = useState(2.0);
  const [gpaError, setGpaError] = useState("");
  const [availability, setAvailability] = useState({});
  const [commitment, setCommitment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  const [surveyConfig, setSurveyConfig] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Fetch survey configuration on mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        if (!surveyId) {
          setMessage("Invalid survey link.");
          setLoadingConfig(false);
          return;
        }

        const response = await fetch(`http://localhost:3001/api/config/${surveyId}`);
        if (!response.ok) {
          setMessage("Survey not found or expired.");
          setLoadingConfig(false);
          return;
        }
        
        const data = await response.json();
        setSurveyConfig(data);
      } catch (err) {
        console.error("Error fetching config:", err);
        setMessage("Error loading survey. Please try again.");
      } finally {
        setLoadingConfig(false);
      }
    };

    fetchConfig();
  }, [surveyId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!fullName) {
      setMessage("Please enter your full name before submitting.");
      return;
    }

    if (!gender) {
      setMessage("Please select a gender before submitting.");
      return;
    }

    // Only validate GPA if it's required
    if (surveyConfig?.useGpa && (gpaError || gpa < 1.0 || gpa > 4.0)) {
      setMessage("Please enter a valid GPA between 1.0 and 4.0.");
      return;
    }

    if (!commitment) {
      setMessage("Please select your weekly commitment hours before submitting.");
      return;
    }

    const selectedSlots = Object.keys(availability).filter(key => availability[key]);
    if (selectedSlots.length === 0) {
      setMessage("Please select at least one time slot for availability.");
      return;
    }

    // Show confirmation modal instead of submitting directly
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    setShowConfirmation(false);
    
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
          gpa: surveyConfig?.useGpa ? gpa : null,
          commitment,
          surveyId,
          availability_schedule: JSON.stringify(availability)
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit survey");
      }
      const data = await response.json();
      // Redirect to thank you page after successful submission
      navigate("/thank-you");
    } catch (err) {
      console.error("Submission error:", err);
      setMessage("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  if (loadingConfig) {
    return (
      <div className="survey-page">
        <div className="survey-card">
          <p>Loading survey...</p>
        </div>
      </div>
    );
  }

  if (!surveyConfig) {
    return (
      <div className="survey-page">
        <div className="survey-card">
          <p>{message || "Survey not available."}</p>
        </div>
      </div>
    );
  }

  const surveyTitle = surveyConfig.courseName 
    ? `${surveyConfig.courseName} Group Formation Survey` 
    : "Group Formation Survey";

  return (
    <div className="survey-page">
      <div className="survey-card">
        <h1 className="survey-title">{surveyTitle}</h1>

        <form onSubmit={handleSubmit} className="survey-form">
          <FullNameQuestion 
            fullName={fullName}
            setFullName={setFullName}
          />

          <GenderQuestion gender={gender} setGender={setGender} />

          {surveyConfig.useGpa && (
            <GpaQuestion 
              gpa={gpa} 
              gpaError={gpaError} 
              setGpa={setGpa} 
              setGpaError={setGpaError}
              prevCourse={surveyConfig.prevCourse}
            />
          )}

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
              {loading ? "Submitting..." : "Submit Survey"}
            </button>
          </div>
        </form>
      </div>

      <ConfirmationModal 
        isOpen={showConfirmation}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}