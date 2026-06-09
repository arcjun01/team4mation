import React, { useState } from "react";

export default function GpaQuestion({ gpa, setGpa, prevCourse, error, onClear }) {
  const [localError, setLocalError] = useState("");

  const handleGpaChange = (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setGpa("");
      setLocalError("");
      return;
    }

    // do not accept negative values
    if (numValue < 0) {
      setLocalError("Grade cannot be negative");
      return;
    }

    // clear any local validation error
    if (localError) setLocalError("");

    setGpa(numValue);
    if (error && onClear) onClear();
  };

  const courseDisplay = prevCourse || "SDEV 344";

  return (
    <div className="question-container">
      <h2 className="question-title">What was your final grade in {courseDisplay}? Enter or adjust below</h2>
      <p className="details">
        You can view your grades in{" "}
        <a
            href="https://csprd.ctclink.us/psc/csprd_9/EMPLOYEE/SA/c/SSR_STUDENT_ACAD_REC_FL.SSR_MD_ACAD_REC_FL.GBL?Action=U&MD=Y&GMenu=SSR_STUDENT_ACAD_REC_FL&GComp=SSR_ACADREC_NAV_FL&GPage=SCC_START_PAGE_FL&scname=CTC_ACADEMIC_RECORDS_NAVCOL&AJAXTRANSFER=Y"
            target="_blank"
            rel="ctcLink"
        >
            ctcLink
        </a>{" "}
        under Academic Records → Course History.
        </p>

      <input
        type="number"
        step="0.1"
        min="1.0"
        max="4.0"
        value={gpa !== "" && gpa != null ? Number(gpa).toFixed(1) : ""}
        onChange={(e) => handleGpaChange(e.target.value)}
        className="gpa-input"
      />
      {localError ? (
        <div className="error-message">{localError}</div>
      ) : (
        error && <div className="error-message">{error}</div>
      )}
    </div>
  );
}
