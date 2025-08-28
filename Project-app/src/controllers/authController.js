const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/index");
require('dotenv').config();

// Configs centralizadas
const JWT_SECRET = process.env.JWT_SECRET || "defaultSecret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const SALT_ROUNDS = 12;

// Helper para respostas padronizadas
const response = (res, status, success, message, data = null) => {
  return res.status(status).json({ success, message, data });
};

// ---------------- REGISTRAR ----------------
exports.registrar = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return response(res, 400, false, "Preencha todos os campos");
  }

  try {
    // Verificar se email já existe
    const [rows] = await db.query("SELECT id FROM usuarios WHERE email = ?", [email]);
    if (rows.length > 0) return response(res, 409, false, "Email já cadastrado");

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

    await db.query(
      "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
      [nome, email, senhaHash]
    );

    return response(res, 201, true, "Usuário registrado com sucesso");
  } catch (err) {
    console.error("Erro em registrar:", err);
    return response(res, 500, false, "Erro interno no servidor");
  }
};

// ---------------- LOGIN ----------------
exports.login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return response(res, 400, false, "Preencha todos os campos");
  }

  try {
    // Buscar usuário (sem senha visível)
    const [rows] = await db.query("SELECT id, nome, email, senha FROM usuarios WHERE email = ?", [email]);
    if (rows.length === 0) return response(res, 401, false, "Credenciais inválidas");

    const usuario = rows[0];

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) return response(res, 401, false, "Credenciais inválidas");

    // Gerar token JWT
    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome, email: usuario.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN, algorithm: "HS256" }
    );

    return response(res, 200, true, "Login bem-sucedido", {
      token,
      user: { id: usuario.id, nome: usuario.nome, email: usuario.email },
    });
  } catch (err) {
    console.error("Erro em login:", err);
    return response(res, 500, false, "Erro interno no servidor");
  }
};
