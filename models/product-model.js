const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
     Title : {
        type: String
     },
     
     Price : {
        type: Number
     },

     Category: {
        type: String
     },

     Discount : {
        type: Number,
        default : 0
     },

     Image : {
        type : String
     },

     Description : {
        type : String
     },

     BGColor : {
        type : String,
        default : "#fffff"     
    }
})

module.exports = mongoose.model('Product', productSchema)