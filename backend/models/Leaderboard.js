const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    city: {
      type: String,
      required: true,
      index: true,
    },
    group: {
      type: String,
      required: true,
      index: true,
    },
    total_emission_reduction: {
      type: Number,
      default: 0,
      min: 0,
    },
    rank: {
      type: Number,
      min: 1,
    },
    achievements: [
      {
        type: String,
        enum: [
          "weekly_champion",
          "monthly_champion",
          "most_improved",
          "consistent_reducer",
        ],
      },
    ],
    last_updated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient querying within city and group
leaderboardSchema.index({ city: 1, group: 1, rank: 1 });

// Method to update ranks within a specific city and group
leaderboardSchema.statics.updateRanks = async function (city, group) {
  const leaderboard = await this.find({ city, group }).sort({
    total_emission_reduction: -1,
  });

  const updates = leaderboard.map((entry, index) => ({
    updateOne: {
      filter: { _id: entry._id },
      update: { $set: { rank: index + 1 } },
    },
  }));

  if (updates.length > 0) {
    await this.bulkWrite(updates);
  }
};

// Method to get top performers in a city group
leaderboardSchema.statics.getTopPerformers = async function (
  city,
  group,
  limit = 10
) {
  return await this.find({ city, group })
    .sort({ rank: 1 })
    .limit(limit)
    .populate("user_id", "name avatar")
    .select("-__v");
};

// Method to update user's emission reduction
leaderboardSchema.statics.updateUserEmissionReduction = async function (
  userId,
  city,
  group,
  reductionAmount
) {
  const entry = await this.findOneAndUpdate(
    { user_id: userId, city, group },
    {
      $inc: { total_emission_reduction: reductionAmount },
      $set: { last_updated: new Date() },
    },
    { new: true, upsert: true }
  );

  await this.updateRanks(city, group);
  return entry;
};

const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);

module.exports = Leaderboard;
