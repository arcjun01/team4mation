import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FullNameQuestion from "./FullNameQuestion";
import GenderQuestion from "./GenderQuestion";
import GpaQuestion from "./GpaQuestion";
import AvailabilityQuestion from "./AvailabilityQuestion";
import CommitmentQuestion from "./CommitmentQuestion";
import ConfirmationModal from "../ConfirmationModal";
import Header from "../Header";
import "../../css/studentSurvey.css";

export default function StudentSurvey() {
  const { id: surveyId } = useParams();
  const navigate = useNavigate();
  
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [gpa, setGpa] = useState(2.0);
  const [availability, setAvailability] = useState({});
  const [commitment, setCommitment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  
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

        const response = await fetch(`/api/config/${surveyId}`);
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

    const newErrors = {};

    // Validate fullName
    if (!fullName.trim()) {
      newErrors.fullName = "Please enter your full name.";
    }

    // Validate gender
    if (!gender) {
      newErrors.gender = "Please select a gender.";
    }

    // Validate GPA if it's required
    if (surveyConfig?.useGpa) {
      if (!gpa || gpa < 1.0 || gpa > 4.0) {
        newErrors.gpa = "Please enter a valid GPA between 1.0 and 4.0.";
      }
    }

    // Validate commitment
    if (!commitment) {
      newErrors.commitment = "Please select a commitment level.";
    }

    // Validate availability
    const selectedSlots = Object.keys(availability).filter(key => availability[key]);
    if (selectedSlots.length === 0) {
      newErrors.availability = "Please select at least one time slot.";
    }

    setErrors(newErrors);

    // If there are errors, don't submit
    if (Object.keys(newErrors).length > 0) {
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

      const response = await fetch("/api/survey", {
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

  const clearError = (field) => {
    setErrors(prev => ({
      ...prev,
      [field]: ""
    }));
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
    <div id="student-survey">
      <div className="page-wrapper">
        <Header variant="page-header" />
        <div className="page-container  top-gap">
            <div className="question-container"><h1>{surveyTitle}</h1></div>
            <form onSubmit={handleSubmit} className="survey-form">
              <FullNameQuestion 
                fullName={fullName}
                setFullName={setFullName}
                error={errors.fullName}
                onClear={() => clearError('fullName')}
              />

              <GenderQuestion 
                gender={gender} 
                setGender={setGender}
                error={errors.gender}
                onClear={() => clearError('gender')}
              />

              {surveyConfig.useGpa && (
                <GpaQuestion 
                  gpa={gpa} 
                  setGpa={setGpa}
                  prevCourse={surveyConfig.prevCourse}
                  error={errors.gpa}
                  onClear={() => clearError('gpa')}
                />
              )}

              <CommitmentQuestion 
                commitment={commitment}
                setCommitment={setCommitment}
                error={errors.commitment}
                onClear={() => clearError('commitment')}
              />

              <AvailabilityQuestion 
                availability={availability}
                setAvailability={setAvailability}
                error={errors.availability}
                onClear={() => clearError('availability')}
              />

              {message && (
                <div className="survey-message">{message}</div>
              )}

              <div className="survey-actions">
                <button
                  type="submit"
                  disabled={loading}
                  className="button"
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
    </div>
  );
}
