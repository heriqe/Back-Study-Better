const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'DB_HOST',
  user: 'DB_USER',
  database: 'DB_NAME',
  password: 'DB_PASSWORD',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const obterConexao = () => {
  return pool.promise().getConnection();
};

module.exports = { obterConexao };