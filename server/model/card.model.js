const mongoose = require("mongoose");

/**
 * Schema for a single cart item. Used for validation and typing.
 * Cart is stored on the User model; this is not a separate collection.
 */
const cartItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, default: 1, min: 1 },
    productData: { type: mongoose.Schema.Types.Mixed },
  },
  { _id: false }
);

module.exports = { cartItemSchema };
