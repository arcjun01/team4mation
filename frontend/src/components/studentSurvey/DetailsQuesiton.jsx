import React from "react";

export default function DetailsQuesiton({ details = "", setDetails }) {
  return (
    <div className="question-container">
      <textarea
        className="input-field full-input"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        rows="4"
        placeholder="Optional details..."
      />
    </div>
  );
}
