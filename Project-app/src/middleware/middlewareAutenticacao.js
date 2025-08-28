const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "defaultSecret";

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token ausente. Envie no formato: Bearer <token>",
      });
    }

    const [bearer, token] = authHeader.split(" ");

    if (!/^Bearer$/i.test(bearer) || !token) {
      return res.status(401).json({
        success: false,
        message: "Formato inválido. Use: Bearer <token>",
      });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({
            success: false,
            message: "Token expirado. Faça login novamente.",
          });
        }
        return res.status(401).json({
          success: false,
          message: "Token inválido.",
        });
      }

      req.usuario = decoded; // agora o usuário está disponível nas rotas
      next();
    });
  } catch (error) {
    console.error("Erro no middleware de autenticação:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno no servidor.",
    });
  }
};
