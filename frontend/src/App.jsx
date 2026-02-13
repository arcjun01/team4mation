import InstructorTeamSetup from "./components/InstructorTeamSetup";
import StudentSurvey from "./StudentSurvey";

function App() {
  return (
    <div>
      <h1>Team4mation</h1>
      <p>Create smart student teams easily.</p>

      <hr />
      {/* Testing the InstructorTeamSetUp component */}
      {/* <InstructorTeamSetup /> */}
      <StudentSurvey />
    </div>
  );
}

export default App;
