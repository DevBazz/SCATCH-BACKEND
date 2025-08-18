const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    UserID : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

   Products : [{
     ProductID : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
     },
     Quantity: {
        type: Number,
        default: 1
     }
   } ],

   TotalPrice : {
    type : Number,
    required: true
   },

   Address: {
    type: String,
    required: true
   },

   Phone: {
    type: String,
    required: true
   },

   Status : {
    type : String,
    enum : ["Pending", "Shipped", "Delivered", "Cancelled"],
    default : "Pending"
   }
}, {
    timestamps: true
}
)

module.exports = mongoose.model('Order', orderSchema)