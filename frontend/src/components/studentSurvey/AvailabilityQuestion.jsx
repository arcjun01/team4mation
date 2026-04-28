import React, { useState } from "react";
import checkmarkIcon from "../../assets/checkmark.svg";

const DAYS = [
  { key: "MON", label: "MON" },
  { key: "TUE", label: "TUE" },
  { key: "WED", label: "WED" },
  { key: "THU", label: "THU" },
  { key: "FRI", label: "FRI" },
  { key: "SAT", label: "SAT" },
  { key: "SUN", label: "SUN" },
];

const TIME_SLOTS = [
  "7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM",
  "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM",
  "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"
];

export default function AvailabilityQuestion({ availability, setAvailability, error, onClear }) {
  const [isDragging, setIsDragging] = useState(false);

  const toggleAvailability = (day, time) => {
    const key = `${day}-${time}`;
    setAvailability((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    if (error) onClear();
  };

  const handleMouseEnter = (day, time) => {
    if (!isDragging) return;
    toggleAvailability(day, time);
  };

  const handleMouseDown = (day, time) => {
    setIsDragging(true);
    toggleAvailability(day, time);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const isSelected = (day, time) => {
    return availability[`${day}-${time}`] || false;
  };

  return (
    <div className="question-container">
      <h2 className="question-title">
        What time slots are you available for team meetings?
      </h2>
      <div className="details">
        Select all that apply.
      </div>

      <div className="placement-center">
        <div className="availability-container">
          <div 
            className="availability-table-wrapper"
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div className="availability-grid">
              <div className="time-header">
                <div className="corner-cell"></div>
                {DAYS.map((day, index) => (
                  <div
                    key={day.key}
                    className={`day-column-header${index === 0 ? " first-day-column-header" : ""}${index === DAYS.length - 1 ? " last-day-column-header" : ""}`}
                  >
                    {day.label}
                  </div>
                ))}
              </div>

              {TIME_SLOTS.map((time) => (
                <div key={time} className="time-row">
                  <div className="time-slot-header">{time}</div>
                  {DAYS.map((day) => (
                    <div
                      key={`${day.key}-${time}`}
                      className="time-cell-background"
                      onMouseDown={() => handleMouseDown(day.key, time)}
                      onMouseEnter={() => handleMouseEnter(day.key, time)}
                    >
                      <div
                        className={"time-cell" + (isSelected(day.key, time) ? " selected" : "")}
                      >
                        {isSelected(day.key, time) && (
                          <img src={checkmarkIcon} alt="selected" className="checkmark-icon" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="error-container">
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}
