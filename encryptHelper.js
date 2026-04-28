const fs = require("fs");
const crypto = require("crypto");

const ALGORITHM = "aes-256-cbc";

// Encrypt a file
function encryptFile(inputPath, outputPath, key) {
  const data = fs.readFileSync(inputPath, "utf8");
  const cipher = crypto.createCipher(ALGORITHM, key);
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  fs.writeFileSync(outputPath, encrypted);
}

// Decrypt a file
function decryptFile(filePath, key) {
  const encrypted = fs.readFileSync(filePath, "utf8");
  const decipher = crypto.createDecipher(ALGORITHM, key);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

module.exports = { encryptFile, decryptFile };
