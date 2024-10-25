const express = require("express");
const groupRouter = express.Router();
const bodyParser = require("body-parser");
const db = require("../models/index");
const { GroupController } = require("../controllers");

groupRouter.use(bodyParser.json());

groupRouter.get("/:groupId/tasks/get-all",GroupController.getAllTask)
groupRouter.post("/:groupId/tasks/create",GroupController.createTask)
groupRouter.put("/:groupId/tasks/:taskId/edit",GroupController.editTask)
groupRouter.delete("/:groupId/tasks/:taskId/delete",GroupController.editTask)

//Subtask
groupRouter.post("/:groupId/tasks/:taskId/subTasks/create",GroupController.addSubTask)


module.exports = groupRouter