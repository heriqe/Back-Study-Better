const pool = require("../db/index");

const planosController = {
  // Listar todos
  getPlanos: async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM planos");
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar planos" });
    }
  },

  // Buscar por ID
  getPlanoById: async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM planos WHERE id = ?", [
        req.params.id,
      ]);
      if (rows.length === 0) {
        return res.status(404).json({ message: "Plano não encontrado" });
      }
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar plano" });
    }
  },

  // Criar
  createPlano: async (req, res) => {
    try {
      const { title, description, highlight, link } = req.body;
      const [result] = await pool.query(
        "INSERT INTO planos (title, description, highlight, link) VALUES (?, ?, ?, ?)",
        [title, description, highlight || false, link]
      );
      res.status(201).json({ id: result.insertId, title, description, highlight, link });
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar plano" });
    }
  },

  // Atualizar
  updatePlano: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, highlight, link } = req.body;
      const [result] = await pool.query(
        "UPDATE planos SET title=?, description=?, highlight=?, link=? WHERE id=?",
        [title, description, highlight, link, id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Plano não encontrado" });
      }
      res.json({ message: "Plano atualizado com sucesso" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar plano" });
    }
  },

  // Deletar
  deletePlano: async (req, res) => {
    try {
      const [result] = await pool.query("DELETE FROM planos WHERE id = ?", [
        req.params.id,
      ]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Plano não encontrado" });
      }
      res.json({ message: "Plano removido com sucesso" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar plano" });
    }
  },
};

module.exports = planosController;
