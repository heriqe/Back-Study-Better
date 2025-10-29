const express = require("express");
const router = express.Router();
const simuladoController = require("../controllers/simuladoController");
const { validateSimulado } = require("../validador/simuladoValidator");
const validationHandler = require("../validador/validationHandler");

// Listar todos
router.get("/", simuladoController.getAll);
router.get("/:id", simuladoController.getById);
router.post("/", validateSimulado, validationHandler,simuladoController.create);
router.put("/:id",  validateSimulado, validationHandler,simuladoController.update);
router.delete("/:id", simuladoController.remove);

module.exports = router;
