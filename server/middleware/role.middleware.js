const userModel = require("../model/user.model");

const requireRole = (roles) => {
  return async (req, res, next) => {
    try {
      const user = await userModel.findById(req.user.userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      req.user.role = user.role;
      next();
    } catch (error) {
      console.error("Error in requireRole middleware:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
};

const requireAdmin = requireRole(["admin", "super_admin"]);
const requireSuperAdmin = requireRole(["super_admin"]);
const requireClient = requireRole(["client", "user", "admin"]);

module.exports = {
  requireRole,
  requireAdmin,
  requireSuperAdmin,
  requireClient,
};
