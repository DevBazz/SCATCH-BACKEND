const express = require("express")
const router = express.Router()
const { getAllPosts, uploadPostImage, createPost, getPostById, deletePost } = require("../controllers/post-controllers")
const upload = require("../config/multer-config")

router.get("/", getAllPosts)
router.get("/:id", getPostById);


router.post("/create-post", createPost)
router.post("/upload-image", upload.single("file"), uploadPostImage)

router.delete("/:id", deletePost);

module.exports = router