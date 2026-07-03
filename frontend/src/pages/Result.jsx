import { useGame } from "../context/GameContext";
import { useNavigate } from "react-router-dom";

function Result() {

  const navigate = useNavigate();

  const { winner, scores } = useGame();

  return (
    <div style={{ padding: 40 }}>

      <h1>🏆 Game Over</h1>

      <br />

      {winner ? (
        <>
          <h2>Winner</h2>

          <h1 style={{ color: "gold" }}>
             {winner.name}
          </h1>
        </>
      ) : (
        <h2>🤝 Match Draw</h2>
      )}

      <br />

      <h2>Final Scores</h2>

      <pre>
        {JSON.stringify(scores, null, 2)}
      </pre>

      <br />

      <button onClick={() => navigate("/profile")}>
        Back to Profile
      </button>

    </div>
  );
}

export default Result;