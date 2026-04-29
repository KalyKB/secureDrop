// FullBackend/config/db.js
require("dotenv").config();
const mysql = require("mysql2/promise");

let pool;

try {
  if (!process.env.MYSQL_URL) {
    throw new Error("MYSQL_URL not set in .env");
  }

  pool = mysql.createPool(process.env.MYSQL_URL);

  console.log("✅ MySQL pool created successfully");
} catch (err) {
  console.error("❌ Failed to create MySQL pool:", err.message);
  process.exit(1);
}

module.exports = { pool };
