import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import InstructorTeamSetup from "./components/InstructorTeamSetup";
import StudentSurvey from "./StudentSurvey";
import Header from "./components/Header";

function App() {
  return (
    <div className="main-container">
      <Header />
      <StudentSurvey />
    </div>
  );
}

export default App;