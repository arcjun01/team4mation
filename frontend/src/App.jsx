import InstructorTeamSetup from "./components/InstructorTeamSetup";
import StudentSurvey from "./StudentSurvey";
import LinkGeneration from "./components/LinkGeneration.jsx";
import { useState } from "react";

function App() {
  const [view, setView] = useState("student"); 

  return (
    <div>
      <h1 style={{ paddingLeft: '20px' }}>Team4mation</h1>
<p style={{ paddingLeft: '20px' }}>Create smart student teams easily.</p>
      {/* Toggle buttons for student/instructor view */}
      <button onClick={() => setView("student")}>Student View</button>
      <button onClick={() => setView("instructor")}>Instructor View</button>

      <hr />
      {view === "student" ? <StudentSurvey /> : <InstructorTeamSetup />}

      <LinkGeneration />
    </div>
  );
}

export default App;
