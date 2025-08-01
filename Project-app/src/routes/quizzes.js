const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// Route to list all quizzes
router.get('/', quizController.listQuizzes);

// Route to create a new quiz
router.post('/', quizController.createQuiz);

module.exports = router;