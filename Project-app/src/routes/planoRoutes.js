const express = require("express");
const planosController = require("../controllers/planoController");
const auth = require("../middlewares/middlewareAutenticacao"); // importa o middleware

const router = express.Router();

// Apenas usuários logados podem acessar
router.get("/", auth, planosController.getPlanos);
router.get("/:id", auth, planosController.getPlanoById);
router.post("/", auth, planosController.createPlano);
router.put("/:id", auth, planosController.updatePlano);
router.delete("/:id", auth, planosController.deletePlano);

module.exports = router;
