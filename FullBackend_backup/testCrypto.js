// testCrypto.js
require("dotenv").config(); // only needed for local testing
const { encryptBuffer, decryptBuffer } = require("./crypto");

const testString = "Hello, AES-256-GCM!";

// Convert string to buffer
const buffer = Buffer.from(testString, "utf-8");

// Encrypt
const encrypted = encryptBuffer(buffer);

// Decrypt
const decrypted = decryptBuffer(encrypted);

// Convert back to string
const decryptedString = decrypted.toString("utf-8");

console.log("Original:", testString);
console.log("Decrypted:", decryptedString);

// Verify if encryption/decryption works
console.log("✅ Match:", testString === decryptedString);
