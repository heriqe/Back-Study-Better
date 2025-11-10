const bcrypt = require("bcrypt");
const db = require("../db/index");
const response = require("../utils/response");
const { generateToken } = require("../utils/jwt");

const SALT_ROUNDS = Math.max(4, parseInt(process.env.SALT_ROUNDS, 10) || 12);

const normalizeEmail = (email) => (typeof email === "string" ? email.trim().toLowerCase() : "");

exports.registrar = async (req, res, next) => {
  try {
    const { nome, email, senha, confirmaSenha } = req.body;

    if (!nome || !email || !senha || !confirmaSenha) {
      return response(res, 400, false, "Todos os campos são obrigatórios.");
    }

    const emailNorm = normalizeEmail(email);

    if (senha !== confirmaSenha) {
      return response(res, 400, false, "As senhas não coincidem.");
    }

    if (senha.length < 6) {
      return response(res, 400, false, "Senha muito curta. Use ao menos 6 caracteres.");
    }

    const [existing] = await db.query("SELECT id FROM usuarios WHERE email = ?", [emailNorm]);
    if (existing.length > 0) {
      return response(res, 409, false, "E-mail já cadastrado.");
    }

    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

    const [result] = await db.query(
      "INSERT INTO usuarios (nome, email, senha, provider) VALUES (?, ?, ?, ?)",
      [nome.trim(), emailNorm, senhaHash, "local"]
    );

    const user = { id: result.insertId, nome: nome.trim(), email: emailNorm };

    const token = generateToken({ id: user.id, nome: user.nome, email: user.email });

    return response(res, 201, true, "Usuário registrado com sucesso.", { token, user });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return response(res, 400, false, "Email e senha são obrigatórios.");
    }

    const emailNorm = normalizeEmail(email);

    const [rows] = await db.query(
      "SELECT id, nome, email, senha, provider FROM usuarios WHERE email = ?",
      [emailNorm]
    );

    if (rows.length === 0) {
      return response(res, 401, false, "Credenciais inválidas.");
    }

    const usuario = rows[0];

    // usuário criado via social não deve logar usando senha local
    if (!usuario.senha || usuario.provider !== "local") {
      return response(res, 401, false, "Credenciais inválidas.");
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return response(res, 401, false, "Credenciais inválidas.");
    }

    const token = generateToken({ id: usuario.id, nome: usuario.nome, email: usuario.email });

    return response(res, 200, true, "Login bem-sucedido.", {
      token,
      user: { id: usuario.id, nome: usuario.nome, email: usuario.email },
    });
  } catch (err) {
    next(err);
  }
};
