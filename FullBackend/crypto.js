// backend/crypto.js
const crypto = require("crypto");

const ENCRYPTION_KEY = Buffer.from(process.env.AES_SECRET, "hex"); // 32 bytes
const IV_LENGTH = 16; // 128-bit IV

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
  throw new Error("ENCRYPTION_KEY must be 32 bytes (64 hex chars)");
}

// Encrypts a buffer and returns Buffer: IV + AuthTag + Ciphertext
function encryptBuffer(buffer) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);

  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return Buffer.concat([iv, authTag, encrypted]); // 16 + 16 + ciphertext
}

// Decrypts a buffer that was encrypted by encryptBuffer
function decryptBuffer(buffer) {
  const iv = buffer.slice(0, IV_LENGTH);
  const authTag = buffer.slice(IV_LENGTH, IV_LENGTH * 2);
  const encrypted = buffer.slice(IV_LENGTH * 2);

  const decipher = crypto.createDecipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([decipher.update(encrypted), decipher.final()]);
}

module.exports = { encryptBuffer, decryptBuffer };
