import crypto from "crypto";

export default class Room {
  constructor(player1, player2) {
    this.id = crypto.randomUUID();

    // Players
    this.players = [player1, player2];

    // Questions
    this.questions = [];
    this.currentQuestionIndex = 0;

    // Answers of current question
    this.answers = {};

    // Scores
    this.scores = {
      [player1.uid]: 0,
      [player2.uid]: 0,
    };

    // Ready players
    this.readyPlayers = new Set();

    // Timer
    this.timer = null;
    this.timeLeft = 20;

    // Match State
    this.status = "waiting"; // waiting | playing | finished
  }

  // ----------------------------
  // Player Ready
  // ----------------------------

  markReady(uid) {
    this.readyPlayers.add(uid);
  }

  allPlayersReady() {
    return this.readyPlayers.size === this.players.length;
  }

  // ----------------------------
  // Questions
  // ----------------------------

  getCurrentQuestion() {
    return this.questions[this.currentQuestionIndex];
  }

  nextQuestion() {
    this.currentQuestionIndex++;
    this.answers = {};
  }

  hasMoreQuestions() {
    return this.currentQuestionIndex < this.questions.length;
  }

  // ----------------------------
  // Answers
  // ----------------------------

  submitAnswer(uid, answer) {
    this.answers[uid] = answer;
  }

  allAnswered() {
    return Object.keys(this.answers).length === this.players.length;
  }

  // ----------------------------
  // Scores
  // ----------------------------

  addScore(uid, points) {
    this.scores[uid] += points;
  }

  getWinner() {
    const [p1, p2] = this.players;

    if (this.scores[p1.uid] > this.scores[p2.uid])
      return p1;

    if (this.scores[p2.uid] > this.scores[p1.uid])
      return p2;

    return null;
  }
}