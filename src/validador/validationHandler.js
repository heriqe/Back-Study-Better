const { validationResult } = require("express-validator");
const response = require("./response");

/**
 * Middleware para enviar erros de validação no formato padronizado.
 */
module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map(err => ({
      field: err.param,
      mensagem: err.msg,
    }));
    return response(res, 400, false, "Erros de validação.", { errors: formatted });
  }
  next();
};