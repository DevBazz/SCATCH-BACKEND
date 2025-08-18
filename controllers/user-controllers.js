const userModel = require('../models/user-model');
const bcrypt = require("bcrypt")
const uploadToCloudinary = require("../utils/uploadToCloudinary")

 module.exports.getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message : 'Error fetching users', error: error.message})
    }
}

module.exports.getUserDetails = async (req, res) => {
     try { 
    const { _id, Name, Email, ProfileImage } = req.user;
    res.json({ _id, Name, Email, ProfileImage });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch admin profile" });
  }
}


module.exports.updateAdmin = async (req, res) => {
  try {
    const adminId = req.user._id; 
    const { Name, Email, Password } = req.body;
    let imageURL = null;

    const updateData = {};
    if (Name) updateData.Name = Name;
    if (Email) updateData.Email = Email;

    if (Password) {
      updateData.Password = await bcrypt.hash(Password, 10);
    }

    if (req.file) {
      try {
        imageURL = await uploadToCloudinary(req.file);
        updateData.ProfileImage = imageURL;
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        return res.status(500).json({ message: "Error uploading image" });
      }
    }

    
    updateData.Role = "Admin";

    const updatedAdmin = await userModel.findByIdAndUpdate(
      adminId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      message: "Admin profile updated successfully",
      admin: updatedAdmin
    });
  } catch (error) {
    console.error("Update Admin Error:", error);
    res.status(500).json({ message: "Server error updating admin profile" });
  }
};


module.exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const deletedUser = await userModel.findOneAndDelete({_id: userId})
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully', deletedUser });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error deleting user', error: error.message})
    }
}

module.exports.manageUserStatus = async (req, res) => {

    const {userId } = req.params;
    const { newRole } = req.body;

    try {
        const user = await userModel.findByIdAndUpdate(
            userId,
            { Role: newRole },
            { new: true }
        )
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
          
    } catch (error) {
        
    }
}

module.exports.getUsersCount = async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments();
    res.status(200).json({ totalUsers });
  } catch (error) {
    console.error("Error fetching product count:", error);
    res.status(500).json({ message: "Server error" });
  }
};