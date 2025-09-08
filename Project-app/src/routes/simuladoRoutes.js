const express = require("express");
const router = express.Router();
const simuladoController = require("../controllers/simuladoController");
const { validateSimulado } = require("../validador/simuladoValidator");
const validationHandler = require("../validador/validationHandler");

// Listar todos
router.get("/", simuladoController.getAll);

// Buscar por ID
router.get("/:id", simuladoController.getById);

// Criar com validação
router.post("/", validateSimulado, validationHandler,simuladoController.create);

// Atualizar com validação
router.put("/:id",  validateSimulado, validationHandler,simuladoController.update);

// Deletar
router.delete("/:id", simuladoController.remove);

module.exports = router;
