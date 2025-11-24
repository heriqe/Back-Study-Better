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
  // content pode ser objeto JSON; aceitamos string válida ou objeto
  body("content")
    .optional()
    .custom((val) => {
      if (val == null) return true;
      if (typeof val === 'object') return true;
      if (typeof val === 'string') {
        try { JSON.parse(val); return true; } catch (e) { return false; }
      }
      return false;
    })
  .withMessage('Content deve ser JSON válido ou objeto')
];
