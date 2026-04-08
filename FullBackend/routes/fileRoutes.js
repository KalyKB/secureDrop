const express = require("express");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const authenticate = require("../middleware/authMiddleware");
const File = require("../models/File");

const router = express.Router();

const allowedTypes = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, uuidv4() + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Invalid file type"));
  }
});

/* UPLOAD FILE */
router.post("/upload", authenticate, upload.single("file"), async (req, res) => {
  try {
    const file = await File.create({
      originalName: req.file.originalname,
      storedName: req.file.filename,
      uploadedBy: req.user.id,
      size: req.file.size,
      mimeType: req.file.mimetype
    });

    res.json({ message: "File uploaded securely", file });

  } catch {
    res.status(500).json({ message: "Upload failed" });
  }
});

/* GET USER FILES */
router.get("/", authenticate, async (req, res) => {

  const files = await File.find({ uploadedBy: req.user.id });

  res.json(files);
});

/* DOWNLOAD FILE */
router.get("/:id", authenticate, async (req, res) => {

  const file = await File.findById(req.params.id);

  if (!file) {
    return res.status(404).json({ message: "File not found" });
  }

  // 🔐 Make sure user owns the file
  

  const filePath = path.join(__dirname, "..", "uploads", file.storedName);

  res.download(filePath, file.originalName);
});

module.exports = router;

router.delete("/:id", authenticate, async (req, res) => {

  const file = await File.findById(req.params.id);
  if (!file) return res.status(404).json({ message: "File not found" });

  // If not admin, check ownership
  if (
    req.user.role !== "admin" &&
    file.uploadedBy.toString() !== req.user.id
  ) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const fs = require("fs");
  fs.unlinkSync("uploads/" + file.storedName);

  await file.deleteOne();

  res.json({ message: "File deleted successfully" });
});