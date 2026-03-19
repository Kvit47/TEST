const userModel = require("../model/user.model");
const bcrypt = require("bcrypt");

const getUserHandler = async (req, res) => {
  try {
    console.log("Getting user profile for:", req.user);

    const user = await userModel.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ data: user });
  } catch (error) {
    console.error("Can't find user", error);
    res.status(500).json({ message: "Server error" });
  }
};

const patchUserHandler = async (req, res) => {
  try {
    const { bio, avatarUrl, sosialLinks, username, phone, address } = req.body;

    // Build update object dynamically to only update provided fields
    const updateData = {
      updatedAt: Date.now(),
    };

    if (bio !== undefined) updateData.bio = bio;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (sosialLinks !== undefined) updateData.sosialLinks = sosialLinks;
    
    // Handle username separately to check uniqueness
    if (username !== undefined && username !== "") {
      const existingUser = await userModel.findOne({ 
        username, 
        _id: { $ne: req.user.userId } 
      });
      
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }
      updateData.username = username;
    }

    const user = await userModel
      .findByIdAndUpdate(
        req.user.userId,
        updateData,
        { new: true, runValidators: true }
      )
      .select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ data: user });
  } catch (error) {
    console.error("Can't update user", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Username or email already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

const deleteUserHandler = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.user.userId);
    res.json({ message: "User deleted" });
  } catch (error) {
    console.error("Can't delete user", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUsersHandler = async (req, res) => {
  try {
    const users = await userModel.find({}).select("-password");
    res.json({ data: users });
  } catch (error) {
    console.error("Can't get users", error);
    res.status(500).json({ message: "Server error" });
  }
};

const changeUserRoleHandler = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!["admin", "client"].includes(role)) {
      return res
        .status(400)
        .json({ message: "Invalid role. Only admin and client are allowed" });
    }

    const existingUser = await userModel.findById(userId).select("-password");
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (existingUser.role === "super_admin") {
      return res
        .status(400)
        .json({ message: "Super admin cannot be changed to admin or client" });
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(userId, { role, updatedAt: Date.now() }, { new: true })
      .select("-password");

    res.json({
      message: `User ${existingUser.username} role changed to ${role}`,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Can't change user role", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateCartHandler = async (req, res) => {
  try {
    const { cart } = req.body;

    if (!Array.isArray(cart)) {
      return res.status(400).json({ message: "Cart must be an array" });
    }

    const user = await userModel
      .findByIdAndUpdate(
        req.user.userId,
        { cart, updatedAt: Date.now() },
        { new: true }
      )
      .select("-password");

    res.json({ data: user.cart });
  } catch (error) {
    console.error("Can't update cart", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getCartHandler = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.userId).select("cart");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ data: user.cart || [] });
  } catch (error) {
    console.error("Can't get cart", error);
    res.status(500).json({ message: "Server error" });
  }
};

const clearCartHandler = async (req, res) => {
  try {
    const user = await userModel
      .findByIdAndUpdate(
        req.user.userId,
        { cart: [], updatedAt: Date.now() },
        { new: true }
      )
      .select("cart");

    res.json({ data: user.cart });
  } catch (error) {
    console.error("Can't clear cart", error);
    res.status(500).json({ message: "Server error" });
  }
};

const changePasswordHandler = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: "Current password and new password are required" 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: "New password must be at least 6 characters" 
      });
    }

    // Find user with password field
    const user = await userModel.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has password (OAuth users might not have password)
    if (!user.password) {
      return res.status(400).json({ 
        message: "Cannot change password for OAuth accounts" 
      });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await userModel.findByIdAndUpdate(
      req.user.userId,
      { password: hashedPassword, updatedAt: Date.now() },
      { new: true }
    );

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Can't change password", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUserHandler,
  patchUserHandler,
  deleteUserHandler,
  getUsersHandler,
  changeUserRoleHandler,
  updateCartHandler,
  getCartHandler,
  clearCartHandler,
  changePasswordHandler,
};
