const express = require("express");

const router = express.Router();

const authRouter = require("./auth.route");
const userRouter = require("./user.route");
const cardRouter = require("./card.route");
// const accessoryRouter = require("./accessory.route");
// const bagRouter = require("./bag.route");
const orderRouter = require("./order.route");
const authMiddleware = require("../middleware/auth.middleware");
const productsRouter = require("./products.route");
const categoryRouter = require("./category.route");
const subcategoryRouter = require("./subcategory.route");
const paymentRouter = require("./payment.route");
const { callbackPayment } = require("../controllers/payment.controller");

router.use("/api/auth", authRouter);
router.use("/api/users", authMiddleware, userRouter);
// Callback is public — called by OderoPay servers, not the client
router.post("/api/pay/callback", callbackPayment);
router.use("/api/pay", authMiddleware, paymentRouter);
router.use("/api/cart", authMiddleware, cardRouter);
router.use("/orders", authMiddleware, orderRouter);
router.use("/api/products", productsRouter);
router.use("/api/categories", categoryRouter);
router.use("/api/subcategories", subcategoryRouter);

module.exports = router;