const express = require("express");
const router = express.Router();

const { registerValidation, loginValidation } = require("../validador/authValidator");
const validationHandler = require("../validador/validationHandler");
const authController = require("../controllers/authController");

// rota de registro
router.post("/register", registerValidation, validationHandler, authController.registrar);

// rota de login
router.post("/login", loginValidation, validationHandler, authController.login);

module.exports = router;
