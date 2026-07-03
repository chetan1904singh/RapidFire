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
    <div style={{ padding: 40 }}>
      <h2>
        Question {question.questionNumber} / {question.totalQuestions}
      </h2>

      <h3>⏰ {timer}</h3>
      <br />

      <h2>{question.question.question}</h2>
      <br />

      {question.question.options.map((option, index) => (
        <button
          key={index}
          onClick={() => submitAnswer(index)}
          disabled={selected !== null} // FIX #3: Disable buttons after answering to prevent confusion
          style={{
            display: "block",
            marginBottom: 15,
            padding: 15,
            width: "350px",
            opacity: selected !== null && selected !== index ? 0.6 : 1, // Visual feedback
            backgroundColor: selected === index ? "#e0e0e0" : "initial" // Visual feedback
          }}
        >
          {option}
        </button>
      ))}

      <hr />
      
      <h2>Scores</h2>
      {/* FIX #2: Clean UI instead of JSON.stringify to ensure no UIDs ever render */}
      <div>
        {scores && Object.entries(scores).map(([playerName, score], index) => (
           <h3 key={index} style={{ margin: "5px 0" }}>
             {playerName}: {score}
           </h3>
        ))}
      </div>
    </div>
  );
}

export default QuizRoom;