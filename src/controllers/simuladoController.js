const pool = require("../db/index");
const { sendSuccess, sendError } = require("../utils/response");

const simuladoController = {
  // Listar todos os simulados
  getAll: async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM simulados");
      return sendSuccess(res, rows);
    } catch (err) {
      return sendError(res, "Erro ao buscar simulados", 500);
    }
  },

  // Buscar simulado por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const [rows] = await pool.query(
        "SELECT * FROM simulados WHERE id = ?",
        [id]
      );
      if (rows.length === 0) {
        return sendError(res, "Simulado não encontrado", 404);
      }
      return sendSuccess(res, rows[0]);
    } catch (err) {
      return sendError(res, "Erro ao buscar simulado", 500);
    }
  },

  // Criar um novo simulado
  create: async (req, res) => {
    try {
      const { name, description, icon, gradient, route } = req.body;
      const [result] = await pool.query(
        `INSERT INTO simulados
         (name, description, icon, gradient, route)
         VALUES (?, ?, ?, ?, ?)`,
        [name, description, icon, gradient, route]
      );
      const novoSimulado = {
        id: result.insertId,
        name,
        description,
        icon,
        gradient,
        route,
      };
      return sendSuccess(res, novoSimulado, 201);
    } catch (err) {
      return sendError(res, "Erro ao criar simulado", 500);
    }
  },

  // Atualizar um simulado existente
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, icon, gradient, route } = req.body;
      const [result] = await pool.query(
        `UPDATE simulados
         SET name = ?, description = ?, icon = ?, gradient = ?, route = ?
         WHERE id = ?`,
        [name, description, icon, gradient, route, id]
      );
      if (result.affectedRows === 0) {
        return sendError(res, "Simulado não encontrado", 404);
      }
      return sendSuccess(res, { message: "Simulado atualizado com sucesso" });
    } catch (err) {
      return sendError(res, "Erro ao atualizar simulado", 500);
    }
  },

  // Remover um simulado
  remove: async (req, res) => {
    try {
      const { id } = req.params;
      const [result] = await pool.query(
        "DELETE FROM simulados WHERE id = ?",
        [id]
      );
      if (result.affectedRows === 0) {
        return sendError(res, "Simulado não encontrado", 404);
      }
      return sendSuccess(res, { message: "Simulado removido com sucesso" });
    } catch (err) {
      return sendError(res, "Erro ao deletar simulado", 500);
    }
  },
};

module.exports = simuladoController;
