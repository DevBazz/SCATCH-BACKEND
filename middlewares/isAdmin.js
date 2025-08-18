const jwt = require('jsonwebtoken');
const userModel = require('../models/user-model');

module.exports.isAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.adminToken;
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const admin = await userModel.findById(decoded.id);

        if (!admin) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (admin.Role !== 'Admin') {
            return res.status(403).json({ message: 'Access denied, admin only' });
        }

        req.user = admin;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Invalid token' });
    }
};
