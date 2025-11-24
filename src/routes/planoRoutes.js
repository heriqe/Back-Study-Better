const express = require("express");
const router = express.Router();
const planoController = require("../controllers/planoController");
const meuPlanoController = require("../controllers/meuPlanoController");
const { validatePlano } = require("../validador/planoValidator");
const validationHandler = require("../validador/validationHandler");
const authMiddleware = require("../middlewares/middlewareAutenticacao");

router.get("/", planoController.getAll);
router.get("/enem", planoController.getEnem);
router.get("/:id", planoController.getById);
// user-specific endpoints (manage saved plans)
router.get("/me", authMiddleware, meuPlanoController.getMyPlans);
router.post("/:id/save", authMiddleware, meuPlanoController.savePlan);
router.delete("/:id/save", authMiddleware, meuPlanoController.removeSaved);
// protected routes: require authentication to create/update/delete plans
router.post("/", authMiddleware, validatePlano, validationHandler, planoController.create);
router.put("/:id", authMiddleware, validatePlano, validationHandler, planoController.update);
router.delete("/:id", authMiddleware, planoController.remove);

module.exports = router;
