const express = require("express")
const router = express.Router()
const { getAllPosts, uploadPostImage } = require("../controllers/post-controllers")
const upload = require("../config/multer-config")

router.get("/", getAllPosts)


router.post("/upload-image", upload.single("image"), uploadPostImage)

module.exports = router