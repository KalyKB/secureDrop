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
    try {
      const users = await User.findAll();
      res.json(users.map(u => ({
        _id: u.UserID,
        firstname: u.Username,
        email: u.Email,
        role: u.Role
      })));
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch users" });
    }
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

    try {
      await User.updateRole(req.params.id, role);
      res.json({ message: "Role updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update role" });
    }
  }
);

// Delete user and all their files
router.delete("/users/:id",
  authenticate,
  authorizeRoles("admin"),
  async (req, res) => {
    const userId = req.params.id;

    try {
      const files = await File.findByUser(userId);
      for (const file of files) {
        try {
          await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: file.StoredName }));
        } catch (err) {
          console.error("S3 delete error for file", file.StoredName, err.message);
        }
      }

      await User.deleteById(userId);
      res.json({ message: "User and their files deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to delete user" });
    }
  }
);

module.exports = router;
