const Comment = require("../models/Comment");

exports.createComment = async (req, res) => {
  try {
    const { post_id, user_id, content } = req.body;
    const comment = new Comment({ post_id, user_id, content });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post_id: req.params.post_id });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
