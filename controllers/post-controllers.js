const postModel = require("../models/post-model");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

module.exports.getAllPosts = async (req, res) => {
    try {
        const allPosts = await postModel.find();
        res.json(allPosts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching posts" });
    }
};

module.exports.uploadPostImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const imageUrl = await uploadToCloudinary(req.file);

        
        res.json({
            success: true,
            url: imageUrl  
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            error: "Image upload failed" 
        });
    }
};

module.exports.createPost = async (req, res) => {
  try {
    const { title, description, content, tags, featuredImage } = req.body;

    if (!title || !description || !content) {
      return res.status(400).json({ message: "Title, description, and content are required" });
    }


    const tagsArray = tags ? tags.split(",").map((tag) => tag.trim()) : [];

    const newPost = await postModel.create({
      title,
      description,
      content,
      tags: tagsArray,   
      featuredImage,
    });

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getPostById = async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.deletePost = async (req, res) => {
  try {
    const deletedPost = await postModel.findByIdAndDelete(req.params.id);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

