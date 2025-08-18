const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true
  },

  Password : {
    type: String,
    required: true
  },

  Email: {
    type: String,
    required: true,
    unique: true
  },


  ProfileImage: {
    type: String,
    default: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
  },

  Role: {
    type: String,
    enum: ["Admin", "User"],
    default: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
