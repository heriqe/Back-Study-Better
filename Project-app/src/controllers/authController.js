const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db'); // Importa a conexão com o banco de dados
const router = express.Router();

exports.registrar = async (req, res) => {
    const { usuario, senha } = req.body;
    if (!usuario || !senha) {
        return res.status(400).json({ erro: 'Usuário ou senha ausente' });
    }
    const senha_hash = await bcrypt.hash(senha, 10);
    try {
        const conexao = await db.getConnection();
        const [linhas] = await conexao.query('INSERT INTO users (username, password) VALUES (?, ?)', [usuario, senha_hash]);
        conexao.release();
        return res.status(201).json({ mensagem: 'Usuário registrado com sucesso' });
    } catch (erro) {
        return res.status(409).json({ erro: 'Usuário já existe' });
    }
};

exports.login = async (req, res) => {
    const { usuario, senha } = req.body;
    if (!usuario || !senha) {
        return res.status(400).json({ erro: 'Usuário ou senha ausente' });
    }
    try {
        const conexao = await db.getConnection();
        const [linhas] = await conexao.query('SELECT password FROM users WHERE username = ?', [usuario]);
        conexao.release();
        if (linhas.length > 0 && await bcrypt.compare(senha, linhas[0].password)) {
            return res.status(200).json({ mensagem: 'Login bem-sucedido' });
        } else {
            return res.status(401).json({ erro: 'Credenciais inválidas' });
        }
    } catch (erro) {
        return res.status(500).json({ erro: 'Erro ao processar a solicitação' });
    }
};