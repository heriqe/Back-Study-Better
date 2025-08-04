const db = require('../db/index');// Importa a conexão com o banco de dados

exports.listarQuizzes = async (req, res) => {
    try {
        const conexao = await db.getConnection();
        const [quizzes] = await conexao.query('SELECT id_quiz, quiz_titulo, descricao FROM quizzes');
        conexao.release();
        res.status(200).json(quizzes);
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao listar quizzes' });
    }
};

exports.criarQuiz = async (req, res) => {
    const { titulo, descricao } = req.body;
    if (!titulo) {
        return res.status(400).json({ erro: 'Título ausente' });
    }
    try {
        const conexao = await db.getConnection();
        await conexao.query('INSERT INTO quizzes (quiz_titulo, descricao) VALUES (?, ?)', [titulo, descricao]);
        conexao.release();
        res.status(201).json({ mensagem: 'Quiz criado' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao criar quiz' });
    }
};
