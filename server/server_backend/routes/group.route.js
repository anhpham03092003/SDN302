const express = require("express");
const groupRouter = express.Router();
const bodyParser = require("body-parser");
const db = require("../models/index");
const { GroupController } = require("../controllers");
const { AuthMiddleware, GroupMiddleware } = require("../middlewares");

groupRouter.use(bodyParser.json());
// Groups premium
groupRouter.post("/updatePremium",
    AuthMiddleware.verifyAccessToken,
    GroupController.updatePremium
)
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
    AuthMiddleware.verifyAccessToken,
    GroupController.getGroupDetail
)

groupRouter.put("/:groupId/edit",
    [AuthMiddleware.verifyAccessToken,GroupMiddleware.isInGroup],
    GroupController.editGroupDetail
)

groupRouter.delete("/:groupId/delete",
    [AuthMiddleware.verifyAccessToken,GroupMiddleware.isInGroup,GroupMiddleware.isOwner],
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

//CRUD Column
groupRouter.post("/:groupId/create-column",
    [AuthMiddleware.verifyAccessToken,GroupMiddleware.isInGroup,GroupMiddleware.isNotViewer],
    GroupController.createColumn
)

groupRouter.put("/:groupId/edit-column",
    [AuthMiddleware.verifyAccessToken,GroupMiddleware.isInGroup,GroupMiddleware.isNotViewer],
    GroupController.editColumn
)

groupRouter.delete("/:groupId/delete-column",
    [AuthMiddleware.verifyAccessToken,GroupMiddleware.isInGroup,GroupMiddleware.isNotViewer],
    GroupController.deleteColumn
)



// Tasks
groupRouter.get(
    "/:groupId/tasks/get-all",
    [AuthMiddleware.verifyAccessToken,GroupMiddleware.isInGroup],
    GroupController.getAllTask
)

groupRouter.post(
    "/:groupId/tasks/create",
    [AuthMiddleware.verifyAccessToken,GroupMiddleware.isInGroup,GroupMiddleware.isNotViewer],
    GroupController.createTask
)
groupRouter.put(
    "/:groupId/tasks/:taskId/edit",
    [AuthMiddleware.verifyAccessToken,GroupMiddleware.isInGroup,GroupMiddleware.isNotViewer],
    GroupController.editTask
)
groupRouter.delete(
    "/:groupId/tasks/:taskId/delete",
    [AuthMiddleware.verifyAccessToken,GroupMiddleware.isInGroup,GroupMiddleware.isNotViewer],
    GroupController.deleteTask
)

//Subtask
groupRouter.get(
    "/:groupId/tasks/:taskId/subTasks/get-all",
    [AuthMiddleware.verifyAccessToken,GroupMiddleware.isInGroup],
    GroupController.getAllSubTask
)
groupRouter.post(
    "/:groupId/tasks/:taskId/subTasks/create",
    [AuthMiddleware.verifyAccessToken,GroupMiddleware.isInGroup,GroupMiddleware.isNotViewer],
    GroupController.addSubTask
)
groupRouter.put(
    "/:groupId/tasks/:taskId/subTasks/:subTaskId/edit",
    [AuthMiddleware.verifyAccessToken,GroupMiddleware.isInGroup,GroupMiddleware.isNotViewer],
    GroupController.editSubTask
)

groupRouter.delete(
    "/:groupId/tasks/:taskId/subTasks/:subTaskId/delete",
    [AuthMiddleware.verifyAccessToken,GroupMiddleware.isInGroup,GroupMiddleware.isNotViewer],
    GroupController.deleteSubTask
)

// Comment
groupRouter.get(
    "/:groupId/tasks/:taskId/comments/get-all",
    [AuthMiddleware.verifyAccessToken,GroupMiddleware.isInGroup],
    GroupController.getAllComments
)
groupRouter.post(
    "/:groupId/tasks/:taskId/comments/create",
    [AuthMiddleware.verifyAccessToken,GroupMiddleware.isInGroup,GroupMiddleware.isNotViewer],
    GroupController.addComment
)
groupRouter.put(
    "/:groupId/tasks/:taskId/comments/:commentId/edit",
    [AuthMiddleware.verifyAccessToken,GroupMiddleware.isInGroup,GroupMiddleware.isNotViewer],
    GroupController.editComment
)

groupRouter.delete(
    "/:groupId/tasks/:taskId/comments/:commentId/delete",
    [AuthMiddleware.verifyAccessToken,GroupMiddleware.isInGroup,GroupMiddleware.isNotViewer],
    GroupController.deleteComment
)


groupRouter.get(
    "/count",
    GroupController.countGroups
)

groupRouter.get(
    "/count-premium",
    GroupController.countPremiumGroups
)


module.exports = groupRouter