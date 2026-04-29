const express = require("express");
const router = express.Router();
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const User = require("../models/User");
const File = require("../models/File");
const authenticate = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const s3 = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  }
});

const BUCKET = process.env.AWS_BUCKET;

// Get all users
router.get("/users",
  authenticate,
  authorizeRoles("admin"),
  async (req, res) => {
    const users = await User.findAll();
    res.json(users.map(u => ({
      _id: u.UserID,
      firstname: u.Username,
      email: u.Email,
      role: u.Role
    })));
  }
);

// Change user role
router.put("/users/:id/role",
  authenticate,
  authorizeRoles("admin"),
  async (req, res) => {
    const { role } = req.body;

    if (!["uploader", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    await User.updateRole(req.params.id, role);

    res.json({ message: "Role updated successfully" });
  }
);

// Delete user and all their files
router.delete("/users/:id",
  authenticate,
  authorizeRoles("admin"),
  async (req, res) => {
    const userId = req.params.id;

    // Delete all user's files from S3 first
    const files = await File.findByUser(userId);
    for (const file of files) {
      try {
        await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: file.StoredName }));
      } catch (err) {
        console.error("S3 delete error for file", file.StoredName, err.message);
      }
      await File.deleteById(file.FileID);
    }

    await User.deleteById(userId);
    res.json({ message: "User and their files deleted" });
  }
);

module.exports = router;
