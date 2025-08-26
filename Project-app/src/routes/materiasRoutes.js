// src/routes/materiaisRoutes.js
const express = require("express");
const { materiaisController } = require("../controllers/materiasController");
const router = express.Router();

// rota para todas as matérias
router.get('/', materiaisController.getMaterias)

// rota para uma matéria específica
router.get('/:id', materiaisController.getMateriaById)

module.exports = router;
