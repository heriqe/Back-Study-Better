const db = require("../db/index");
const response = require("../utils/response");
const { generateToken } = require("../utils/jwt");

exports.socialLogin = async (req, res, next) => {
  try {
    const { email, nome, uid, photo } = req.body;
    if (!email || !nome) return response(res, 400, false, "Dados insuficientes.");

    const [rows] = await db.query("SELECT id, nome, email FROM usuarios WHERE email = ?", [email]);

    let user;
    if (rows.length === 0) {
      const [result] = await db.query("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)", [nome, email, null]);
      user = { id: result.insertId, nome, email };
    } else {
      user = rows[0];
    }

    const token = generateToken({ id: user.id, nome: user.nome, email: user.email, providerUid: uid });
    return response(res, 200, true, "Login social bem-sucedido.", { token, user });
  } catch (err) {
    next(err);
  }
};
