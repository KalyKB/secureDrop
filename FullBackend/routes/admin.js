const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authenticate = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

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

module.exports = router;
