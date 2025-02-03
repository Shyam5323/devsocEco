// Recommendation schema
const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recommendations: [
    {
      category: {
        type: String,
        enum: [
          "transport",
          "energy",
          "food",
          "waste",
          "purchases",
          "appliances",
          "other",
        ],
        required: true,
      },
      suggestion: {
        type: String,
        required: true,
      },
      potential_impact: {
        type: Number, // Potential CO2 reduction in kg
        required: true,
      },
      difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        required: true,
      },
      implemented: {
        type: Boolean,
        default: false,
      },
      created_at: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  last_updated: {
    type: Date,
    default: Date.now,
  },
});

const Recommendation = mongoose.model("Recommendation", recommendationSchema);

export default Recommendation;
