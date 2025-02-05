const { DailyEmission, MonthlyEmission, OnUseEmission } = require("../models/emission");
const User = require("../models/User"); // Assuming you have a User model

const getLeaderboard = async (req, res) => {
  try {
    const { country, city, timeframe = 'month' } = req.query;
    const currentDate = new Date();
    
    // Define date range based on timeframe
    let startDate;
    if (timeframe === 'week') {
      startDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
    } else if (timeframe === 'month') {
      startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
    } else if (timeframe === 'year') {
      startDate = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
    }

    // Create location filter for users
    const locationFilter = {};
    if (country) locationFilter.country = country;
    if (city) locationFilter.city = city;

    // Get eligible users based on location
    const users = await User.find(locationFilter).select('_id name country city');

    // Aggregate emissions for each user
    const userEmissions = await Promise.all(
      users.map(async (user) => {
        // Get daily emissions
        const dailyTotal = await DailyEmission.aggregate([
          {
            $match: {
              user_id: user._id,
              date: { $gte: startDate }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$value" }
            }
          }
        ]);

        // Get monthly emissions
        const monthlyTotal = await MonthlyEmission.aggregate([
          {
            $match: {
              user_id: user._id,
              month: { $gte: startDate }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$value" }
            }
          }
        ]);

        // Get on-use emissions
        const onUseTotal = await OnUseEmission.aggregate([
          {
            $match: {
              user_id: user._id,
              timestamp: { $gte: startDate }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$value" }
            }
          }
        ]);

        // Calculate total emissions
        const totalEmissions = (
          (dailyTotal[0].total || 0) +
          (monthlyTotal[0].total || 0) +
          (onUseTotal[0].total || 0)
        );
        console.log(totalEmissions);

        return {
          user: {
            id: user._id,
            name: user.name,
            country: user.country,
            city: user.city
          },
          totalEmissions,
          timeframe
        };
      })
    );

    // Sort users by total emissions (ascending - lower is better)
    const sortedLeaderboard = userEmissions
      .sort((a, b) => a.totalEmissions - b.totalEmissions)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1
      }));

    res.status(200).json({
      message: "Leaderboard retrieved successfully",
      timeframe,
      filters: { country, city },
      leaderboard: sortedLeaderboard
    });

  } catch (error) {
    console.error("Error retrieving leaderboard:", error);
    res.status(500).json({
      message: "Error retrieving leaderboard",
      error: error.message
    });
  }
};

module.exports = { getLeaderboard };