const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  status: { type: String, enum: ["active", "deleted"], default: "active" }
});

module.exports = mongoose.model("Comment", commentSchema);
