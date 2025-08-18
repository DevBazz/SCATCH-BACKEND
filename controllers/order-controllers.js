const orderModel = require("../models/order-model")

module.exports.getAllOrders = async (req, res) => {
  try {
    
    const limit = parseInt(req.query.limit) || 0; 
    const sortOrder = req.query.sort === "desc" ? -1 : 1; 

    const orders = await orderModel
      .find()
      .populate("UserID")
      .populate("Products.ProductID")
      .sort({ createdAt: sortOrder })
      .limit(limit);

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Error fetching orders" });
  }
};


module.exports.createOrder = async (req, res) => {
    try {
         const { Products, TotalPrice, Address, Phone } = req.body;
         const userID = req.user.id;
         const newOrder = await orderModel.create({
            UserID: userID,
            Products,
            TotalPrice,
            Address,
            Phone,
            Status: "Pending",
         })
         
         res.status(201).json({
            message: "Order created successfully",
            order: newOrder
         })
    } catch (error) {
        res.status(500).json({ message: "Error creating order", error: error.message });
    }
}

module.exports.deleteOrder = async (req, res) => {
  try {
    const { orderID } = req.params;

    const order = await orderModel.findById(orderID);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.Status !== "Cancelled") {
      return res.status(400).json({ message: "Order cannot be deleted as it is not cancelled" });
    }

    const deletedOrder = await orderModel.findByIdAndDelete(orderID);
    res.json({ message: "Order deleted successfully", deletedOrder });

  } catch (error) {
    res.status(500).json({ message: "Error deleting order", error: error.message });
  }
};

module.exports.getOrder = async (req, res) => {
  try {
     const { orderID } = req.params;
     const order = await orderModel.findById({ _id: orderID }).populate('UserID').populate('Products.ProductID')
      if (!order) {
          return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
  } catch (error) {
    console.log(error)
      res.status(500).json({ message: "Error fetching order", error: error.message });
  }
}

module.exports.updateOrderStatus = async (req, res) => {
  const { orderID } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderID,
      { Status: status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order status updated successfully", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: "Error updating order status", error: error.message });
  }
}

module.exports.getOrdersCount = async (req, res) => {
  try {
    const totalOrders = await orderModel.countDocuments();
    res.status(200).json({ totalOrders });
  } catch (error) {
    console.error("Error fetching product count:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.getBestSellingProduct = async (req, res) => {
  try {
    const bestSelling = await orderModel.aggregate([
      { $unwind: "$Products" }, 
      {
        $group: {
          _id: "$Products.ProductID",
          totalSold: { $sum: "$Products.Quantity" }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 4 }, 
      {
        $lookup: {
          from: "products", 
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 0,
          productId: "$product._id",
          title: "$product.Title",
          price: "$product.Price", 
          image: "$product.Image",
          BGColor: "$product.BGColor",
          totalSold: 1
        }
      }
    ]);

    res.json(bestSelling.length ? bestSelling : { message: "No sales yet" });
  } catch (error) {
    res.status(500).json({ message: "Error fetching best-selling products" });
  }
};

module.exports.getTotalSales = async (req, res) => {
  try {
    const totalSales = await orderModel.aggregate([
      { $unwind: "$Products" },
      {
        $lookup: {
          from: "products",
          localField: "Products.ProductID",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $multiply: ["$Products.Quantity", "$productDetails.Price"]
            }
          }
        }
      }
    ]);

    res.json({
      totalSales: totalSales.length > 0 ? totalSales[0].totalRevenue : 0
    });
  } catch (error) {
    res.status(500).json({ message: "Error calculating total sales" });
  }
};

module.exports.getMonthlySales = async (req, res) => {
   try {
    const sales = await orderModel.aggregate([
      { $match: { Status: "Delivered" } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$TotalPrice" },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    
    const formatted = sales.map(s => ({
      month: new Date(0, s._id - 1).toLocaleString("default", { month: "short" }),
      total: s.total
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}