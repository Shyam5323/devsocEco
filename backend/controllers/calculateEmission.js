const {
  DailyEmission,
  MonthlyEmission,
  OnUseEmission,
} = require("../models/emission");

const calculateDailyEmissions = (inputs, user_id) => {
  const emissions = [];

  // Transport Emissions (daily)
  if (inputs.carMileage) {
    emissions.push({
      category: "transport",
      value: inputs.carMileage * 0.2, // 0.2 kg CO2 per km
      user_id,
      description: `Car mileage: ${inputs.carMileage} km`,
      date: new Date(),
    });
  }

  // Food Emissions (daily)
  if (inputs.food) {
    emissions.push({
      category: "food",
      value: calculateFoodEmissions(inputs.food),
      user_id,
      description: `Food consumption type: ${inputs.food}`,
      date: new Date(),
    });
  }

  // Waste Emissions (daily)
  if (inputs.waste) {
    emissions.push({
      category: "waste",
      value: inputs.waste * 0.1, // Example: 0.1 kg CO2 per kg of waste
      user_id,
      description: `Waste generated: ${inputs.waste} kg`,
      date: new Date(),
    });
  }

  return emissions;
};

const calculateMonthlyEmissions = (inputs, user_id) => {
  const emissions = [];

  // Energy Emissions (monthly)
  if (inputs.lpg || inputs.electricityBill) {
    emissions.push({
      category: "energy",
      value: (inputs.lpg || 0) * 1.5 + (inputs.electricityBill || 0) * 0.4,
      user_id,
      description: `LPG: ${inputs.lpg || 0} kg, Electricity Bill: ${
        inputs.electricityBill || 0
      } kWh`,
      month: new Date(),
    });
  }

  // Appliances (monthly)
  if (inputs.appliances) {
    emissions.push({
      category: "appliances",
      value: inputs.appliances * 0.5, // Example conversion factor
      user_id,
      description: `Monthly appliance usage`,
      month: new Date(),
    });
  }

  return emissions;
};

const calculateOnUseEmissions = (inputs, user_id) => {
  const emissions = [];

  // Purchases (on-use)
  if (inputs.purchases) {
    emissions.push({
      category: "purchases",
      value: inputs.purchases * 0.3, // Example: 0.3 kg CO2 per dollar spent
      user_id,
      description: `Purchase value: $${inputs.purchases}`,
      timestamp: new Date(),
    });
  }

  // Other one-time emissions
  if (inputs.other) {
    emissions.push({
      category: "other",
      value: inputs.other,
      user_id,
      description: inputs.otherDescription || "Other emissions",
      timestamp: new Date(),
    });
  }

  return emissions;
};

const calculateFoodEmissions = (food) => {
  const foodEmissionRates = {
    heavy_meat_eater: 0.3,
    medium_meat_eater: 0.2,
    low_meat_eater: 0.1,
    pescatarian: 0.05,
    vegetarian: 0.02,
    vegan: 0.01,
  };

  return foodEmissionRates[food] || 0;
};

const saveEmissions = async (req, res) => {
  try {
    const user_id = req.user?._id || "67a098d79f7f6957cbb2936e"; // Fallback for testing
    const inputs = req.body;

    // Calculate emissions for each category
    const dailyEmissions = calculateDailyEmissions(inputs, user_id);
    const monthlyEmissions = calculateMonthlyEmissions(inputs, user_id);
    const onUseEmissions = calculateOnUseEmissions(inputs, user_id);

    // Save emissions using appropriate models
    const savedEmissions = await Promise.all([
      ...dailyEmissions.map((emission) =>
        DailyEmission.findOneAndUpdate(
          {
            user_id: emission.user_id,
            category: emission.category,
            date: new Date(new Date().setHours(0, 0, 0, 0)),
          },
          emission,
          { upsert: true, new: true }
        )
      ),
      ...monthlyEmissions.map((emission) =>
        MonthlyEmission.findOneAndUpdate(
          {
            user_id: emission.user_id,
            category: emission.category,
            month: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
          emission,
          { upsert: true, new: true }
        )
      ),
      ...onUseEmissions.map((emission) => new OnUseEmission(emission).save()),
    ]);

    res.status(201).json({
      message: "Emissions saved successfully",
      emissions: savedEmissions,
    });
  } catch (error) {
    console.error("Error saving emissions:", error);
    res.status(500).json({
      message: "Error saving emissions",
      error: error.message,
    });
  }
};

module.exports = { saveEmissions };
