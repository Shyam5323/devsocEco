const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  },
  password_hash: {
    type: String,
    required: true,
  },
  join_date: {
    type: Date,
    default: Date.now,
  },
  country: {
    type: String,
    trim: true,
    maxlength: 100,
  },
  profile_completion_percentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  role: {
    type: String,
    enum: ["user", "moderator", "admin"],
    default: "user",
  },
  verified_for_carpooling: {
    type: Boolean,
    default: false,
  },
  carbon_offset_purchased: {
    type: Boolean,
    default: false,
  },
  last_login: {
    type: Date,
  },
  total_emission: {
    type: Number,
    default: 0,
  },
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password_hash")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password_hash = await bcrypt.hash(this.password_hash, salt);
  next();
});

module.exports = mongoose.model("User", UserSchema);
