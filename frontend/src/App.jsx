import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import InstructorTeamSetup from "./components/InstructorTeamSetup";
import StudentSurvey from "./StudentSurvey";
import LinkGeneration from "./components/LinkGeneration";
import ThankYouPage from "./components/ThankYouPage";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import InstructorDecryption from "./components/InstructorDecryption";
import SurveySubmissions from "./components/SurveySubmissions";
//import FormingGroups from "./components/FormingGroups";
import ViewSurveys from "./components/ViewSurveys";

import FormingGroups from "./components/FormingGroups";

function App() {
  return (
    <Router basename="/team4mation">
      <>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/setup" element={<InstructorTeamSetup />} />
          <Route path="/view-surveys" element={<ViewSurveys />} />
          <Route path="/generate-link/:id" element={<LinkGeneration />} />
          <Route path="/survey/:id" element={<StudentSurvey />} />
          <Route path="/survey-submissions/:id" element={<SurveySubmissions />} />
          <Route path="/instructor/decrypt/:id" element={<InstructorDecryption />} />
          <Route path="/instructor/smart-teams/:id" element={<FormingGroups />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;