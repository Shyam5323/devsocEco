const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  title: { type: String, required: true },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
  status: { type: String, enum: ["active", "deleted"], default: "active" }
});

module.exports = mongoose.model("Post", postSchema);
