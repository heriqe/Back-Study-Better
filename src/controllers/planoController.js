const pool = require("../db/index");
const { sendSuccess, sendError } = require("../utils/response");
const fs = require("fs");

const planoController = {
  // GET /api/planos
  getAll: async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM planos");

      // Collect container info to send to frontend (env vars + container id when available)
      const containerInfo = {
        hostname: process.env.HOSTNAME || null,
        env: {
          NODE_ENV: process.env.NODE_ENV || null,
          DB_HOST: process.env.DB_HOST || null,
          DB_NAME: process.env.DB_NAME || null,
          DB_USER: process.env.DB_USER || null,
        },
        containerId: null,
      };

      try {
        const cgroup = fs.readFileSync('/proc/self/cgroup', 'utf8');
        let match = cgroup.match(/docker\/([0-9a-f]{64})/);
        if (!match) match = cgroup.match(/docker-([0-9a-f]{64})\.scope/);
        if (!match) match = cgroup.match(/([0-9a-f]{12,64})/);
        if (match) containerInfo.containerId = match[1];
      } catch (e) {
        // ignore - best-effort only
      }

      return sendSuccess(res, { planos: rows, container: containerInfo });
    } catch (err) {
      return sendError(res, "Erro ao buscar planos", 500);
    }
  },

  // GET /api/planos/enem
  getEnem: async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT content, title, description, duration FROM planos WHERE title = ? LIMIT 1", ["ENEM"]);
      if (rows && rows.length > 0 && rows[0].content) {
        // content is stored as JSON in DB; ensure it's parsed (mysql2 returns JS object for JSON column)
        const content = rows[0].content;
        // attach metadata
        const plan = {
          title: rows[0].title || content.title,
          description: rows[0].description || content.description,
          duration: rows[0].duration || null,
          ...content,
        };
        return sendSuccess(res, plan);
      }

      // Fallback: return embedded plan if DB entry not found
      const fallback = {
        title: "Plano de Estudos para o ENEM (3 a 6 meses)",
        description:
          "Este plano foi cuidadosamente desenvolvido pela equipe Study Better para estudantes que desejam se preparar de forma completa para o ENEM. Ele combina teoria, prática com questões e treino de redação, visando otimizar o tempo de estudo e alcançar alta performance na prova.",
        organization: {
          dailyTime: "3 a 5 horas (pausas de 10 min a cada 50 min)",
          days: "6 dias de estudo + 1 dia para descanso/revisão leve",
          strategy: "70% teoria + questões, 20% revisão, 10% redação",
        },
        weeklyDivision: [
          "Segunda → Matemática + Redação",
          "Terça → Ciências da Natureza (Física/Química)",
          "Quarta → Ciências Humanas (História/Geografia)",
          "Quinta → Matemática + Biologia",
          "Sexta → Linguagens",
          "Sábado → Revisão + Simulado (90 questões)",
        ],
        dailyStructure: [
          "Aquecimento (10 min) → revisar resumos/anotações do dia anterior",
          "Bloco 1 (50 min) → Estudo teórico",
          "Bloco 2 (50 min) → Resolução de questões",
          "Bloco 3 (50 min) → Segundo tema do dia + exercícios",
          "Redação (1h, 2x semana)",
          "Revisão rápida (20 min) → flashcards, mapas mentais ou resumo",
        ],
        keyContents: {
          matematica: [
            "Funções",
            "Porcentagem",
            "Probabilidade",
            "Geometria",
            "PA/PG",
          ],
          cienciasNatureza: {
            fisica: ["Cinemática", "Leis de Newton", "Energia", "Eletricidade"],
            quimica: ["Ligações", "Estequiometria", "Soluções", "Orgânica"],
            biologia: ["Ecologia", "Genética", "Citologia", "Evolução"],
          },
          cienciasHumanas: ["História do Brasil e Geral", "Geografia", "Sociologia", "Filosofia"],
          linguagens: ["Interpretação", "Literatura", "Gramática", "Inglês/Espanhol"],
        },
        revision: [
          "Domingo: revisar resumos e questões erradas",
          "Simulado completo a cada 3 semanas",
          "Método de revisão espaçada (1, 7 e 30 dias)",
        ],
        tips: [
          "Resolva questões anteriores do ENEM",
          "Monte resumos próprios",
          "Treine redação regularmente",
          "Pratique com tempo cronometrado",
          "Cuide do sono e da saúde mental",
        ],
      };

      return sendSuccess(res, fallback);
    } catch (err) {
      return sendError(res, "Erro ao buscar plano ENEM", 500);
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
      const { title, description, duration, highlight, link, content } = req.body;
      let contentObj = null;
      if (content != null) {
        contentObj = typeof content === 'string' ? JSON.parse(content) : content;
      }
      const [result] = await pool.query(
        `INSERT INTO planos 
         (title, description, duration, highlight, link, content) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [title, description, duration, highlight || 0, link, contentObj]
      );

      const novoPlano = {
        id: result.insertId,
        title,
        description,
        duration,
        highlight: !!highlight,
  link,
  content: contentObj,
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
      const { title, description, duration, highlight, link, content } = req.body;
      let contentObj = null;
      if (content != null) {
        contentObj = typeof content === 'string' ? JSON.parse(content) : content;
      }

      const [result] = await pool.query(
        `UPDATE planos 
         SET title = ?, description = ?, duration = ?, highlight = ?, link = ?, content = ? 
         WHERE id = ?`,
        [title, description, duration, highlight, link, contentObj, id]
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
