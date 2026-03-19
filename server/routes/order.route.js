const express = require("express");
const router = express.Router();

const {
  createOrderHandler,
  getUserOrdersHandler,
  getOrderByIdHandler,
  updateOrderStatusHandler,
  deleteOrderHandler,
  getAllOrdersHandler,
  getPendingOrdersHandler,
} = require("../controllers/order.controller");

const { requireAdmin } = require("../middleware/role.middleware");

// User order routes
router.post("/", createOrderHandler); // Create new order
router.get("/", getUserOrdersHandler); // Get user's orders
router.get("/pending", getPendingOrdersHandler); // Get pending orders for cart restoration
router.get("/:id", getOrderByIdHandler); // Get single order
router.patch("/:id", updateOrderStatusHandler); // Update order status
router.delete("/:id", deleteOrderHandler); // Delete/cancel order

// Admin routes
router.get("/admin/all", requireAdmin, getAllOrdersHandler); // Get all orders (admin)

module.exports = router;





