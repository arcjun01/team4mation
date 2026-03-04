import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import InstructorTeamSetup from "./components/InstructorTeamSetup";
import StudentSurvey from "./components/StudentSurvey.jsx"; 
import LinkGeneration from "./components/LinkGeneration.jsx";
import InstructorDecryption from "./components/InstructorDecryption";
import SurveySubmissions from "./components/SurveySubmissions";

function App() {
  return (
    <Router>
      <div style={{ padding: '20px' }}>
        <h1>Team4mation</h1>
        <p>Create smart student teams easily.</p>
        
        <Routes>
          {/* Default to Instructor Setup */}
          <Route path="/" element={<InstructorTeamSetup />} />
          
          {/* Route for the generated link */}
          <Route path="/generate-link/:id" element={<LinkGeneration />} />
          
          {/* Student view */}
          <Route path="/survey/:id" element={<StudentSurvey />} />

          {/* Instructor Decryption Entry Point */}
          <Route path="/instructor/decrypt/:id" element={<InstructorDecryption />} />

          {/* Decrypted Submissions List */}
          <Route path="/survey-submissions" element={<SurveySubmissions />} />
          
          {/* Redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;