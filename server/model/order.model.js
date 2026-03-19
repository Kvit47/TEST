const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "items.productType",
        required: true,
      },
      productType: {
        type: String,
        enum: ["Bag", "Accessory"],
        required: true,
      },
      productData: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "cancelled", "failed"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["card", "cash", "paypal", "other"],
    default: "cash",
  },
  paymentStatus: {
    type: String,
    enum: ["unpaid", "paid", "refunded"],
    default: "unpaid",
  },
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String },
    country: { type: String },
    postalCode: { type: String },
    phone: { type: String },
  },
  notes: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
orderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;





