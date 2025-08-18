const postModel = require("../models/post-model")
const uploadToCloudinary = require("../utils/uploadToCloudinary")

module.exports.getAllPosts = async (req, res) => {
    try {
        const allPosts = await postModel.find()
        res.json(allPosts) 
    } catch (error) {
        console.log(error)
        res.status(500).json({ message : "Error fetching products"})
    }
}

module.exports.uploadPostImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imageUrl = await uploadToCloudinary(req.file);

    // Return Jodit-compatible response
    res.json({
      success: true,
      files: [
        { path: imageUrl }
      ]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload failed" });
  }
};

