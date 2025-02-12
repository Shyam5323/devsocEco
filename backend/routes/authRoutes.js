const express = require("express");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

router.get("/check-auth", authMiddleware, (req, res) => {
  res.json({ isAuthenticated: true, user: req.user });
});

module.exports = router;
