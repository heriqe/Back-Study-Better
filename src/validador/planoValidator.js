const { body } = require("express-validator");

exports.validatePlano = [
  body("title")
    .isString()
    .notEmpty()
    .withMessage("O título é obrigatório"),
  body("description")
    .isString()
    .notEmpty()
    .withMessage("A descrição é obrigatória"),
  body("duration")
    .isString()
    .notEmpty()
    .withMessage("A duração é obrigatória"),
  body("link")
    .isString()
    .notEmpty()
    .withMessage("O link é obrigatório"),
  body("highlight")
    .optional()
    .isBoolean()
    .withMessage("Highlight deve ser booleano"),
];
