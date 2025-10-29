const express = require("express");
const authController = require("../controllers/authController");
const { registerValidation, loginValidation } = require("../validador/authValidator");
const validationHandler = require("../validador/validationHandler");

const router = express.Router();

router.post("/register", registerValidation, validationHandler, authController.registrar);
router.post("/login", loginValidation, validationHandler, authController.login);

module.exports = router;
