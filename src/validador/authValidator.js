const { body } = require("express-validator");

// re-usable validator factories (retornam novas instâncias)
const emailValidator = () =>
  body("email")
    .trim()
    .exists().withMessage("O e-mail é obrigatório.")
    .bail()
    .isEmail().withMessage("Formato de e-mail inválido.")
    .normalizeEmail();

const passwordValidator = () =>
  body("senha")
    .exists().withMessage("A senha é obrigatória.")
    .bail()
    .isLength({ min: 6 }).withMessage("A senha deve ter pelo menos 6 caracteres.");

exports.registerValidation = [
  body("nome")
    .exists().withMessage("O nome é obrigatório.")
    .bail()
    .isString().withMessage("Nome inválido.")
    .trim()
    .isLength({ min: 3 }).withMessage("O nome deve ter pelo menos 3 caracteres."),
  emailValidator(),
  passwordValidator(),
  body("confirmaSenha")
    .exists().withMessage("A confirmação de senha é obrigatória.")
    .bail()
    .custom((value, { req }) => {
      if (value !== req.body.senha) {
        throw new Error("As senhas não coincidem.");
      }
      return true;
    }),
];

exports.loginValidation = [
  emailValidator(),
  passwordValidator(),
];
