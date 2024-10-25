const express = require("express");
const groupRouter = express.Router();
const bodyParser = require("body-parser");
const db = require("../models/index");
const { GroupController } = require("../controllers");

groupRouter.use(bodyParser.json());

groupRouter.get("/:groupId/tasks/get-all",GroupController.getAllTask)
groupRouter.post("/:groupId/tasks/create",GroupController.createTask)
groupRouter.put("/:groupId/tasks/:taskId/edit",GroupController.editTask)
groupRouter.delete("/:groupId/tasks/:taskId/delete",GroupController.deleteTask)

//Subtask
groupRouter.get("/:groupId/tasks/:taskId/subTasks/get-all",GroupController.getAllSubTask)
groupRouter.post("/:groupId/tasks/:taskId/subTasks/create",GroupController.addSubTask)
groupRouter.put("/:groupId/tasks/:taskId/subTasks/:subTaskId/edit",GroupController.editSubTask)


module.exports = groupRouter