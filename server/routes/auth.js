const express = require("express");
const { AuthController } = require("../controllers/authController");
const upload = require("../middleware/upload");
const { checkAuth } = require("../middleware/checkAuth");

const authRouter = express.Router();

const authController = new AuthController();

authRouter.post("/register", authController.registerUser);
authRouter.post("/login", authController.loginUser);

authRouter.post("/logout", checkAuth, authController.logoutUser);

authRouter.put(
  "/avatar",
  checkAuth,
  upload.single("avatar"),
  authController.uploadAvatar
);

authRouter.delete(
  "/avatar",
  checkAuth,
  authController.deleteAvatar
);

module.exports = authRouter;