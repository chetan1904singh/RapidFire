import { useAuth } from "./context/AuthContext";

function App() {
  const { currentUser } = useAuth();

  return (
    <div className="app">
      <h1>RapidFire</h1>

      {currentUser ? (
        <>
          <h2>Logged In ✅</h2>
          <p>{currentUser.displayName}</p>
          <p>{currentUser.email}</p>
        </>
      ) : (
        <h2>Not Logged In ❌</h2>
      )}
    </div>
  );
}

export default App;