const db = require('../db')

// todas as matérias
exports.getMaterias = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM materias')
    const materias = rows.map(m => ({
      ...m,
      topics: JSON.parse(m.topics)
    }))
    res.json(materias)
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: 'Erro ao buscar matérias' })
  }
}

// uma matéria pelo id
exports.getMateriaById = async (req, res) => {
  try {
    const { id } = req.params
    const [rows] = await db.query('SELECT * FROM materias WHERE id = ?', [id])

    if (rows.length === 0) {
      return res.status(404).json({ erro: 'Matéria não encontrada' })
    }

    const materia = {
      ...rows[0],
      topics: JSON.parse(rows[0].topics)
    }

    res.json(materia)
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: 'Erro ao buscar matéria' })
  }
}
