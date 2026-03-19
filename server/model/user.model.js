const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Optional for OAuth users
  email: { type: String, required: true, unique: true },
  googleId: { type: String, unique: true, sparse: true }, // For Google OAuth
  role: {
    type: String,
    enum: ["admin", "client", "super_admin", "user"],
    default: "client",
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  // Profile Information
  bio: { type: String, default: "" },
  avatarUrl: { type: String, default: "" },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },

  sosialLinks: {
    twitter: { type: String, default: "" },
    facebook: { type: String, default: "" },
    instagram: { type: String, default: "" },
  },

  // Password Reset
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },

  cart: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 },
    productData: { type: mongoose.Schema.Types.Mixed } // Store product snapshot
  }],

  isActive: { type: String, default: true },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
