const pool = require("../db/index");
const { sendSuccess, sendError } = require("../utils/response");

const meuPlanoController = {
  // GET /api/planos/me - lista planos salvos pelo usuário
  getMyPlans: async (req, res) => {
    try {
      const usuarioId = req.usuario?.id;
      if (!usuarioId) return sendError(res, "Não autenticado.", 401);

      // ensure table exists (best-effort)
      await pool.query(`
        CREATE TABLE IF NOT EXISTS user_planos (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          plano_id INT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE KEY unique_user_plano (user_id, plano_id)
        )
      `);

      const [rows] = await pool.query(
        `SELECT p.* FROM planos p
         JOIN user_planos up ON p.id = up.plano_id
         WHERE up.user_id = ?`,
        [usuarioId]
      );

      return sendSuccess(res, { planos: rows });
    } catch (err) {
      return sendError(res, "Erro ao buscar planos salvos", 500);
    }
  },

  // POST /api/planos/:id/save - salvar um plano para o usuário
  savePlan: async (req, res) => {
    try {
      const usuarioId = req.usuario?.id;
      if (!usuarioId) return sendError(res, "Não autenticado.", 401);

      const { id: planoId } = req.params;
      // check plano exists
      const [planRows] = await pool.query("SELECT id, title, description FROM planos WHERE id = ?", [planoId]);
      if (planRows.length === 0) return sendError(res, "Plano não encontrado", 404);

      // ensure table exists
      await pool.query(`
        CREATE TABLE IF NOT EXISTS user_planos (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          plano_id INT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE KEY unique_user_plano (user_id, plano_id)
        )
      `);

      // insert ignore to avoid duplicate
      await pool.query(
        `INSERT IGNORE INTO user_planos (user_id, plano_id) VALUES (?, ?)`,
        [usuarioId, planoId]
      );

      return sendSuccess(res, { message: "Plano salvo com sucesso" }, 201);
    } catch (err) {
      return sendError(res, "Erro ao salvar plano", 500);
    }
  },

  // DELETE /api/planos/:id/save - remover plano salvo
  removeSaved: async (req, res) => {
    try {
      const usuarioId = req.usuario?.id;
      if (!usuarioId) return sendError(res, "Não autenticado.", 401);

      const { id: planoId } = req.params;

      const [result] = await pool.query(
        `DELETE FROM user_planos WHERE user_id = ? AND plano_id = ?`,
        [usuarioId, planoId]
      );

      if (result.affectedRows === 0) return sendError(res, "Plano não encontrado entre salvos", 404);

      return sendSuccess(res, { message: "Plano removido dos salvos" });
    } catch (err) {
      return sendError(res, "Erro ao remover plano salvo", 500);
    }
  },
};

module.exports = meuPlanoController;
