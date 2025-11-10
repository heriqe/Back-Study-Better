const { verifyToken } = require("../utils/jwt");
const response = require("../utils/response");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader) {
      const parts = authHeader.split(" ");
      if (parts.length !== 2 || !/^Bearer$/i.test(parts[0])) {
        return response(res, 401, false, "Formato inválido. Use: Bearer <token>");
      }
      token = parts[1];
    }

    // opcional: suportar token em cookie (descomente se usar cookies)
    // token = token || req.cookies?.token;

    if (!token) {
      return response(res, 401, false, "Token ausente. Use: Bearer <token>");
    }

    const decoded = verifyToken(token);
    req.usuario = decoded;
    return next();
  } catch (err) {
    if (err && err.name === "TokenExpiredError") {
      return response(res, 401, false, "Token expirado. Faça login novamente.");
    }
    return response(res, 401, false, "Token inválido.");
  }
};
