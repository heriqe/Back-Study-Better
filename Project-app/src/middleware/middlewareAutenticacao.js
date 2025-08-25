const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const verificarToken = promisify(jwt.verify);

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ sucesso: false, mensagem: 'Token ausente' });
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Formato inválido. Use: Bearer <token>'
      });
    }

    const decodificado = await verificarToken(token, process.env.JWT_SECRET);
    req.usuario = decodificado;
    next();
  } catch (erro) {
    console.error('Erro no middlewareAutenticacao:', erro.message);
    return res.status(401).json({ sucesso: false, mensagem: 'Token inválido ou expirado' });
  }
};
