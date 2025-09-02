const express = require("express");
const router = express.Router();
const middlewareAutenticacao = require("../middlewares/middlewareAutenticacao");

router.get("/perfil", middlewareAutenticacao, (req, res) => {
  res.json({
    success: true,
    message: "Usuário autenticado",
    data: req.usuario
  });
});

router.get("/dashboard", middlewareAutenticacao, (req, res) => {
  res.json({
    success: true,
    message: "Bem-vindo ao dashboard",
    data: { usuario: req.usuario.nome, email: req.usuario.email }
  });
});

module.exports = router;
