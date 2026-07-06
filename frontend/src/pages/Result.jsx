import { useGame } from "../context/GameContext";
import { useNavigate } from "react-router-dom";

function Result() {

  const navigate = useNavigate();

  const { winner, scores } = useGame();

  return (
  <div className="min-h-screen flex items-center justify-center px-4 py-8">
    <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8 text-center">

      <h1 className="text-5xl font-extrabold text-yellow-400 mb-8">
        🏆 Game Over
      </h1>

      {winner ? (
        <>
          <p className="text-gray-300 text-lg mb-2">
            Winner
          </p>

          <h2 className="text-4xl font-bold text-yellow-300 mb-8">
            🎉 {winner.name}
          </h2>
        </>
      ) : (
        <h2 className="text-3xl font-bold text-blue-300 mb-8">
          🤝 It's a Draw!
        </h2>
      )}

      {/* Final Scores */}
      <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-8">
        <h2 className="text-2xl font-bold text-white mb-5">
          📊 Final Scores
        </h2>

        <div className="space-y-4">
          {Object.entries(scores).map(([playerName, score], index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-white/10 rounded-xl px-5 py-4"
            >
              <span className="text-white text-lg font-medium">
                {playerName}
              </span>

              <span className="text-green-400 text-2xl font-bold">
                {score} pts
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => navigate("/profile")}
        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition duration-200 text-white font-semibold text-lg"
      >
        🔄 Back to Profile
      </button>

    </div>
  </div>
);
}

export default Result;