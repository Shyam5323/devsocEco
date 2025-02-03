const express = require("express");
const router = express.Router();
const { saveEmissions } = require("../controllers/calculateEmission");

// Route to submit emission data
router.post("/calculateEmissions", saveEmissions);

router.get("/calculateEmissions", (req, res) => {
  res.send("Dummy response for testing the route");
});

module.exports = router;
