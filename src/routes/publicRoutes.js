const express = require("express");
const router = express.Router();
// require the controller with the correct path/case
const PublicController = require("../controllers/publicController");

// Rotas públicas
router.get("/", PublicController.home);
router.get("/health", PublicController.health);

module.exports = router;
