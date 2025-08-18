const express = require('express')
const router = express.Router()
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProduct, getProductCount } = 
require("../controllers/product-controllers")
const { isAdmin } = require('../middlewares/isAdmin')
const upload = require('../config/multer-config')

router.get("/", isAdmin, getAllProducts)
router.get("/count", isAdmin, getProductCount)
router.get("/:Id", isAdmin,  getProduct)
router.post("/", isAdmin, upload.single('Image'), createProduct)
router.put("/:Id", isAdmin,  updateProduct)
router.delete("/:Id", isAdmin, deleteProduct)

module.exports = router