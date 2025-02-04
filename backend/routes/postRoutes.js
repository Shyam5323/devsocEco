const express = require("express");
const { createPost, getPosts, deletePost ,updatePost } = require("../controllers/postController");

const router = express.Router();

router.post("/", createPost);
router.delete("/:id",deletePost);
router.patch("/:id",updatePost);
router.get("/", getPosts);

module.exports = router;
