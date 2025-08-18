const express = require('express');
const router = express.Router();
const { getAllOrders, createOrder, deleteOrder, getOrder, 
        updateOrderStatus, getOrdersCount, getBestSellingProduct, getTotalSales, getMonthlySales} 
= require('../controllers/order-controllers');
const { isUser } = require('../middlewares/isUser')
const { isAdmin } = require('../middlewares/isAdmin')

router.get("/", isAdmin, getAllOrders);
router.get("/monthly-sales", isAdmin, getMonthlySales)
router.get("/count", isAdmin,  getOrdersCount)
router.get('/best-selling', isAdmin, getBestSellingProduct)
router.get("/total-sales", isAdmin, getTotalSales)
router.get("/:orderID", isAdmin,  getOrder)


router.post("/",  createOrder);
router.delete("/:orderID", isAdmin, deleteOrder);
router.put("/:orderID", isAdmin, updateOrderStatus)

module.exports = router;
