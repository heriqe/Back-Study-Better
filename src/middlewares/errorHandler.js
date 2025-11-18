const response = require("../utils/response");

module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Erro interno no servidor.";

  if (process.env.NODE_ENV !== "production") {
    console.error("Erro completo:", err);
  } else {
    console.error(`Erro [${status}]: ${message}`);
  }

  return response(res, status, false, message, null, {
    error: process.env.NODE_ENV !== "production" ? err : undefined,
  });
};
