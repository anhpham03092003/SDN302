const express = require("express");
const userRouter = express.Router();
const bodyParser = require("body-parser");

const db = require("../models/index");
const { AuthMiddleware } = require("../middlewares");
userRouter.use(bodyParser.json());



const { getProfile, updateProfile, changePassword,
    getClassification, addClassification, editClassification,
    getTask, addTask, updateTask, deleteTask,
    getSubTask, addSubTask, updateSubTask, deleteSubTask, getAllUser, banUser,
    countUserStatus } = require("../controllers/user.controller");



userRouter.get("/get-profile", AuthMiddleware.verifyAccessToken, getProfile);

userRouter.put("/update-profile", AuthMiddleware.verifyAccessToken, updateProfile);

userRouter.put("/change-password", AuthMiddleware.verifyAccessToken, changePassword);

userRouter.get("/get-classification", AuthMiddleware.verifyAccessToken, getClassification);

userRouter.post("/add-classification", AuthMiddleware.verifyAccessToken, addClassification);

userRouter.put("/edit-classification", AuthMiddleware.verifyAccessToken, editClassification);

userRouter.get("/individual-task/task/:taskId/get", AuthMiddleware.verifyAccessToken, getTask);

userRouter.post("/individual-task/add", AuthMiddleware.verifyAccessToken, addTask);

userRouter.put("/individual-task/task/:taskId/edit", AuthMiddleware.verifyAccessToken, updateTask);

userRouter.delete("/individual-task/task/:taskId/delete", AuthMiddleware.verifyAccessToken, deleteTask);

userRouter.get("/individual-task/task/:taskId/sub-task/:subTaskId/get", AuthMiddleware.verifyAccessToken, getSubTask);

userRouter.post("/individual-task/task/:taskId/sub-task/add", AuthMiddleware.verifyAccessToken, addSubTask);

userRouter.put("/individual-task/task/:taskId/sub-task/:subTaskId/edit", AuthMiddleware.verifyAccessToken, updateSubTask);

userRouter.delete("/individual-task/task/:taskId/sub-task/:subTaskId/delete", AuthMiddleware.verifyAccessToken, deleteSubTask);

userRouter.get("/all-users", AuthMiddleware.verifyAccessToken, getAllUser);
userRouter.put("/ban-user", AuthMiddleware.verifyAccessToken, banUser);
// userRouter.get("/count-user-status", AuthMiddleware.verifyAccessToken, countUserStatus);



module.exports = userRouter
