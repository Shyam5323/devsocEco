const mongoose = require("mongoose");

const LeaderboardSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  city: { type: String, required: true },
  group: { type: String, required: true },
  total_emission_reduction: { type: Number, default: 0 },
  achievements: { type: [String], default: [] },
});

LeaderboardSchema.statics.updateUserEmissionReduction = async function (
  userId,
  city,
  group,
  reductionAmount
) {
  return this.findOneAndUpdate(
    { user_id: userId, city, group },
    { $set: { total_emission_reduction: reductionAmount } },
    { upsert: true, new: true }
  );
};

const Leaderboard = mongoose.model("Leaderboard", LeaderboardSchema);
module.exports = Leaderboard;
