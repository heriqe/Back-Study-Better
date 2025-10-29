const { verifyToken } = require("../utils/jwt");
const response = require("../utils/response");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return response(res, 401, false, "Token ausente. Use: Bearer <token>");
    }

    const [bearer, token] = authHeader.split(" ");

    if (!/^Bearer$/i.test(bearer) || !token) {
      return response(res, 401, false, "Formato inválido. Use: Bearer <token>");
    }

    const decoded = verifyToken(token);
    req.usuario = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return response(res, 401, false, "Token expirado. Faça login novamente.");
    }
    return response(res, 401, false, "Token inválido.");
  }
};
