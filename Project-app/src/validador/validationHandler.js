const { validationResult } = require("express-validator");

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Erro de validação.",
      errors: errors.array().map(err => ({
        campo: err.param,
        mensagem: err.msg
      }))
    });
  }
  next();
};
