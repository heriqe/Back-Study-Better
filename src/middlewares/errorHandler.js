const response = require("../utils/response");

module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.error("Erro completo:", err);
  } else {
    console.error("Erro:", err.message || err);
  }

  const status = err.status || 500;
  const message = err.message || "Erro interno no servidor.";
  return response(res, status, false, message);
};
