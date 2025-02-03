const mongoose = require("mongoose");

const carbonOffsetSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  project_name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  amount_offset: {
    type: Number,
    required: true,
  },
  contribution_amount: {
    type: Number,
    required: true,
  },
  contribution_date: {
    type: Date,
    default: Date.now,
  },
});

carbonOffsetSchema.index({ user_id: 1, project_name: 1 }, { unique: true });

const CarbonOffset = mongoose.model("CarbonOffset", carbonOffsetSchema);

module.exports = CarbonOffset;
