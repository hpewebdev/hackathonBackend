const mysql = require("mysql");
const config = require("./config");

const connection = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
  connectionLimit: 120
});

connection.on("connection", (conn) => {
  console.log(`Connected to database as id ${conn.threadId}`);
});

module.exports = connection;
