const express = require("express");
const router = express.Router();
const planoController = require("../controllers/planoController");
const {validatePlano,} = require("../validador/planoValidator");
const validationHandler = require("../validador/validationHandler");

router.get("/", planoController.getAll);
router.get("/enem", planoController.getEnem);
router.get("/:id", planoController.getById);
router.post("/", validatePlano, validationHandler, planoController.create);
router.put("/:id", validatePlano, validationHandler, planoController.update);
router.delete("/:id", planoController.remove);

module.exports = router;
