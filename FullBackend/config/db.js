const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || process.env.MYSQLHOST,
  port: process.env.DB_PORT || process.env.MYSQLPORT || 3306,
  user: process.env.DB_USER || process.env.MYSQLUSER,
  password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
  database: process.env.DB_NAME || process.env.MYSQLDATABASE || "railway",
  waitForConnections: true,
  connectionLimit: 10
});

async function connectDB() {
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
