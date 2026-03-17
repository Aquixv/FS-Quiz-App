const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    quizTitle: { type: String, required: true },
    joinCode: { type: String, unique: true, required: true },
    creatorName: { type: String, default: "Anonymous" },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    questions: [
        {
            questionText: { type: String, required: true },
            correctAnswer: { type: String, required: true },
            incorrectAnswers: [{ type: String, required: true }]
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', QuizSchema);