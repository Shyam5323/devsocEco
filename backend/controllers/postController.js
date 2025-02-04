const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  try {
    const { user_id, category_id, title, content } = req.body;
    const post = new Post({ user_id, category_id, title, content });
    console.log(req.body);
    console.log(user_id);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPosts = async (req, res) => {
    try {
      const posts = await Post.find();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

exports.deletePost = async(req,res) =>{
    const {
        params : { id : postid}
    } = req;
    console.log(postid);
    try{
        const response = await Post.findOneAndDelete({
            postid
        })
        res.json(response);
    }
    catch(err){
        res.status(500).json({ error: error.message });
    }
}

exports.updatePost = async (req, res) => {
    const {
        params : { id : postid}
    } = req;
    console.log(postid);
    const {title, content, category_id } = req.body;

    try {
        if (!postid) {
            return res.status(400).json({ error: "Post ID (_id) is required" });
        }

        const updatedPost = await Post.findByIdAndUpdate(
            postid ,
            {             
                title, 
                content, 
                category_id, 
                updated_at: new Date() 
            },
            { new: true, runValidators: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ error: "Post not found" });
        }

        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
