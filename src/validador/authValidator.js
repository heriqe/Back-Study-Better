const { body } = require("express-validator");

exports.registerValidation = [
  body("nome")
    .trim()
    .notEmpty().withMessage("O nome é obrigatório.")
    .isLength({ min: 3 }).withMessage("O nome deve ter pelo menos 3 caracteres."),
  
  body("email")
    .trim()
    .notEmpty().withMessage("O e-mail é obrigatório.")
    .isEmail().withMessage("E-mail inválido."),
  
  body("senha")
    .notEmpty().withMessage("A senha é obrigatória.")
    .isLength({ min: 6 }).withMessage("A senha deve ter pelo menos 6 caracteres."),
];

exports.loginValidation = [
  body("email")
    .trim()
    .notEmpty().withMessage("O e-mail é obrigatório.")
    .isEmail().withMessage("E-mail inválido."),
  
  body("senha")
    .notEmpty().withMessage("A senha é obrigatória."),
];
