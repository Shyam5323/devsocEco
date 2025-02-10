const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Protected routes
router.get("/dashboard", authMiddleware, (req, res) => {
  res.json({ message: "Welcome to the dashboard", user: req.user });
});

router.get("/leaderboard", authMiddleware, (req, res) => {
  res.json({ message: "Welcome to the leaderboard", user: req.user });
});

router.get("/bestpractices", authMiddleware, (req, res) => {
  res.json({ message: "Welcome to the best practices", user: req.user });
});

module.exports = router;