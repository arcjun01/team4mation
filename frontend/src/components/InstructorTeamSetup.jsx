import React, { useState } from 'react';
import '../css/InstructorSetup.css'; 

const InstructorTeamSetup = () => {
  const [formData, setFormData] = useState({
    classSize: '',
    minSize: '',
    maxSize: '3', 
    prevCourse: ''
  });

  const [teams, setTeams] = useState([]); 
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // We call the GET route. 
      const response = await fetch(`http://localhost:3001/teams?teamSize=${formData.maxSize}`);
      const data = await response.json();

      if (data.teams) {
        setTeams(data.teams);
        alert("Teams generated successfully from database!");
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
      alert("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="setup-container">
      <h1 className="setup-title">Instructor View: Team Setup</h1>
      <hr className="divider" />
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
           <label>Team Size (Max):</label>
           <input 
              className="input-field small-input"
              type="number" 
              name="maxSize" 
              value={formData.maxSize} 
              onChange={handleChange} 
            />
        </div>

        <button type="submit" className="create-button" disabled={loading}>
          {loading ? "Generating..." : "Create & View Teams"}
        </button>
      </form>

      {/* --- Display the Results --- */}
      {teams.length > 0 && (
        <div className="teams-display">
          <h2>Generated Teams</h2>
          {teams.map((team, index) => (
            <div key={index} className="team-card">
              <h3>Team {index + 1}</h3>
              <ul>
                {team.map((student) => (
                  <li key={student.student_id}>
                    ID: {student.student_id} | Gender: {student.gender}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorTeamSetup;