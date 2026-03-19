const userModel = require("../model/user.model");

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

/**
 * Add a single item to the cart (or increment quantity if already present).
 * Body: { product, productType, quantity?, productData? }
 */
const addItemHandler = async (req, res) => {
  try {
    const { product, quantity = 1, productData } = req.body;

    if (!product) {
      return res.status(400).json({ message: "Product is required" });
    }

    const user = await userModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cart = Array.isArray(user.cart) ? [...user.cart] : [];
    const existingIndex = cart.findIndex(
      (item) => item.product && item.product.toString() === product
    );

    if (existingIndex >= 0) {
      cart[existingIndex].quantity =
        (cart[existingIndex].quantity || 1) + (quantity >= 1 ? quantity : 1);
      if (productData) cart[existingIndex].productData = productData;
    } else {
      cart.push({
        product,
        quantity: quantity >= 1 ? quantity : 1,
        productData: productData || null,
      });
    }

    const updated = await userModel
      .findByIdAndUpdate(
        req.user.userId,
        { cart, updatedAt: Date.now() },
        { new: true }
      )
      .select("cart");

    res.json({ data: updated.cart });
  } catch (error) {
    console.error("Can't add item to cart", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getCartHandler,
  updateCartHandler,
  clearCartHandler,
  addItemHandler,
};
