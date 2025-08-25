const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/index");

exports.registrar = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Campos ausentes" });
  }

  try {
    const [rows] = await db.query("SELECT id FROM usuarios WHERE email = ?", [email]);
    if (rows.length > 0) return res.status(409).json({ erro: "Email já cadastrado" });

    const senha_hash = await bcrypt.hash(senha, 10);

    await db.query(
      "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
      [nome, email, senha_hash]
    );

    return res.status(201).json({ mensagem: "Usuário registrado com sucesso" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: "Erro interno no servidor" });
  }
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) return res.status(400).json({ erro: "Campos ausentes" });

  try {
    const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(401).json({ erro: "Credenciais inválidas" });

    const usuario = rows[0];

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) return res.status(401).json({ erro: "Credenciais inválidas" });

    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome, email: usuario.email },
      process.env.JWT_SECRET || "segredo123",
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      token,
      user: { nome: usuario.nome, email: usuario.email },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: "Erro interno no servidor" });
  }
};
