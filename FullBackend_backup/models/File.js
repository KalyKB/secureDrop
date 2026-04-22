const { pool } = require("../config/db");

const File = {
  async create({ originalName, storedName, uploadedBy, size, mimeType }) {
    const [result] = await pool.query(
      "INSERT INTO Files (UserID, StoredName, OrigName, MimeType, Size) VALUES (?, ?, ?, ?, ?)",
      [uploadedBy, storedName, originalName, mimeType, size]
    );
    const [rows] = await pool.query("SELECT * FROM Files WHERE FileID = ?", [result.insertId]);
    return rows[0];
  },

  async findByUser(userId) {
    const [rows] = await pool.query(
      "SELECT * FROM Files WHERE UserID = ?",
      [userId]
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query("SELECT * FROM Files WHERE FileID = ?", [id]);
    return rows[0] || null;
  },

  async deleteById(id) {
    await pool.query("DELETE FROM Files WHERE FileID = ?", [id]);
  }
};

module.exports = File;
