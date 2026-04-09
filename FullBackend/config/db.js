const mysql = require("mysql2/promise");

const pool = mysql.createPool(process.env.MYSQL_URL || {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "railway",
  waitForConnections: true,
  connectionLimit: 10
});

async function connectDB() {
  console.log("DB_HOST:", process.env.DB_HOST);
  console.log("DB_USER:", process.env.DB_USER);
  console.log("MYSQL_URL:", process.env.MYSQL_URL ? "SET" : "NOT SET");
  console.log("MYSQLHOST:", process.env.MYSQLHOST);
  try {
    const conn = await pool.getConnection();
    console.log("MySQL connected");
    conn.release();
  } catch (err) {
    console.error("MySQL connection failed:", err.message);
    process.exit(1);
  }
}

module.exports = { pool, connectDB };
