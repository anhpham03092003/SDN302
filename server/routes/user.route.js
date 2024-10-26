const express = require("express");
const userRouter = express.Router();
const bodyParser = require("body-parser");

const db = require("../models/index");

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

userRouter.get("/get-profile/:id", getProfile);

userRouter.put("/update-profile/:id", updateProfile);

userRouter.put("/change-password/:id", changePassword);

userRouter.get("/individual-task/:id/task/:taskId/get", getTask);

userRouter.post("/individual-task/:id/add", addTask);

userRouter.put("/individual-task/:id/task/:taskId/edit", updateTask);

userRouter.delete("/individual-task/:id/task/:taskId/delete", deleteTask);

userRouter.get("/individual-task/:id/task/:taskId/sub-task/:subTaskId/get", getSubTask);

userRouter.post("/individual-task/:id/task/:taskId/sub-task/add", addSubTask);

userRouter.put("/individual-task/:id/task/:taskId/sub-task/:subTaskId/edit", updateSubTask);

userRouter.delete("/individual-task/:id/task/:taskId/sub-task/:subTaskId/delete", deleteSubTask);


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