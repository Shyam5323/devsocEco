const Recommendation = require('../models/r');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const {
  DailyEmission,
  MonthlyEmission,
  OnUseEmission,
} = require("../models/emission");
require("dotenv").config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Helper function to aggregate user emissions data
async function getUserEmissionsData(userId) {
  const [dailyEmissions, monthlyEmissions, onUseEmissions] = await Promise.all([
    DailyEmission.find({ user_id: userId }).sort({ date: -1 }).limit(30),
    MonthlyEmission.find({ user_id: userId }).sort({ month: -1 }).limit(3),
    OnUseEmission.find({ user_id: userId }).sort({ timestamp: -1 }).limit(10),
  ]);

  return {
    daily_patterns: dailyEmissions.reduce((acc, emission) => {
      if (!acc[emission.category]) acc[emission.category] = [];
      acc[emission.category].push({
        value: emission.value,
        date: emission.date,
      });
      return acc;
    }, {}),
    monthly_usage: monthlyEmissions.reduce((acc, emission) => {
      if (!acc[emission.category]) acc[emission.category] = [];
      acc[emission.category].push({
        value: emission.value,
        month: emission.month,
      });
      return acc;
    }, {}),
    recent_purchases: onUseEmissions.map((emission) => ({
      category: emission.category,
      value: emission.value,
      description: emission.description,
    })),
  };
}

// AI recommendation function using Gemini
async function getAIRecommendations(analysisData) {
  try {
    const prompt = `
      Act as a sustainability expert and analyze the following carbon emissions data to provide specific, actionable recommendations:
      
      User Data:
      ${JSON.stringify(analysisData, null, 2)}
      
      Please provide recommendations in the following JSON format:
      [
        {
          "category": "transport|energy|food|waste|purchases|appliances|other",
          "suggestion": "specific actionable recommendation",
          "potential_impact": number (CO2 reduction in kg),
          "difficulty": "easy|medium|hard"
        }
      ]
      
      Focus on practical, high-impact suggestions based on the user's emission patterns.
      Ensure recommendations are specific to their location and current season.
      Include numerical estimates of potential CO2 reduction.

      Don't add any note just the json 
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\[.*\]/s);
    console.log(responseText);

    // Parse the JSON response
    try {
      return JSON.parse(jsonMatch);
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      return getBasicRecommendations(analysisData);
    }
  } catch (error) {
    console.error("Error getting Gemini recommendations:", error);
    return getBasicRecommendations(analysisData);
  }
}

// Fallback basic recommendations
function getBasicRecommendations(analysisData) {
  const recommendations = [];
  const { daily_patterns, monthly_usage } = analysisData.emissions_data;

  if (daily_patterns.transport?.some((d) => d.value > 10)) {
    recommendations.push({
      category: "transport",
      suggestion:
        "Consider carpooling or using public transport for your daily commute",
      potential_impact: 5.2,
      difficulty: "medium",
    });
  }

  if (monthly_usage.energy?.some((d) => d.value > 300)) {
    recommendations.push({
      category: "energy",
      suggestion: "Switch to LED bulbs and install a programmable thermostat",
      potential_impact: 15.3,
      difficulty: "easy",
    });
  }

  return recommendations;
}

const recommendationController = {
  // Get personalized recommendations
  async getRecommendations(req, res) {
    try {
      const userId = req.user?._id || "67a098d79f7f6957cbb2936e"; // add actual id
      const emissionsData = await getUserEmissionsData(userId);

      const analysisData = {
        emissions_data: emissionsData,
        user_location: req.user?.city || "Vellore", // Add actual city
        current_season: new Date().getMonth(),
      };

      const aiRecommendations = await getAIRecommendations(analysisData);

      const recommendationDoc = await Recommendation.findOneAndUpdate(
        { user_id: userId },
        {
          $set: {
            recommendations: aiRecommendations,
            last_updated: new Date(),
          },
        },
        { upsert: true, new: true }
      );

      res.json(recommendationDoc);
    } catch (error) {
      console.error("Error getting recommendations:", error);
      res.status(500).json({ error: "Failed to get recommendations" });
    }
  },

  // Mark recommendation as implemented
  async markImplemented(req, res) {
    try {
      const { recommendationId } = req.params;
      const userId = req.user._id;

      const result = await Recommendation.findOneAndUpdate(
        {
          user_id: userId,
          "recommendations._id": recommendationId,
        },
        {
          $set: {
            "recommendations.$.implemented": true,
          },
        },
        { new: true }
      );

      if (!result) {
        return res.status(404).json({ error: "Recommendation not found" });
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to update recommendation" });
    }
  },

  // Get implementation history
  async getImplementationHistory(req, res) {
    try {
      const userId = req.user?._id || "67a098d79f7f6957cbb2936e";

      const history = await Recommendation.findOne({ user_id: userId })
        .select("recommendations")
        .where("recommendations.implemented")
        .equals(true);

      res.json(history || { recommendations: [] });
    } catch (error) {
      res.status(500).json({ error: "Failed to get implementation history" });
    }
  },
};

module.exports = recommendationController;
