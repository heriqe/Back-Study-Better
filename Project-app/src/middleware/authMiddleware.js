const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const verificarToken = promisify(jwt.verify);

const middlewareAutenticacao = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ erro: 'Token ausente' });
    }

    try {
        const decodificado = await verificarToken(token, process.env.JWT_SECRET);
        req.usuario = decodificado;
        next();
    } catch (erro) {
        return res.status(401).json({ erro: 'Token inválido' });
    }
};

module.exports = middlewareAutenticacao;