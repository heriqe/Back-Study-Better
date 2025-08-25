const db = require("../db/index");

exports.getMaterias = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM materias");
    // Transformar o campo JSON topics em array
    const materias = rows.map(m => ({ 
      id: m.id, 
      nome: m.nome, 
      topics: JSON.parse(m.topics) 
    }));
    res.json(materias);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar matérias" });
  }
};
