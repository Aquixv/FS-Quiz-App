const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: { type: String, required: false }, 
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: false },
    categoryId: { type: String }, 
    score: { type: Number, required: true },
    totalQuestions: { type: Number },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Score', scoreSchema);