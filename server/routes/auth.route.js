const express = require("express");
const { 
  postRegisterHandler, 
  postLoginHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  verifyResetTokenHandler,
} = require("../controllers/auth.controller");
const passport = require("passport");

const router = express.Router();

router.route("/register").post(postRegisterHandler);
router.route("/login").post(postLoginHandler);

// Password reset routes
router.route("/forgot-password").post(forgotPasswordHandler);
router.route("/reset-password").post(resetPasswordHandler);
router.route("/verify-reset-token/:token").get(verifyResetTokenHandler);

// 1) Запрос на вход
router.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));

// 2) Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { 
    failureRedirect: `${process.env.CLIENT_URL}/auth/login`,
    session: false 
  }),
  (req, res) => {
    const token = req.user.token;
    // Redirect to a special auth callback page that will handle the token
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  }
);

module.exports = router