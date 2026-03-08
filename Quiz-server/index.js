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

        // This is where the save belongs!
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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});