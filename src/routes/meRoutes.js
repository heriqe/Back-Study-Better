const express = require("express");
const authMiddleware = require("../middlewares/middlewareAutenticacao");
const meController = require("../controllers/meController");
const router = express.Router();

router.get("/me", authMiddleware, meController.me);
module.exports = router;
