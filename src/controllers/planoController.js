const pool = require("../db/index");
const { sendSuccess, sendError } = require("../utils/response");

const planoController = {
  // GET /api/planos
  getAll: async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM planos");
      return sendSuccess(res, rows);
    } catch (err) {
      return sendError(res, "Erro ao buscar planos", 500);
    }
  },

  // GET /api/planos/:id
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const [rows] = await pool.query(
        "SELECT * FROM planos WHERE id = ?",
        [id]
      );

      if (rows.length === 0)
        return sendError(res, "Plano não encontrado", 404);

      return sendSuccess(res, rows[0]);
    } catch (err) {
      return sendError(res, "Erro ao buscar plano", 500);
    }
  },

  // POST /api/planos
  create: async (req, res) => {
    try {
      const { title, description, duration, highlight, link } = req.body;
      const [result] = await pool.query(
        `INSERT INTO planos 
         (title, description, duration, highlight, link) 
         VALUES (?, ?, ?, ?, ?)`,
        [title, description, duration, highlight || 0, link]
      );

      const novoPlano = {
        id: result.insertId,
        title,
        description,
        duration,
        highlight: !!highlight,
        link,
      };

      return sendSuccess(res, novoPlano, 201);
    } catch (err) {
      return sendError(res, "Erro ao criar plano", 500);
    }
  },

  // PUT /api/planos/:id
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, duration, highlight, link } = req.body;

      const [result] = await pool.query(
        `UPDATE planos 
         SET title = ?, description = ?, duration = ?, highlight = ?, link = ? 
         WHERE id = ?`,
        [title, description, duration, highlight, link, id]
      );

      if (result.affectedRows === 0)
        return sendError(res, "Plano não encontrado", 404);

      return sendSuccess(res, { message: "Plano atualizado com sucesso" });
    } catch (err) {
      return sendError(res, "Erro ao atualizar plano", 500);
    }
  },

  // DELETE /api/planos/:id
  remove: async (req, res) => {
    try {
      const { id } = req.params;
      const [result] = await pool.query(
        "DELETE FROM planos WHERE id = ?",
        [id]
      );

      if (result.affectedRows === 0)
        return sendError(res, "Plano não encontrado", 404);

      return sendSuccess(res, { message: "Plano removido com sucesso" });
    } catch (err) {
      return sendError(res, "Erro ao deletar plano", 500);
    }
  },
};

module.exports = planoController;
