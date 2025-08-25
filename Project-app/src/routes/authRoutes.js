const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Rotas públicas
router.post('/login', authController.login);
router.post('/register', authController.registrar);

module.exports = router;
