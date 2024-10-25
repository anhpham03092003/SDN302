const express = require("express");
const groupRouter = express.Router();
const bodyParser = require("body-parser");
const db = require("../models/index");
const { GroupController } = require("../controllers");
const { AuthMiddleware } = require("../middlewares");

groupRouter.use(bodyParser.json());

groupRouter.get(
    "/:groupId/tasks/get-all",
    AuthMiddleware.verifyAccessToken,
    GroupController.getAllTask
)

groupRouter.post(
    "/:groupId/tasks/create",
    AuthMiddleware.verifyAccessToken,
    GroupController.createTask
)
groupRouter.put(
    "/:groupId/tasks/:taskId/edit",
    AuthMiddleware.verifyAccessToken,
    GroupController.editTask
)
groupRouter.delete(
    "/:groupId/tasks/:taskId/delete",
    AuthMiddleware.verifyAccessToken,
    GroupController.deleteTask
)

//Subtask
groupRouter.get(
    "/:groupId/tasks/:taskId/subTasks/get-all",
    AuthMiddleware.verifyAccessToken,
    GroupController.getAllSubTask
)
groupRouter.post(
    "/:groupId/tasks/:taskId/subTasks/create",
    AuthMiddleware.verifyAccessToken,
    GroupController.addSubTask
)
groupRouter.put(
    "/:groupId/tasks/:taskId/subTasks/:subTaskId/edit",
    AuthMiddleware.verifyAccessToken,
    GroupController.editSubTask
)


module.exports = groupRouter