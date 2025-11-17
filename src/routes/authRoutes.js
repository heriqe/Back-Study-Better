const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController"); // ajustado para ../controllers
const { registerValidator, loginValidator } = require("../validators/authValidator"); // movido para ../validators
const validationHandler = require("../validators/validationHandler"); // movido para ../validators

// Rota de registro
router.post(
  "/register",
  registerValidator,
  validationHandler,
  authController.registrar
);

// Rota de login
router.post(
  "/login",
  loginValidator,
  validationHandler,
  authController.login
);

module.exports = router;
