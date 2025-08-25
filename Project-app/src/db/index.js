const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "HenriqueFe",     // substitua pelo seu usuário do MySQL
  password: "H3nr1qu3",   // substitua pela sua senha
  database: "study_better",   // substitua pelo nome do banco
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
