import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import InstructorTeamSetup from "./components/InstructorTeamSetup";
import StudentSurvey from "./components/StudentSurvey";
import LinkGeneration from "./components/LinkGeneration";
import InstructorDecryption from "./components/InstructorDecryption";
import SurveySubmissions from "./components/SurveySubmissions";
import Header from "./components/Header";

function App() {
  return (
    <Router>
      <div className="main-container">
        <Header />

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

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;