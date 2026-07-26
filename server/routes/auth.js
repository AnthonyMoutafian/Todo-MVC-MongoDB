const express = require("express");
const { AuthController } = require("../controllers/authController");
const upload = require("../middleware/upload");
const authRouter = express.Router();

const authController = new AuthController();

authRouter.put("/avatar", upload.single("avatar"), authController.uploadAvatar);
authRouter.delete("/avatar", authController.deleteAvatar);
authRouter.post("/register", authController.registerUser);
authRouter.post("/login", authController.loginUser);
authRouter.post("/logout", authController.logoutUser);

module.exports = authRouter;
