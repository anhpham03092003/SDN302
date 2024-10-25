const express = require("express");
const authRouter = express.Router();
const authenticationController = require("../controllers/authentication.controller");

// đăng nhập
authRouter.post("/login", authenticationController.login);

// đdăng ký
authRouter.post("/register", authenticationController.register);

// quên mật khẩu
authRouter.post("/forgot-password", authenticationController.forgotPassword);

// đổi mật khẩu
authRouter.post("/reset-password/:id/:token", authenticationController.resetPassword);

module.exports = authRouter;
