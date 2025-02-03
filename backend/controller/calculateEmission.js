const Emission = require("../models/emission"); // Import the Emission model

// Function to calculate emissions based on user input
const calculateEmissions = (inputs, user_id) => {
  const emissions = [];

  // Transport Emissions
  const transportEmission = (inputs.carMileage || 0) * 0.2; // Example: 0.2 kg CO2 per km
  emissions.push({
    category: "transport",
    value: transportEmission,
    user_id,
    description: `Car mileage: ${inputs.carMileage} km`,
  });

  // Energy Emissions (e.g., LPG, electricity)
  const energyEmission =
    (inputs.lpg || 0) * 1.5 + (inputs.electricityBill || 0) * 0.4; // Example conversion factors
  emissions.push({
    category: "energy",
    value: energyEmission,
    user_id,
    description: `LPG: ${inputs.lpg} kg, Electricity Bill: ${inputs.electricityBill} kWh`,
  });

  // Food Emissions
  let foodEmission = 0;
  if (inputs.food) {
    foodEmission = calculateFoodEmissions(inputs.food); // Custom function to calculate based on food type
  }
  emissions.push({
    category: "food",
    value: foodEmission,
    user_id,
    description: `Food consumption: ${inputs.food}`,
  });

  // Add other categories (waste, purchases, appliances, etc.) similarly...

  return emissions;
};

const calculateFoodEmissions = (food) => {
  // Example: 100g of meat = 0.3 kg CO2, for a heavy meat eater
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

// Con
