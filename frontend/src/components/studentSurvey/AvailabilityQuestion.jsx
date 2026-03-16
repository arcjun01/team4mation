import React, { useState } from "react";
import checkmarkIcon from "../../assets/checkmark.svg";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

// All 24 hours
const ALL_TIME_SLOTS = [
  "12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", 
  "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM",
  "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM",
  "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"
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

      <div className="availability-container">
        {/* Days of the week labels */}
        <div className="days-column">
          <div className="days-spacer"></div>
          {DAYS.map((day) => (
            <div key={day} className="day-item">{day}</div>
          ))}
        </div>

        {/* Time grid */}
        <div 
          className="availability-table-wrapper"
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="ckeckboxes-frame">
            {/* Header row with time slots */}
            <div className="time-header">
              {ALL_TIME_SLOTS.map((time) => (
                <div key={time} className="time-slot-header">
                  {time}
                </div>
              ))}
            </div>

            {/* Day rows */}
            {DAYS.map((day) => (
            <div key={day} className="day-row">
                {ALL_TIME_SLOTS.map((time) => (
                <div
                    key={`${day}-${time}`}
                    className="time-cell-background"
                    onMouseDown={() => handleMouseDown(day, time)}
                    onMouseEnter={() => handleMouseEnter(day, time)}
                >
                    <div
                    className={`time-cell ${isSelected(day, time) ? "selected" : ""}`}
                    >
                    {isSelected(day, time) && (
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
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
