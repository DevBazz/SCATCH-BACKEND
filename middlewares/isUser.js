const jwt = require('jsonwebtoken');
const UserModel = require('../models/user-model');

module.exports.isUser = async (req, res, next) => {
    try {
        const token = req.cookies.userToken;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized, no token provided' });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await UserModel.findOne({ _id: decoded.id});
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}
