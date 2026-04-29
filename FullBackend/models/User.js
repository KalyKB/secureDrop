const { pool } = require("../config/db");

const User = {
  async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM Users WHERE Email = ?", [email]);
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.query("SELECT * FROM Users WHERE UserID = ?", [id]);
    return rows[0] || null;
  },

  async findAll() {
    const [rows] = await pool.query(
      "SELECT UserID, Username, Email, Role, CreatedAt FROM Users"
    );
    return rows;
  },

  async create({ firstname, email, password }) {
    const [result] = await pool.query(
      "INSERT INTO Users (Username, Email, PasswordHash) VALUES (?, ?, ?)",
      [firstname, email, password]
    );
    return { id: result.insertId };
  },

  async updateLoginAttempts(id, attempts, lockUntil) {
    await pool.query(
      "UPDATE Users SET LoginAttempts = ?, LockUntil = ? WHERE UserID = ?",
      [attempts, lockUntil || null, id]
    );
  },

  async resetLoginAttempts(id) {
    await pool.query(
      "UPDATE Users SET LoginAttempts = 0, LockUntil = NULL WHERE UserID = ?",
      [id]
    );
  },

  async updateRole(id, role) {
    await pool.query("UPDATE Users SET Role = ? WHERE UserID = ?", [role, id]);

  },

  async deleteById(id) {
    await pool.query("DELETE FROM Users WHERE UserID = ?", [id]);

  }
};

module.exports = User;
