import InstructorTeamSetup from "./components/InstructorTeamSetup";
import StudentSurvey from "./StudentSurvey";
import { useState } from "react";

function App() {
  const [view, setView] = useState("student"); 

  return (
    <div>
      <h1>Team4mation</h1>
      <p>Create smart student teams easily.</p>
      
      <button onClick={() => setView("student")}>Student View</button>
      <button onClick={() => setView("instructor")}>Instructor View</button>

      <hr />

      {view === "student" ? <StudentSurvey /> : <InstructorTeamSetup />}
    </div>
  );
}

export default App;