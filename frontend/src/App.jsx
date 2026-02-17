import LinkGeneration from "./components/LinkGeneration.jsx";

function App() {
  return (
    <div>
      {/* Will update in a separate CSS file soon */}
      <h1 style={{ paddingLeft: '20px' }}>Team4mation</h1>
      <p style={{ paddingLeft: '20px' }}>Create smart student teams easily.</p>

      <LinkGeneration />
    </div>
  );
}
export default App;