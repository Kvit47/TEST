const express = require("express");
const router = express.Router();
const {
  getCartHandler,
  updateCartHandler,
  clearCartHandler,
  addItemHandler,
} = require("../controllers/card.controller");

router.route("/").get(getCartHandler).put(updateCartHandler).delete(clearCartHandler);
router.post("/item", addItemHandler);

module.exports = router;
