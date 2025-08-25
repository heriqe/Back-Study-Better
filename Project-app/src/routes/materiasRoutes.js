// src/routes/materiaisRoutes.js
const express = require("express");
const { getMaterias } = require("../controllers/materiaisController");
const router = express.Router();

router.get("/", getMaterias); // GET http://localhost:3000/materiais

module.exports = router;
