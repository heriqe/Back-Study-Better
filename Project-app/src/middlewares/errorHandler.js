const response = require("../utils/response");

module.exports = (err, req, res, next) => {
  console.error("Erro:", err);
  return response(res, err.status || 500, false, err.message || "Erro interno no servidor.");
};
