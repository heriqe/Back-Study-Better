const express = require('express');
const router = express.Router();
const questionsController = require('../controllers/questionsController');

// Use o nome correto da função exportada:
router.get('/:quizId', questionsController.listarQuestoes);
router.post('/:questionId/validate', questionsController.validarResposta);

module.exports = router;