const express = require('express');
const app = express();
require('dotenv').config(); 
require('./connection');
const cors = require('cors');
const Quiz = require('./models/Quiz');
const Score = require('./models/Score');
const User = require('./models/User');
const { generateJoinCode } = require('./generator'); 

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 1500; 

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
        res.json({ username: user.username, id: user._id });
    } else {
        res.status(401).json({ error: "Invalid credentials." });
    }
});

app.post('/api/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        const newUser = new User({ username, password });
        await newUser.save();
        res.status(201).json({ message: "User created!", user: { username: newUser.username } });
    } catch (err) {
        res.status(400).json({ error: "Username already taken." });
    }
});

app.post('/api/quizzes', async (req, res) => {
    try {
        const { quizTitle, creatorName, questions } = req.body;
        
        const newQuiz = new Quiz({
            quizTitle,
            creatorName,
            joinCode: generateJoinCode(),
            questions
        });

        const savedQuiz = await newQuiz.save();

        res.status(201).json(savedQuiz); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create quiz." });
    }
});

app.post('/api/scores', async (req, res) => {
    try {
        const { quizId, username, score, totalQuestions } = req.body;
        const newScore = new Score({ quizId, username, score, totalQuestions });
        await newScore.save();
        res.status(201).json({ message: "Score saved! 🏆" });
    } catch (err) {
        res.status(500).json({ error: "Failed to save score." });
    }
});

app.get('/', (req, res) => {
    res.send('Hello World');
});
app.get('/api/scores/:quizId', async (req, res) => {
    try {
        const leaderboard = await Score.find({ quizId: req.params.quizId })
            .sort({ score: -1 })
            .limit(10);
        res.json(leaderboard);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch leaderboard." });
    }
});

app.get('/api/quizzes/join/:code', async (req, res) => {
    try {
        const quiz = await Quiz.findOne({ joinCode: req.params.code.toUpperCase() });
        
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found! Check your code." });
        }
        
        res.json(quiz);
    } catch (err) {
        res.status(500).json({ error: "Server error during join." });
    }
});
app.get('/api/users/leaderboard', async (req, res) => {
    try {
        const topUsers = await User.find()
            .sort({ totalPoints: -1 })
            .limit(10); 
        res.json(topUsers);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch top users" });
    }
});

app.get('/api/leaderboard/:categoryId', async (req, res) => {
    try {
        const { categoryId } = req.params;
        const topScores = await Score.find({ categoryId }) 
            .sort({ score: -1 })
            .limit(10)
            .populate('userId', 'username'); 
        res.json(topScores);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
});

app.get('/api/my-quizzes/leaderboard/:userId', async (req, res) => {
    try {
        const userQuizzes = await Quiz.find({ creatorId: req.params.userId }).select('_id');
        const quizIds = userQuizzes.map(q => q._id);

        const leaders = await Score.find({ quizId: { $in: quizIds } })
            .sort({ score: -1 })
            .limit(10);
        res.json(leaders);
    } catch (err) {
        res.status(500).json({ error: "Error fetching your quiz leaders" });
    }
});

app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (err) {
        res.status(404).json({ error: "User not found" });
    }
});
app.get('/api/scores/user/:userId', async (req, res) => {
    try {
        const history = await Score.find({ userId: req.params.userId })
            .populate('quizId', 'quizTitle')
            .sort({ createdAt: -1 }) 
            .limit(10); 
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch history" });
    }
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});