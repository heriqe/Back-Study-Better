const express = require('express');
const router = express.Router();
const quizzesController = require('../controllers/quizzesController');

// Route to list all quizzes
router.get('/', quizzesController.listarQuizzes);

// Route to create a new quiz
router.post('/', quizzesController.criarQuiz);

module.exports = router;