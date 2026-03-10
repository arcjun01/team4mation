import React from "react";

export default function GpaQuestion({ gpa, gpaError, setGpa, setGpaError, prevCourse }) {
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

  const courseDisplay = prevCourse || "SDEV 344";

  return (
    <div className="question-container">
      <h2 className="question-title">What was your final GPA in {courseDisplay}? Enter or adjust below</h2>
      <p className="details">
        You can view your GPA in{" "}
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
        value={gpa ? parseFloat(gpa).toFixed(1) : ""}
        onChange={(e) => handleGpaChange(e.target.value)}
        className="gpa-input"
      />
      {gpaError && <div className="gpa-error">{gpaError}</div>}
    </div>
  );
}
