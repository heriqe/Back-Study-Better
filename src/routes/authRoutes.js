const express = require("express");
const router = express.Router();

const { login, register } = require('../controllers/authController');
const { authSchema } = require('../validador/authValidator');
const validationHandler = require('../validador/validationHandler');

// Rota de registro
router.post(
  "/register",
  authSchema.register,
  validationHandler,
  register
);

// Rota de login
router.post(
  "/login",
  authSchema.login,
  validationHandler,
  login
);

module.exports = router;
