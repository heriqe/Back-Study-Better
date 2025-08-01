const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

router.get('/quizzes/:quizId/questions', questionController.listQuestions);
router.post('/quizzes/:quizId/questions', questionController.createQuestion);
router.get('/questions/:questionId', questionController.getQuestion);
router.delete('/questions/:questionId', questionController.deleteQuestion);

module.exports = router;