const express = require("express");
const router = express.Router();

const {
  getUserHandler,
  patchUserHandler,
  deleteUserHandler,
  getUsersHandler,
  changeUserRoleHandler,
  changePasswordHandler,
} = require("../controllers/user.controller");

const upload = require("../config/multer");
const {
  requireAdmin,
  requireSuperAdmin,
} = require("../middleware/role.middleware");

router
  .route("/me")
  .get(getUserHandler)
  .patch(upload.single("avatar"), patchUserHandler)
  .delete(deleteUserHandler);

router.route("/all").get(requireAdmin, getUsersHandler);
router.route("/role").patch(requireSuperAdmin, changeUserRoleHandler);

// Password change route
router.route("/change-password").post(changePasswordHandler);

module.exports = router;
