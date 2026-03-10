const express = require('express');
const app = express();
require('dotenv').config(); 
require('./connection');
const cors = require('cors');
const Quiz = require('./models/Quiz');
const { generateJoinCode } = require('./generator'); 

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 1500; 



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

app.get('/', (req, res) => {
    res.send('Hello World');
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
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});