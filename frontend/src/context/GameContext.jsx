import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useSocket } from "./SocketContext";
import { EVENTS } from "../utils/events";

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export function GameProvider({ children }) {
  const socket = useSocket();

  const [roomId, setRoomId] = useState(null);

  const [question, setQuestion] = useState(null);

  const [timer, setTimer] = useState(20);

  const [scores, setScores] = useState({});

  const [winner, setWinner] = useState(null);

  const [totalQuestions, setTotalQuestions] = useState(0);

  const [gameStarted, setGameStarted] = useState(false);

  const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {

    socket.on(EVENTS.GAME_START, (data) => {

      console.log("🎮 GAME START");

      setRoomId(data.roomId);

      setTotalQuestions(data.totalQuestions);

      setGameStarted(true);

    });

    socket.on(EVENTS.NEXT_QUESTION, (data) => {

      console.log("📖 NEXT QUESTION");

      setQuestion(data);

    });

    socket.on(EVENTS.TIMER_UPDATE, (time) => {

      setTimer(time);

    });

    socket.on(EVENTS.SCORE_UPDATE, (data) => {

      setScores(data.scores);

    });

    socket.on(EVENTS.GAME_OVER, (data) => {

      setWinner(data.winner);

      setScores(data.scores);

      setGameFinished(true);

    });

    return () => {

      socket.off(EVENTS.GAME_START);

      socket.off(EVENTS.NEXT_QUESTION);

      socket.off(EVENTS.TIMER_UPDATE);

      socket.off(EVENTS.SCORE_UPDATE);

      socket.off(EVENTS.GAME_OVER);

    };

  }, [socket]);

  return (

    <GameContext.Provider

      value={{

        roomId,

        question,

        timer,

        scores,

        winner,

        totalQuestions,

        gameStarted,

        gameFinished,

      }}

    >

      {children}

    </GameContext.Provider>

  );

}