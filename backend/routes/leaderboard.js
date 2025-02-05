const express = require("express");
const router = express.Router();
const { saveEmissions } = require("../controllers/calculateEmission");
const { getLeaderboard } = require("../controllers/leaderboard"); // Add this line

// Existing route
router.post("/calculateEmissions", saveEmissions);

// New leaderboard route
router.get("/", getLeaderboard);

module.exports = router;