require('dotenv').config()
const mongoose = require('mongoose')

const connectDB = async () => {
     try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("MongoDB Connected")
     } catch (error) {
        console.log("Error Connecting to DataBase", error)
     }
}

module.exports = connectDB;

