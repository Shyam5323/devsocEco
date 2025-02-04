const express = require("express");
const LeaderboardService = require("../services/LeaderboardService");
const Leaderboard = require("../models/Leaderboard");
const router = express.Router();

// Get leaderboard for a specific city and group
router.get("/:city/:group", async (req, res) => {
  try {
    const { city, group } = req.params;
    const leaderboard = await Leaderboard.getTopPerformers(city, group);
    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

// Get user's rank and emission reduction data
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const userEntry = await Leaderboard.findOne({ user_id: userId });
    if (!userEntry) {
      return res.status(404).json({ message: "User not found in leaderboard" });
    }
    res.status(200).json(userEntry);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user leaderboard data" });
  }
});

// Update leaderboard manually (if needed)
router.post("/update/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    await LeaderboardService.updateLeaderboard(userId);
    res.status(200).json({ message: "Leaderboard updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update leaderboard" });
  }
});

// Get user's achievements
router.get("achievements/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const userEntry = await Leaderboard.findOne({ user_id: userId }).select("achievements");
    if (!userEntry) {
      return res.status(404).json({ message: "User not found in leaderboard" });
    }
    res.status(200).json({ achievements: userEntry.achievements });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user achievements" });
  }
});

module.exports = router;
