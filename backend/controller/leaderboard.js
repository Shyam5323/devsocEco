const {
  DailyEmission,
  MonthlyEmission,
  OnUseEmission,
} = require("../models/emission");
const Leaderboard = require("../models/Leaderboard");
const User = require("../models/user"); // Assuming you have a User model

class LeaderboardService {
  // Calculate emission reduction by comparing with baseline or previous period
  static async calculateEmissionReduction(userId, startDate, endDate) {
    // Get all emissions for the period
    const [dailyEmissions, monthlyEmissions, onUseEmissions] =
      await Promise.all([
        DailyEmission.find({
          user_id: userId,
          date: { $gte: startDate, $lte: endDate },
        }),
        MonthlyEmission.find({
          user_id: userId,
          month: { $gte: startDate, $lte: endDate },
        }),
        OnUseEmission.find({
          user_id: userId,
          timestamp: { $gte: startDate, $lte: endDate },
        }),
      ]);

    // Calculate baseline (example: average emissions from previous period)
    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 1);

    const [prevDailyEmissions, prevMonthlyEmissions, prevOnUseEmissions] =
      await Promise.all([
        DailyEmission.find({
          user_id: userId,
          date: { $gte: previousPeriodStart, $lt: startDate },
        }),
        MonthlyEmission.find({
          user_id: userId,
          month: { $gte: previousPeriodStart, $lt: startDate },
        }),
        OnUseEmission.find({
          user_id: userId,
          timestamp: { $gte: previousPeriodStart, $lt: startDate },
        }),
      ]);

    // Calculate total emissions for current and previous period
    const currentEmissions = this.sumEmissions(
      dailyEmissions,
      monthlyEmissions,
      onUseEmissions
    );
    const previousEmissions = this.sumEmissions(
      prevDailyEmissions,
      prevMonthlyEmissions,
      prevOnUseEmissions
    );

    // Return the reduction (positive if emissions decreased)
    return previousEmissions - currentEmissions;
  }

  static sumEmissions(daily, monthly, onUse) {
    const dailySum = daily.reduce((sum, emission) => sum + emission.value, 0);
    const monthlySum = monthly.reduce(
      (sum, emission) => sum + emission.value,
      0
    );
    const onUseSum = onUse.reduce((sum, emission) => sum + emission.value, 0);
    return dailySum + monthlySum + onUseSum;
  }

  // Update leaderboard after new emissions are saved
  static async updateLeaderboard(userId) {
    try {
      // Get user's city and group information
      const user = await User.findById(userId);
      if (!user || !user.city || !user.group) {
        throw new Error("User, city, or group information not found");
      }

      // Calculate emission reduction for the last 30 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const reductionAmount = await this.calculateEmissionReduction(
        userId,
        startDate,
        endDate
      );

      // Update leaderboard with the new reduction
      await Leaderboard.updateUserEmissionReduction(
        userId,
        user.city,
        user.group,
        reductionAmount
      );

      // Check and assign achievements
      await this.checkAndAssignAchievements(userId, user.city, user.group);
    } catch (error) {
      console.error("Error updating leaderboard:", error);
      throw error;
    }
  }

  // Check and assign achievements based on performance
  static async checkAndAssignAchievements(userId, city, group) {
    const leaderboardEntry = await Leaderboard.findOne({
      user_id: userId,
      city,
      group,
    });
    const achievements = [];

    // Check for weekly champion
    const topWeeklyPerformer = await Leaderboard.findOne({ city, group }).sort({
      total_emission_reduction: -1,
    });

    if (topWeeklyPerformer?.user_id.toString() === userId) {
      achievements.push("weekly_champion");
    }

    // Check for consistent reducer (reduced emissions for 3 consecutive weeks)
    const threeWeeksAgo = new Date();
    threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);

    const consistentReduction = await this.calculateEmissionReduction(
      userId,
      threeWeeksAgo,
      new Date()
    );

    if (consistentReduction > 0) {
      achievements.push("consistent_reducer");
    }

    // Update achievements if any new ones earned
    if (achievements.length > 0) {
      await Leaderboard.findByIdAndUpdate(leaderboardEntry._id, {
        $addToSet: { achievements: { $each: achievements } },
      });
    }
  }
}

// Middleware to update leaderboard after saving emissions
async function updateLeaderboardMiddleware(next) {
  try {
    await LeaderboardService.updateLeaderboard(this.user_id);
  } catch (error) {
    console.error("Error in leaderboard middleware:", error);
  }
  next();
}

// Add middleware to emission models
DailyEmission.post("save", updateLeaderboardMiddleware);
MonthlyEmission.post("save", updateLeaderboardMiddleware);
OnUseEmission.post("save", updateLeaderboardMiddleware);

module.exports = LeaderboardService;
