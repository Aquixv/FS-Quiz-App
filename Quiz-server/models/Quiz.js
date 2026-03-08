const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    quizTitle: { type: String, required: true },
    joinCode: { type: String, unique: true, required: true }, // The 'Room Code'
    creatorName: { type: String, default: "Anonymous" },
    questions: [
        {
            questionText: { type: String, required: true },
            correctAnswer: { type: String, required: true },
            incorrectAnswers: [{ type: String, required: true }] // Array of 3 strings
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', QuizSchema);