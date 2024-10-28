const express = require("express");
const userRouter = express.Router();
const bodyParser = require("body-parser");

const db = require("../models/index");
const { AuthMiddleware } = require("../middlewares");
userRouter.use(bodyParser.json());

const { getProfile,
    updateProfile,
    changePassword,
    getTask,
    addTask,
    updateTask,
    deleteTask,
    getSubTask,
    addSubTask,
    updateSubTask,
    deleteSubTask } = require("../controllers/user.controller");


userRouter.get("/get-profile",AuthMiddleware.verifyAccessToken, getProfile);

userRouter.put("/update-profile",AuthMiddleware.verifyAccessToken, updateProfile);

userRouter.put("/change-password",AuthMiddleware.verifyAccessToken, changePassword);

userRouter.get("/individual-task/:id/task/:taskId/get",AuthMiddleware.verifyAccessToken, getTask);

userRouter.post("/individual-task/:id/add",AuthMiddleware.verifyAccessToken, addTask);

userRouter.put("/individual-task/:id/task/:taskId/edit",AuthMiddleware.verifyAccessToken, updateTask);

userRouter.delete("/individual-task/:id/task/:taskId/delete",AuthMiddleware.verifyAccessToken, deleteTask);

userRouter.get("/individual-task/:id/task/:taskId/sub-task/:subTaskId/get",AuthMiddleware.verifyAccessToken, getSubTask);

userRouter.post("/individual-task/:id/task/:taskId/sub-task/add",AuthMiddleware.verifyAccessToken, addSubTask);

userRouter.put("/individual-task/:id/task/:taskId/sub-task/:subTaskId/edit",AuthMiddleware.verifyAccessToken, updateSubTask);

userRouter.delete("/individual-task/:id/task/:taskId/sub-task/:subTaskId/delete",AuthMiddleware.verifyAccessToken, deleteSubTask);



userRouter.post("/add", async (req, res, next) => {
    try {
        const newUser = new db.Users(req.body);
        await newUser.save().then((data) => {
            res.status(200).json(data);
        });

    } catch (error) {
        next(error);
    }
})

module.exports = userRouter
