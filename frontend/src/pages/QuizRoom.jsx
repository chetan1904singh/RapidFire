import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { useGame } from "../context/GameContext";
import { EVENTS } from "../utils/events";

function QuizRoom() {
  const socket = useSocket();
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const { roomId } = useParams();

  const {
    question,
    timer,
    scores
  } = useGame();

  useEffect(() => {
    // Tell backend this player is ready
    if (!roomId) return;

    socket.emit(EVENTS.PLAYER_READY, roomId);

    const handleGameOver = () => {
      navigate("/result");
    };

    socket.on(EVENTS.GAME_OVER, handleGameOver);

    return () => {
      socket.off(EVENTS.GAME_OVER, handleGameOver);
    };
  }, [roomId, socket, navigate]);

  // FIX #1: Reset the selected answer when a new question arrives
  useEffect(() => {
    setSelected(null);
  }, [question]);

  const submitAnswer = (index) => {
    if (selected !== null) return;

    setSelected(index);

    socket.emit(EVENTS.SUBMIT_ANSWER, {
      roomId,
      answer: index
    });
  };

  if (!question) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Waiting for Question...</h2>
      </div>
    );
  }

 return (
  <div className="min-h-screen flex items-center justify-center px-4 py-8">
    <div className="w-full max-w-5xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">
            ⚡ RapidFire Quiz
          </h2>
          <p className="text-gray-300 mt-2">
            Question {question.questionNumber} / {question.totalQuestions}
          </p>
        </div>

        <div className="bg-red-500/20 border border-red-400 rounded-xl px-6 py-3">
          <h2 className="text-3xl font-bold text-red-400">
            ⏰ {timer}s
          </h2>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8">
        <h2 className="text-2xl font-semibold text-white text-center">
          {question.question.question}
        </h2>
      </div>

      {/* Options */}
      <div className="grid gap-5">
        {question.question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => submitAnswer(index)}
            disabled={selected !== null}
            className={`
              w-full text-left px-6 py-4 rounded-xl
              transition-all duration-300
              font-semibold text-lg

              ${
                selected === index
                  ? "bg-blue-600 text-white scale-105 shadow-lg shadow-blue-500/50"
                  : "bg-white/10 text-white hover:bg-blue-500/20 hover:border-blue-400"
              }

              ${
                selected !== null && selected !== index
                  ? "opacity-50"
                  : ""
              }

              border border-white/20
            `}
          >
            <span className="font-bold mr-3">
              {String.fromCharCode(65 + index)}.
            </span>
            {option}
          </button>
        ))}
      </div>

      {/* Scoreboard */}
      <div className="mt-10 border-t border-white/20 pt-8">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">
          🏆 Live Scoreboard
        </h2>

        <div className="space-y-3">
          {scores &&
            Object.entries(scores).map(([playerName, score], index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-white/5 rounded-xl px-5 py-4 border border-white/10"
              >
                <span className="text-white font-medium">
                  {playerName}
                </span>

                <span className="text-green-400 text-xl font-bold">
                  {score} pts
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  </div>
);
}

export default QuizRoom;