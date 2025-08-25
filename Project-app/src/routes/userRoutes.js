const express = require('express');
const router = express.Router();
const middlewareAutenticacao = require('../middleware/middlewareAutenticacao');

router.get('/perfil', middlewareAutenticacao, (req, res) => {
  res.json({
    sucesso: true,
    mensagem: 'Usuário autenticado',
    dados: req.usuario
  });
});

router.get('/dashboard', middlewareAutenticacao, (req, res) => {
  res.json({
    sucesso: true,
    mensagem: 'Bem-vindo ao dashboard',
    dados: { usuario: req.usuario.nome, email: req.usuario.email }
  });
});

module.exports = router;
