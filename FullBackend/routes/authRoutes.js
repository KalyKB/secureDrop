const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

/* REGISTER */
router.post("/register", async (req, res) => {
  try {
    const { firstname, email, password } = req.body;

    if (!firstname || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const existingUser = await User.findByEmail(email);
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({ firstname, email, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* LOGIN */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    if (user.LockUntil && new Date(user.LockUntil) > new Date())
      return res.status(403).json({ message: "Account locked. Try later." });

    const match = await bcrypt.compare(password, user.PasswordHash);

    if (!match) {
      const attempts = user.LoginAttempts + 1;
      const lockUntil = attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;
      await User.updateLoginAttempts(user.UserID, attempts, lockUntil);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    await User.resetLoginAttempts(user.UserID);

    const token = jwt.sign(
      { id: user.UserID, role: user.Role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
