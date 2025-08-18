const userModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const generateToken = require('../utils/generate-token')

module.exports.adminSignUp = async (req, res) => {
    try {
        const { Name, Email, Password } = req.body;
        const existingAdmin = await userModel.find({ Role: 'admin' });
        if (existingAdmin.length > 0) {
            return res.status(400).json({ message: "You're not Authorized to perform this action" });
        }
        
    
        const hashedPassword = await bcrypt.hash(Password, 10)
        const newAdmin = await userModel.create({
            Name,
            Email,
            Password: hashedPassword,
            Role: 'Admin'
        })
        

        const token = generateToken(newAdmin)

            res.cookie('adminToken', token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            })
        res.status(201).json({ message: "Admin registered successfully" })
    } catch (error) {
        res.status(500).json({ message: "Ërror occurred while signing up"})
    }
}

module.exports.adminLogin = async (req, res) => {
    try {
        const { Email, Password } = req.body;
        const admin = await userModel.findOne({ Email, Role: 'Admin' });
        if (!admin) {
            return res.status(400).json({ message: "Invalid credentials or not authorized" });
        }
  
       const isMatch = await bcrypt.compare(Password, admin.Password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentails" });
        }
        
        const token = generateToken(admin);
        res.cookie('adminToken', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        })
        res.status(200).json({ message: "Admin logged in successfully", token });
    } catch (error) {
        res.status(500).json({ message: "Error occurred while logging in" });       
    }
}


module.exports.userSignUp = async (req, res) => {
   
 const { Name, Email, Password } = req.body;
  try {
    const existingUser = await userModel.findOne({ Email });
    if (existingUser) {
      return res.status(400).json({ message: "Already Registered, Please Login" });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);
    const newUser = await userModel.create({
        Name,
        Email,
        Password: hashedPassword,
        Role: 'User'
    })

    const token = generateToken(newUser);
    res.cookie('userToken', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during user signup:", error);
    return res.status(500).json({ message: "Error occurred while signing up" });
  }

}

module.exports.userLogin = async (req, res) => {
    const { Email, Password } = req.body;
    try {
        const user = await userModel.findOne({ Email, Role: 'User' });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials or not authorized" });
        }

        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user);
        res.cookie('userToken', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.status(200).json({ message: "User logged in successfully",
            token,
            user: {
                id: user._id,
                Name: user.Name,
                Email: user.Email,
                Role: user.Role
            }
         });
    } catch (error) {
        console.error("Error during user login:", error);
        return res.status(500).json({ message: "Error occurred while logging in" });
    }
}

module.exports.adminLogout = async (req, res) => {
    try {
       
        res.clearCookie("adminToken", {
            httpOnly: true,       
            sameSite: "strict",   
        });

        res.status(200).json({ message: "Admin logged out successfully" });
    } catch (error) {
        console.error("Error logging out admin:", error);
        res.status(500).json({ message: "Failed to logout admin" });
    }
}