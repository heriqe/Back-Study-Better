const db = require('../db/index');// Importa a conexão com o banco de dados

exports.criarHorario = async (req, res) => {
    const { id_usuario, data, atividade } = req.body;
    if (!id_usuario || !data || !atividade) {
        return res.status(400).json({ erro: 'Campos ausentes' });
    }
    try {
        const conn = await db.getConnection();
        const query = 'INSERT INTO horarios (id_user, data_hora, atividade) VALUES (?, ?, ?)';
        await conn.execute(query, [id_usuario, data, atividade]);
        conn.release();
        return res.status(201).json({ mensagem: 'Horário criado' });
    } catch (error) {
        return res.status(500).json({ erro: 'Erro ao criar horário' });
    }
};

exports.listarHorarios = async (req, res) => {
    const { id_usuario } = req.params;
    try {
        const conn = await db.getConnection();
        const query = 'SELECT data_hora, atividade FROM horarios WHERE id_user = ?';
        const [horarios] = await conn.execute(query, [id_usuario]);
        conn.release();
        return res.status(200).json(horarios);
    } catch (error) {
        return res.status(500).json({ erro: 'Erro ao listar horários' });
    }
};