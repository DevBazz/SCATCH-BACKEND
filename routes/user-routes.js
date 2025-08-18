const express = require('express');
const { getAllUsers, deleteUser, manageUserStatus, getUsersCount, getUserDetails, updateAdmin } = require('../controllers/user-controllers');
const { isAdmin } = require('../middlewares/isAdmin');
const upload = require("../config/multer-config")
const router = express.Router();

router.get('/', isAdmin,  getAllUsers)
router.get("/profile", isAdmin, getUserDetails )
router.get("/count", isAdmin, getUsersCount)

router.put("/updateAdmin", isAdmin, upload.single("Image"), updateAdmin)
router.put('/:userId', isAdmin,  manageUserStatus)
router.delete('/:userId', isAdmin,  deleteUser)

module.exports = router;