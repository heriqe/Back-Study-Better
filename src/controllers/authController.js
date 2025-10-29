const bcrypt = require("bcrypt");
const db = require("../db/index");
const response = require("../utils/response");
const { generateToken } = require("../utils/jwt");

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 12;

// ---------------- REGISTRAR ----------------
exports.registrar = async (req, res, next) => {
  try {
    const { nome, email, senha } = req.body;

    // Verificar se email já existe
    const [rows] = await db.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );
    if (rows.length > 0) {
      return response(res, 409, false, "E-mail já cadastrado.");
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

    await db.query(
      "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
      [nome, email, senhaHash]
    );

    return response(res, 201, true, "Usuário registrado com sucesso.");
  } catch (err) {
    next(err); // deixa o middleware global tratar
  }
};

// ---------------- LOGIN ----------------
exports.login = async (req, res, next) => {
  try {
    const { email, senha } = req.body;

    // Buscar usuário
    const [rows] = await db.query(
      "SELECT id, nome, email, senha FROM usuarios WHERE email = ?",
      [email]
    );
    if (rows.length === 0) {
      return response(res, 401, false, "Credenciais inválidas.");
    }

    const usuario = rows[0];

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return response(res, 401, false, "Credenciais inválidas.");
    }

    // Gerar token JWT
    const token = generateToken({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    });

    return response(res, 200, true, "Login bem-sucedido.", {
      token,
      user: { id: usuario.id, nome: usuario.nome, email: usuario.email },
    });
  } catch (err) {
    next(err);
  }
};
