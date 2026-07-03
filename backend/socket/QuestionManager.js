import questions from "../data/sampleQuestions.json" with { type: "json" };

class QuestionManager {

  constructor() {
    this.questions = questions;
  }

  getRandomQuestions(count = 5) {

    const shuffled = [...this.questions];

    for (let i = shuffled.length - 1; i > 0; i--) {

      const j = Math.floor(Math.random() * (i + 1));

      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, count);

  }

  sanitizeQuestion(question) {

    return {
      id: question.id,
      domain: question.domain,
      question: question.question,
      options: question.options,
    };

  }

  checkAnswer(question, answer) {

    return question.answer === answer;

  }

}

export default new QuestionManager();