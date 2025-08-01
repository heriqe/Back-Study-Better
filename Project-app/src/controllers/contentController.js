const express = require('express');
const db = require('../db/index'); // Importa a conexão com o banco de dados

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const conn = await db.getConnection();
        const [conteudos] = await conn.query('SELECT id_conteudo, conteudo_titulo, resumo FROM conteudos');
        conn.release();
        res.json(conteudos);
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao listar conteúdos' });
    }
});

router.post('/', async (req, res) => {
    const { titulo, resumo } = req.body;
    if (!titulo || !resumo) {
        return res.status(400).json({ erro: 'Título ou resumo ausente' });
    }
    try {
        const conn = await db.getConnection();
        await conn.query('INSERT INTO conteudos (conteudo_titulo, resumo) VALUES (?, ?)', [titulo, resumo]);
        conn.release();
        res.status(201).json({ mensagem: 'Conteúdo criado com sucesso' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao criar conteúdo' });
    }
});

module.exports = router;