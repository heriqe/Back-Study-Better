const db = require('../db/index');// Importa a conexão com o banco de dados

exports.listarQuestoes = async (req, res) => {
    const idQuiz = req.params.quizId;
    try {
        const conexao = await db.getConnection();
        const [questoes] = await conexao.query('SELECT id_questao, questao_texto FROM questoes WHERE id_quiz = ?', [idQuiz]);
        conexao.release();
        res.status(200).json(questoes);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao listar questões' });
    }
};

exports.validarResposta = async (req, res) => {
    const idQuestao = req.params.questionId;
    const respostaUsuario = req.body.resposta;
    try {
        const conexao = await db.getConnection();
        const [questao] = await conexao.query('SELECT resposta_correta FROM questoes WHERE id_questao = ?', [idQuestao]);
        conexao.release();
        
        if (questao.length > 0 && respostaUsuario === questao[0].resposta_correta) {
            res.status(200).json({ correta: true });
        } else {
            res.status(200).json({ correta: false });
        }
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao validar resposta' });
    }
};