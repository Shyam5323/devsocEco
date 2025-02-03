const mongoose = require("mongoose");

const baseEmissionFields = {
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  description: String,
};

// Daily emissions (things that typically occur daily like commuting)
const dailyEmissionSchema = new mongoose.Schema({
  ...baseEmissionFields,
  category: {
    type: String,
    enum: ["transport", "food", "waste"],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

dailyEmissionSchema.index(
  { user_id: 1, category: 1, date: 1 },
  { unique: true }
);

const monthlyEmissionSchema = new mongoose.Schema({
  ...baseEmissionFields,
  category: {
    type: String,
    enum: ["energy", "appliances"],
    required: true,
  },
  month: {
    type: Date,
    required: true,
  },
});

monthlyEmissionSchema.index(
  { user_id: 1, category: 1, month: 1 },
  { unique: true }
);

const onUseEmissionSchema = new mongoose.Schema({
  ...baseEmissionFields,
  category: {
    type: String,
    enum: ["purchases", "other"],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

onUseEmissionSchema.index({ user_id: 1 });

dailyEmissionSchema.pre("save", function (next) {
  this.date = new Date(this.date.setHours(0, 0, 0, 0));
  next();
});

monthlyEmissionSchema.pre("save", function (next) {
  this.month = new Date(this.month.getFullYear(), this.month.getMonth(), 1);
  next();
});

const DailyEmission = mongoose.model("DailyEmission", dailyEmissionSchema);
const MonthlyEmission = mongoose.model(
  "MonthlyEmission",
  monthlyEmissionSchema
);
const OnUseEmission = mongoose.model("OnUseEmission", onUseEmissionSchema);

module.exports = {
  DailyEmission,
  MonthlyEmission,
  OnUseEmission,
};
