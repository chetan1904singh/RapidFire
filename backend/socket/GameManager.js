import Room from "./Room.js";
import QuestionManager from "./QuestionManager.js";
import MatchmakingQueue from "./MatchmakingQueue.js";
import PlayerManager from "./PlayerManager.js";
import TimerManager from "./TimerManager.js";
import { EVENTS } from "./events.js";

class GameManager {
  constructor(io) {
    this.io = io;
    this.rooms = new Map();
    this.timerManager = new TimerManager(io);
  }

  // =====================================
  // MATCHMAKING
  // =====================================

  findMatch(uid) {
    const player = PlayerManager.getPlayer(uid);

    if (!player) return;

    if (player.status !== "idle") {
      console.log(`${player.email} already ${player.status}`);
      return;
    }

    player.status = "searching";

    MatchmakingQueue.add(player);

    console.log(`${player.email} Searching...`);

    if (MatchmakingQueue.size() >= 2) {
      const [player1, player2] = MatchmakingQueue.popTwoPlayers();

      const room = this.createRoom(player1, player2);

      player1.socket.emit(EVENTS.GAME_START, {
        roomId: room.id,
        totalQuestions: room.questions.length,
      });

      player2.socket.emit(EVENTS.GAME_START, {
        roomId: room.id,
        totalQuestions: room.questions.length,
      });
    }
  }

  cancelMatch(uid) {
    MatchmakingQueue.remove(uid);

    PlayerManager.setStatus(uid, "idle");
  }

  disconnect(uid) {
    MatchmakingQueue.remove(uid);

    PlayerManager.removePlayer(uid);
  }

  // =====================================
  // ROOM
  // =====================================

  createRoom(player1, player2) {
    const room = new Room(player1, player2);

    room.questions = QuestionManager.getRandomQuestions(5);

    room.status = "waiting";

    this.rooms.set(room.id, room);

    PlayerManager.setStatus(player1.uid, "playing");
    PlayerManager.setStatus(player2.uid, "playing");

    PlayerManager.setRoom(player1.uid, room.id);
    PlayerManager.setRoom(player2.uid, room.id);

    player1.socket.join(room.id);
    player2.socket.join(room.id);

    console.log("--------------------------------");
    console.log("🎮 ROOM CREATED");
    console.log("Room:", room.id);
    console.log("Player 1:", player1.email);
    console.log("Player 2:", player2.email);
    console.log("--------------------------------");

    return room;
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  // =====================================
  // READY
  // =====================================

  playerReady(uid, roomId) {
    const room = this.getRoom(roomId);

    if (!room) return;

    room.markReady(uid);

    console.log(
      `Ready ${room.readyPlayers.size}/${room.players.length}`
    );

    if (room.allPlayersReady()) {
      room.status = "playing";

      this.sendCurrentQuestion(room.id);
    }
  }

  // =====================================
  // QUESTIONS
  // =====================================

  sendCurrentQuestion(roomId) {
    const room = this.getRoom(roomId);

    if (!room) return;

    room.answers = {};

    const question = room.getCurrentQuestion();

    if (!question) return;

    this.io.to(room.id).emit(EVENTS.NEXT_QUESTION, {
      roomId: room.id,
      questionNumber: room.currentQuestionIndex + 1,
      totalQuestions: room.questions.length,
      question: QuestionManager.sanitizeQuestion(question),
    });

    console.log(
      `Question ${room.currentQuestionIndex + 1} Sent`
    );

    this.timerManager.start(room, () => {
      console.log("⏰ Time Up");

      this.finishCurrentQuestion(room.id);
    });
  }

  // =====================================
  // ANSWERS
  // =====================================

  submitAnswer(uid, roomId, answer) {
    const room = this.getRoom(roomId);

    if (!room) return;

    // Prevent answering twice
    if (room.answers[uid] !== undefined) return;

    room.submitAnswer(uid, answer);

    if (room.allAnswered()) {
      this.timerManager.stop(room.id);

      this.finishCurrentQuestion(room.id);
    }
  }

  finishCurrentQuestion(roomId) {
    const room = this.getRoom(roomId);
    if (!room) return;

    const currentQuestion = room.getCurrentQuestion();

    for (const player of room.players) {
      const answer = room.answers[player.uid];
      if (
        QuestionManager.checkAnswer(currentQuestion, answer)
      ) {
        room.addScore(player.uid, 10);
      }
    }

    // FIX #2 (Backend): Map scores to emails/names so UIDs are never sent to the frontend
    const safeScores = {};
    for (const player of room.players) {
      // Fallback to "Player" if email or name isn't attached to the player object
      const displayName = player.name || player.email || "Player"; 
      safeScores[displayName] = room.scores[player.uid] || 0;
    }

    this.io.to(room.id).emit(EVENTS.SCORE_UPDATE, {
      scores: safeScores, 
    });

    room.nextQuestion();

    if (!room.hasMoreQuestions()) {
      this.finishGame(room.id);
      return;
    }

    setTimeout(() => {
      this.sendCurrentQuestion(room.id);
    }, 3000);
  }

  // =====================================
  // GAME OVER
  // =====================================

  finishGame(roomId) {
    const room = this.getRoom(roomId);
    if (!room) return;

    this.timerManager.stop(room.id);

    const winner = room.getWinner();

    this.io.to(room.id).emit(EVENTS.GAME_OVER, {
      winner: winner
        ? {
            // Removed winner.uid here to ensure absolute zero UID leakage
            name: winner.name,
            email: winner.email,
          }
        : null,

      // Format scores safely for the final game over screen too
      scores: Object.keys(room.scores).reduce((acc, uid) => {
        const player = room.players.find(p => p.uid === uid);
        const displayName = player ? (player.name || player.email) : "Player";
        acc[displayName] = room.scores[uid];
        return acc;
      }, {}),
    });

    console.log("🏆 GAME OVER");

    for (const player of room.players) {
      PlayerManager.clearRoom(player.uid);
    }

    this.rooms.delete(room.id);
  }
}

export default GameManager;