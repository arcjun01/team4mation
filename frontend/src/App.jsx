import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import InstructorTeamSetup from "./components/InstructorTeamSetup";
import StudentSurvey from "./StudentSurvey";
import LinkGeneration from "./components/LinkGeneration";
import ThankYouPage from "./components/ThankYouPage";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import InstructorDecryption from "./components/InstructorDecryption";

function App() {
  return (
    <Router basename="/team4mation">
      <div className="main-container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/setup" element={<><Header /><InstructorTeamSetup /></>} />
          <Route path="/generate-link/:id" element={<LinkGeneration />} />
          <Route path="/survey/:id" element={<><Header /><StudentSurvey /></>} />
          <Route path="/instructor/decrypt/:id" element={<InstructorDecryption />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;