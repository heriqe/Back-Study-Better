const db = require("../db/index");
const response = require("../utils/response");

exports.me = async (req, res, next) => {
  try {
    const usuarioId = req.usuario?.id;
    if (!usuarioId) return response(res, 401, false, "Não autenticado.");

    const [rows] = await db.query("SELECT id, nome, email FROM usuarios WHERE id = ?", [usuarioId]);
    if (rows.length === 0) return response(res, 404, false, "Usuário não encontrado.");

    const user = rows[0];
    // fetch planos belonging to this user
    try {
      const [planos] = await db.query("SELECT * FROM planos WHERE user_id = ?", [usuarioId]);
      return response(res, 200, true, "OK", { id: user.id, nome: user.nome, email: user.email, planos });
    } catch (err) {
      // if planos query fails, still return basic user info
      return response(res, 200, true, "OK", { id: user.id, nome: user.nome, email: user.email });
    }
  } catch (err) {
    next(err);
  }
};
