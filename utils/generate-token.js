const jwt = require('jsonwebtoken');

 const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            Email: user.Email,
            Role: user.Role
        },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    );
}

module.exports = generateToken;
