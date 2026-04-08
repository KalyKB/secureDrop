const express = require("express");
const router = express.Router();
const User = require("../models/User");
const File = require("../models/File");
const authenticate = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// 👑 Get all users
router.get("/users",
  authenticate,
  authorizeRoles("admin"),
  async (req, res) => {

    const users = await User.find().select("-password");
    res.json(users);
});


// 👑 Change user role
router.put("/users/:id/role",
  authenticate,
  authorizeRoles("admin"),
  async (req, res) => {

    const { role } = req.body;

    if (!["viewer", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    await User.findByIdAndUpdate(req.params.id, { role });

    res.json({ message: "Role updated successfully" });
});

module.exports = router;