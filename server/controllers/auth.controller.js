const UserModel = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendPasswordResetEmail, sendPasswordChangedEmail } = require("../config/email");

const postRegisterHandler = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      username,
      password: hashedPassword,
      email,
    });
    await newUser.save();
    console.log(
      `User register ${username}, hashed password: ${hashedPassword}`
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

const postLoginHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

const initializeSuperAdmin = async () => {
  try {
    const existingSuperAdmin = await UserModel.findOne({ role: "super_admin" });
    if(!existingSuperAdmin){
      const superAdminData = {
        username: "super_admin",
        password: await bcrypt.hash("SuperAdmin123", 10),
        email: "super_admin@example.com",
        role: "super_admin",
        bio: "I am the super admin",
      }
      const superAdmin = new UserModel(superAdminData);
      await superAdmin.save();
      console.log("Super admin created successfully");
      process.exit(0);
    }
  } catch (error) {
    console.error("Error initializing super admin", error);
  }
}

// Forgot Password Handler
const forgotPasswordHandler = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find user by email
    const user = await UserModel.findOne({ email });

    // Always return success message (don't reveal if email exists)
    // This prevents email enumeration attacks
    if (!user) {
      return res.json({ 
        message: "If an account with that email exists, a password reset link has been sent." 
      });
    }

    // Check if user has a password (OAuth users don't)
    if (!user.password) {
      return res.status(400).json({ 
        message: "This account uses social login. Password reset is not available." 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    
    // Hash token before saving to database
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save hashed token and expiry time (1 hour from now)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email with unhashed token
    try {
      await sendPasswordResetEmail(user.email, resetToken);
      
      res.json({ 
        message: "If an account with that email exists, a password reset link has been sent." 
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      
      // Clear reset token if email fails
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();
      
      return res.status(500).json({ 
        message: "Error sending email. Please try again later." 
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Reset Password Handler
const resetPasswordHandler = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters" 
      });
    }

    // Hash the token from URL to compare with stored hashed token
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with valid reset token
    const user = await UserModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }, // Token not expired
    });

    if (!user) {
      return res.status(400).json({ 
        message: "Invalid or expired reset token" 
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    user.updatedAt = Date.now();
    await user.save();

    // Send confirmation email (don't wait for it)
    sendPasswordChangedEmail(user.email, user.username).catch(err => {
      console.error("Error sending confirmation email:", err);
    });

    res.json({ message: "Password reset successful. You can now log in with your new password." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Verify Reset Token Handler (optional - to check if token is valid before showing reset form)
const verifyResetTokenHandler = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    // Hash the token
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Check if token exists and is not expired
    const user = await UserModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ 
        valid: false,
        message: "Invalid or expired reset token" 
      });
    }

    res.json({ 
      valid: true,
      email: user.email,
      message: "Token is valid" 
    });
  } catch (error) {
    console.error("Verify token error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  postRegisterHandler,
  postLoginHandler,
  initializeSuperAdmin,
  forgotPasswordHandler,
  resetPasswordHandler,
  verifyResetTokenHandler,
};
