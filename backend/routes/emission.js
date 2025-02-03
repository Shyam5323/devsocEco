const express = require("express");
const router = express.Router();
const { saveEmissions } = require("../controllers/calculateEmission");

// Route to submit emission data
router.post("/calculateEmissions", saveEmissions);



module.exports = router;
