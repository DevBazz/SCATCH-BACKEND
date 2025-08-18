const express = require('express');
const router = express.Router();
const upload  = require("../config/multer-config")
const { adminSignUp, adminLogin, userSignUp, userLogin, adminLogout } = require('../controllers/auth-controllers');
const { isAdmin } = require('../middlewares/isAdmin');

router.post('/admin/signup', upload.single('profile'),  adminSignUp)
router.post('/admin/login', adminLogin)
router.post("/admin/logout", isAdmin, adminLogout)


router.post('/login', userLogin);
router.post('/signup', upload.single('profile'), userSignUp)

module.exports = router;