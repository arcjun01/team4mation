import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import InstructorTeamSetup from "./components/InstructorTeamSetup";
import StudentSurvey from "./components/studentSurvey/StudentSurvey";
import LinkGeneration from "./components/LinkGeneration";
import ThankYouPage from "./components/studentSurvey/ThankYouPage";
import LandingPage from "./components/LandingPage";
import InstructorDecryption from "./components/InstructorDecryption";
import InstructorFormDetails from "./components/InstructorFormDetails";
import SurveySubmissions from "./components/SurveySubmissions";
//import FormingGroups from "./components/FormingGroups";
import ViewSurveys from "./components/ViewSurveys";
import FormingGroups from "./components/FormingGroups";
import ViewFormedTeams from "./components/ViewFormedTeams";

function App() {
  // Store decrypted datasets using the survey ID as the key: { [surveyId]: { names, userKey } }
  const [decryptedSessions, setDecryptedSessions] = useState({});

  const saveDecryptedSession = (surveyId, sessionData) => {
    setDecryptedSessions(prev => ({
      ...prev,
      [surveyId]: sessionData
    }));
  };

  return (
    <Router>
      <>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/setup" element={<InstructorTeamSetup />} />
          <Route path="/view-surveys" element={<ViewSurveys />} />
          <Route path="/generate-link/:id" element={<LinkGeneration />} />
          <Route path="/:courseName/survey/:id" element={<StudentSurvey />} />
          <Route path="/instructor/form/:id" element={<InstructorFormDetails />} />
          
          <Route 
            path="/survey-submissions/:id" 
            element={
              <SurveySubmissions 
                decryptedSessions={decryptedSessions} 
                saveDecryptedSession={saveDecryptedSession}
              />
            } 
          />
          <Route 
            path="/instructor/decrypt/:id" 
            element={<InstructorDecryption saveDecryptedSession={saveDecryptedSession} />} 
          />
          <Route 
            path="/instructor/smart-teams/:id" 
            element={<FormingGroups decryptedSessions={decryptedSessions} />} 
          />
          
          <Route path="/student-view/teams/:id" element={<ViewFormedTeams />} />
          {/* Alias route used by FormingGroups preview button when app is served under /team4mation */}
          <Route path="/team4mation/student-view/teams/:id" element={<ViewFormedTeams />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;