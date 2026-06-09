import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import InstructorTeamSetup from "./components/InstructorTeamSetup";
import StudentSurvey from "./components/studentSurvey/StudentSurvey";
import LinkGeneration from "./components/LinkGeneration";
import ThankYouPage from "./components/studentSurvey/ThankYouPage";
import LandingPage from "./components/LandingPage";
import InstructorDecryption from "./components/InstructorDecryption";
import InstructorFormDetails from "./components/InstructorFormDetails";
import SurveySubmissions from "./components/SurveySubmissions";
import ViewSurveys from "./components/ViewSurveys";
import FormingGroups from "./components/FormingGroups";
import ViewFormedTeams from "./components/ViewFormedTeams";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
        const loginUrl = import.meta.env.VITE_LOGIN_URL || 'http://localhost:8000/login.php';
        window.location.href = loginUrl;
        return null;
    }
    return children;
};

function App() {
    const [decryptedSessions, setDecryptedSessions] = useState({});

    const saveDecryptedSession = (surveyId, sessionData) => {
        setDecryptedSessions(prev => ({
            ...prev,
            [surveyId]: sessionData
        }));
    };

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
        localStorage.setItem('auth_token', token);
        window.history.replaceState({}, '', '/');
    }

    return (
        <Router>
            <>
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/:courseName/survey/:id" element={<StudentSurvey />} />
                    <Route path="/thank-you" element={<ThankYouPage />} />
                    <Route path="/student-view/teams/:id" element={<ViewFormedTeams />} />
                    <Route path="/team4mation/student-view/teams/:id" element={<ViewFormedTeams />} />

                    {/* Protected instructor routes */}
                    <Route path="/setup" element={<ProtectedRoute><InstructorTeamSetup /></ProtectedRoute>} />
                    <Route path="/view-surveys" element={<ProtectedRoute><ViewSurveys /></ProtectedRoute>} />
                    <Route path="/generate-link/:id" element={<ProtectedRoute><LinkGeneration /></ProtectedRoute>} />
                    <Route path="/instructor/form/:id" element={<ProtectedRoute><InstructorFormDetails /></ProtectedRoute>} />
                    <Route path="/survey-submissions/:id" element={
                        <ProtectedRoute>
                            <SurveySubmissions 
                                decryptedSessions={decryptedSessions} 
                                saveDecryptedSession={saveDecryptedSession}
                            />
                        </ProtectedRoute>
                    } />
                    <Route path="/instructor/decrypt/:id" element={
                        <ProtectedRoute>
                            <InstructorDecryption saveDecryptedSession={saveDecryptedSession} />
                        </ProtectedRoute>
                    } />
                    <Route path="/instructor/smart-teams/:id" element={
                        <ProtectedRoute>
                            <FormingGroups decryptedSessions={decryptedSessions} />
                        </ProtectedRoute>
                    } />

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </>
        </Router>
    );
}

export default App;