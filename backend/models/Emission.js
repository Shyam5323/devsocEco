const mongoose = require("mongoose");

const emissionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
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
  value: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  description: String,
});

emissionSchema.index({ user_id: 1 }, { unique: true });

const Emission = mongoose.model("Emission", emissionSchema);

module.exports = Emission;
