// fileRoutes.js (Local storage + AES-256)
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const authenticate = require("../middleware/authMiddleware");
const File = require("../models/File");
const crypto = require("crypto");

// AES-256 key from .env or fallback
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
  ? Buffer.from(process.env.ENCRYPTION_KEY, "hex")
  : crypto.randomBytes(32);
const IV_LENGTH = 16;

// AES-256 helpers
function encryptBuffer(buffer) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return Buffer.concat([iv, encrypted]);
}

function decryptBuffer(buffer) {
  const iv = buffer.slice(0, IV_LENGTH);
  const encrypted = buffer.slice(IV_LENGTH);
  const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]);
}

const router = express.Router();
const UPLOAD_DIR = path.join(__dirname, "../uploads");

// Ensure uploads folder exists
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const allowedTypes = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/csv"
];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Invalid file type"));
  }
});

/* UPLOAD FILE */
router.post("/upload", authenticate, (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
}, async (req, res) => {
  try {
    const ext = path.extname(req.file.originalname);
    const storedName = uuidv4() + ext;

    const encryptedBuffer = encryptBuffer(req.file.buffer);

    // Save encrypted file locally
    fs.writeFileSync(path.join(UPLOAD_DIR, storedName), encryptedBuffer);

    const file = await File.create({
      originalName: req.file.originalname,
      storedName: storedName,
      uploadedBy: req.user.id,
      size: req.file.size,
      mimeType: req.file.mimetype
    });

    res.json({ message: "File uploaded securely", file });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

/* GET USER FILES */
router.get("/", authenticate, async (req, res) => {
  const files = await File.findByUser(req.user.id);
  res.json(files.map(f => ({
    _id: f.FileID,
    originalName: f.OrigName,
    size: f.Size,
    mimeType: f.MimeType,
    createdAt: f.UploadedAt
  })));
});

/* DOWNLOAD FILE */
router.get("/:id", authenticate, async (req, res) => {
  const file = await File.findById(req.params.id);

  if (!file) return res.status(404).json({ message: "File not found" });
  if (file.UserID !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const encryptedBuffer = fs.readFileSync(path.join(UPLOAD_DIR, file.StoredName));
    const decryptedBuffer = decryptBuffer(encryptedBuffer);

    res.setHeader("Content-Disposition", `attachment; filename="${file.OrigName}"`);
    res.setHeader("Content-Type", file.MimeType);
    res.send(decryptedBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Download failed" });
  }
});

/* DELETE FILE */
router.delete("/:id", authenticate, async (req, res) => {
  const file = await File.findById(req.params.id);
  if (!file) return res.status(404).json({ message: "File not found" });

  if (req.user.role !== "admin" && file.UserID !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    fs.unlinkSync(path.join(UPLOAD_DIR, file.StoredName));
  } catch (err) {
    console.error("Delete error:", err);
  }

  await File.deleteById(req.params.id);
  res.json({ message: "File deleted successfully" });
});

module.exports = router;
