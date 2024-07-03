const express = require('express');
const router = express.Router();
const Quiz = require('../models/quiz.model'); // Adjust model name as per your implementation
const quizModel = require('../models/quiz.model');

// Add a new quiz
router.post('/add', async (req, res) => {
    try {
        const { questions } = req.body;

        console.log(questions, "from body questions");

        const quizData = await Promise.all(questions.map(async (item) => {
            const { question, options, correctAnswerIndex } = item;
    
            if (!question || options.length <= 0 || !correctAnswerIndex) {
                throw new Error('All fields are required');
            }
            
            const newQuestion = await quizModel.create({
                question: question,
                options: options,
                correctAnswer: new String(correctAnswerIndex)  // Adjusted property name
            });
    
            return newQuestion;  // Returning the actual created question
        }));
    
        return res.status(200).json(quizData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error adding quiz', error });
    }
});

module.exports = router;
