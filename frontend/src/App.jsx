import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import InstructorTeamSetup from "./components/InstructorTeamSetup";
import StudentSurvey from "./StudentSurvey";
import LinkGeneration from "./components/LinkGeneration";
import ThankYouPage from "./components/ThankYouPage";
import Header from "./components/Header";

function App() {
  return (
    <Router basename="/team4mation">
      <div className="main-container">
        <Header />
        <Routes>
          <Route path="/" element={<InstructorTeamSetup />} />
          <Route path="/generate-link/:id" element={<LinkGeneration />} />
          <Route path="/survey/:id" element={<StudentSurvey />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;