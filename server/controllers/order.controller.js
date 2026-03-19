const Order = require("../model/order.model");
const User = require("../model/user.model");

// Create a new order from cart
const createOrderHandler = async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      notes,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order must contain at least one item" });
    }

    if (!shippingAddress || !shippingAddress.address) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    // Create the order
    const order = await Order.create({
      user: req.user.userId,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || "cash",
      notes: notes || "",
      status: "pending",
      paymentStatus: "unpaid",
    });

    // Populate the order with user details
    await order.populate("user", "username email");

    // Clear user's cart after creating the order
    // The items are now in the order, so cart should be empty
    await User.findByIdAndUpdate(req.user.userId, { cart: [] });

    res.status(201).json({ data: order, message: "Order created successfully" });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all orders for the logged-in user
const getUserOrdersHandler = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .populate("user", "username email");

    res.status(200).json({ data: orders });
  } catch (error) {
    console.error("Error getting user orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a single order by ID
const getOrderByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate("user", "username email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the order belongs to the user (unless admin)
    if (order.user._id.toString() !== req.user.userId && req.user.role !== "admin" && req.user.role !== "super_admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json({ data: order });
  } catch (error) {
    console.error("Error getting order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update order status (admin only or user can cancel their own pending order)
const updateOrderStatusHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check permissions
    const isOwner = order.user.toString() === req.user.userId;
    const isAdmin = req.user.role === "admin" || req.user.role === "super_admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Users can only cancel their own pending orders
    if (isOwner && !isAdmin && status !== "cancelled") {
      return res.status(403).json({ message: "You can only cancel your own orders" });
    }

    if (isOwner && !isAdmin && order.status !== "pending") {
      return res.status(400).json({ message: "Can only cancel pending orders" });
    }

    // Update the order
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    // If order is completed, paid, or cancelled, ensure cart is cleared
    // This handles cases where payment is confirmed or order is finalized
    if (status === "completed" || status === "cancelled" || paymentStatus === "paid") {
      await User.findByIdAndUpdate(order.user, { cart: [] });
    }

    res.status(200).json({ data: order, message: "Order updated successfully" });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete/cancel an order (user can delete their own pending orders, admin can delete any)
const deleteOrderHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check permissions
    const isOwner = order.user.toString() === req.user.userId;
    const isAdmin = req.user.role === "admin" || req.user.role === "super_admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Users can only delete their own pending orders
    if (isOwner && !isAdmin && order.status !== "pending") {
      return res.status(400).json({ message: "Can only delete pending orders" });
    }

    await Order.findByIdAndDelete(id);

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all orders (admin only)
const getAllOrdersHandler = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "username email");

    res.status(200).json({ data: orders });
  } catch (error) {
    console.error("Error getting all orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get pending/unpaid orders to restore to cart
const getPendingOrdersHandler = async (req, res) => {
  try {
    const pendingOrders = await Order.find({
      user: req.user.userId,
      status: "pending",
      paymentStatus: "unpaid",
    }).sort({ createdAt: -1 });

    res.status(200).json({ data: pendingOrders });
  } catch (error) {
    console.error("Error getting pending orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createOrderHandler,
  getUserOrdersHandler,
  getOrderByIdHandler,
  updateOrderStatusHandler,
  deleteOrderHandler,
  getAllOrdersHandler,
  getPendingOrdersHandler,
};





