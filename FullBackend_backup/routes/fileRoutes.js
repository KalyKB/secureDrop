const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const authenticate = require("../middleware/authMiddleware");
const File = require("../models/File");
const { encryptBuffer, decryptBuffer } = require("../crypto"); // <- use GCM version

const router = express.Router();
const UPLOAD_DIR = path.join(__dirname, "../uploads");
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error("Invalid file type"));
  }
});

// UPLOAD
router.post(
  "/upload",
  authenticate,
  (req, res, next) => upload.single("file")(req, res, (err) => err ? res.status(400).json({ message: err.message }) : next()),
  async (req, res) => {
    try {
      const ext = path.extname(req.file.originalname);
      const storedName = uuidv4() + ext;

      // Encrypt file buffer
      const encryptedBuffer = encryptBuffer(req.file.buffer);

      // Save encrypted buffer
      fs.writeFileSync(path.join(UPLOAD_DIR, storedName), encryptedBuffer);

      const file = await File.create({
        originalName: req.file.originalname,
        storedName,
        uploadedBy: req.user.id,
        size: req.file.size,
        mimeType: req.file.mimetype
      });

      res.json({ message: "File uploaded securely", file });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

// LIST
router.get("/", authenticate, async (req, res) => {
  const files = await File.findByUser(req.user.id);
  res.json(files.map(f => ({
    id: f.id,
    originalName: f.originalName,
    size: f.size,
    mimeType: f.mimeType,
    uploadedBy: f.uploadedBy
  })));
});

// DOWNLOAD
router.get("/:id", authenticate, async (req, res) => {
  const file = await File.findById(req.params.id);
  if (!file) return res.status(404).json({ message: "File not found" });
  if (file.uploadedBy !== req.user.id && req.user.role !== "admin")
    return res.status(403).json({ message: "Unauthorized" });

  try {
    const encryptedBuffer = fs.readFileSync(path.join(UPLOAD_DIR, file.storedName));
    const decryptedBuffer = decryptBuffer(encryptedBuffer); // AES-256-GCM

    res.setHeader("Content-Disposition", `attachment; filename="${file.originalName}"`);
    res.setHeader("Content-Type", file.mimeType);
    res.send(decryptedBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Download failed" });
  }
});

// DELETE
router.delete("/:id", authenticate, async (req, res) => {
  const file = await File.findById(req.params.id);
  if (!file) return res.status(404).json({ message: "File not found" });
  if (file.uploadedBy !== req.user.id && req.user.role !== "admin")
    return res.status(403).json({ message: "Unauthorized" });

  try {
    fs.unlinkSync(path.join(UPLOAD_DIR, file.storedName));
    await File.deleteById(req.params.id);
    res.json({ message: "File deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
