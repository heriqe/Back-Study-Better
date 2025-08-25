const express = require("express");
const middlewareAutenticacao = require("../middleware/middlewareAutenticacao");
const router = express.Router();

router.get("/perfil", middlewareAutenticacao, (req, res) => {
  res.json({
    sucesso: true,
    mensagem: "Usuário autenticado com sucesso",
    dados: req.usuario
  });
});

router.get("/dashboard", middlewareAutenticacao, (req, res) => {
  res.json({
    sucesso: true,
    mensagem: "Bem-vindo ao dashboard",
    dados: { nome: req.usuario.nome, email: req.usuario.email }
  });
});

module.exports = router;
