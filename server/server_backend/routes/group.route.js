const express = require("express");
const groupRouter = express.Router();
const bodyParser = require("body-parser");
const db = require("../models/index");
const { GroupController } = require("../controllers");
const { AuthMiddleware } = require("../middlewares");

groupRouter.use(bodyParser.json());

// Groups
groupRouter.post("/create",
    AuthMiddleware.verifyAccessToken,
    GroupController.createGroup
)

groupRouter.get("/get-group",
    AuthMiddleware.verifyAccessToken,
    GroupController.getAllGroup
)

groupRouter.get("/:groupId/get-group",
    GroupController.getGroupDetail
)

groupRouter.put("/:groupId/edit",
    AuthMiddleware.verifyAccessToken,
    GroupController.editGroupDetail
)

groupRouter.delete("/:groupId/delete",
    AuthMiddleware.verifyAccessToken,
    GroupController.deleteGroup
)

// join group by code
groupRouter.post("/join-by-code",
    AuthMiddleware.verifyAccessToken,
    GroupController.joinGroupByCode
)

// out group
groupRouter.delete("/:groupId/out",
    AuthMiddleware.verifyAccessToken,
    GroupController.outGroup
)

// get member of group
groupRouter.get("/:groupId/get-member",
    AuthMiddleware.verifyAccessToken,
    GroupController.getGroupMember  
)

// set group member role
groupRouter.put("/:groupId/member/:memberId/set-role",
    AuthMiddleware.verifyAccessToken,
    GroupController.setGroupMemberRole
)

// delete group member for owner
groupRouter.delete("/:groupId/member/:memberId/delete",
    AuthMiddleware.verifyAccessToken,
    GroupController.deleteGroupMember
)

// get user id
groupRouter.get("/user/:groupId/get-user-role",
    AuthMiddleware.verifyAccessToken,
    GroupController.getUserRole
)

// Tasks
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

groupRouter.delete(
    "/:groupId/tasks/:taskId/subTasks/:subTaskId/delete",
    AuthMiddleware.verifyAccessToken,
    GroupController.deleteSubTask
)


module.exports = groupRouter