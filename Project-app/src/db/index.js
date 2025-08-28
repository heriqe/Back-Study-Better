const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST, 
  user: process.env.DB_USER,   // substitua pelo seu usuário do MySQL
  password: process.env.DB_PASSWORD,   // substitua pela sua senha
  database: process.env.DB_DATABASE,   // substitua pelo nome do banco
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
