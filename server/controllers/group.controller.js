const db = require('../models');
const bcrypt = require("bcrypt")
const createHttpErrors = require("http-errors");

async function getAllTask(req, res, next) {
    try {
        const { groupId } = req.params;
        const group = await db.Groups.findOne({ _id: groupId });
        if (!group) {
            throw createHttpErrors(404, "Group not found")
        }
        const { tasks } = group;
        res.status(200).json(tasks)

    } catch (error) {
        next(error)
        // new khong co next : throw httpError.400 
    }
}

async function createTask(req, res, next) {
    try {
        const { id } = req.payload;
        const { groupId } = req.params;
        const group = await db.Groups.findOne({ _id: groupId });
        // const role = group.memberRole(id);
        // console.log(role);
        if (!group) {
            throw createHttpErrors(404, "Group not found")
        }
        const newTask = {
            taskName: req.body.taskName,
            description: req.body.description,
            reviewer: id,
            deadline: req.body.deadline,
            status: req.body.status,
        }
        await db.Groups.updateOne({ _id: groupId }, { $addToSet: { tasks: newTask } }, { runValidators: true })
        res.status(201).json("Create task successfully")
    } catch (error) {
        next(error)
        // new khong co next : throw httpError.400 
    }
}

async function editTask(req, res, next) {
    try {
        const { groupId, taskId } = req.params;
        const group = await db.Groups.findOne({ _id: groupId });
        if (!group) {
            throw createHttpErrors(404, "Group not found")
        }
        const task = group.tasks.find(t => t._id == taskId)
        if (!task) {
            throw createHttpErrors(404, "Task not found")
        }
        const updateTask = {
            taskName: req.body.taskName,
            description: req.body.description,
            assignee: req.body.assignee,
            reviewer: req.body.reviewer,
            deadline: req.body.deadline,
            status: req.body.status,
            updatedAt: new Date()
        }
        console.log(updateTask);
        await db.Groups.updateOne(
            {
                _id: groupId, "tasks._id": taskId
            },
            {
                $set: {
                    "tasks.$.taskName": updateTask.taskName,
                    "tasks.$.description": updateTask.description,
                    "tasks.$.assignee": updateTask.assignee,
                    "tasks.$.reviewer": updateTask.reviewer,
                    "tasks.$.deadline": updateTask.deadline,
                    "tasks.$.status": updateTask.status,
                    "tasks.$.updatedAt": updateTask.updatedAt
                }
            },
            {
                runValidators: true,
                isNew: false
            })
        res.status(200).json(updateTask)
    } catch (error) {
        next(error)

    }
}

async function deleteTask(req, res, next) {
    try {
        const { groupId, taskId } = req.params;
        const group = await db.Groups.findOne({ _id: groupId });
        if (!group) {
            throw createHttpErrors(404, "Group not found")
        }
        const task = group.tasks.find(t => t._id == taskId)
        if (!task) {
            throw createHttpErrors(404, "Task not found")
        }

        await db.Groups.updateOne(
            {
                _id: groupId
            }
            , {
                $pull: { tasks: { _id: taskId } }
            }
        )

        res.status(200).json("Delete task successfully")
    } catch (error) {
        next(error)
        // new khong co next : throw httpError.400 
    }
}

async function addSubTask(req, res, next) {
    try {
        const { groupId, taskId } = req.params;
        const group = await db.Groups.findOne({ _id: groupId });
        if (!group) {
            throw createHttpErrors(404, "Group not found")
        }
        const task = group.tasks.find(t => t._id == taskId)
        if (!task) {
            throw createHttpErrors(404, "Task not found")
        }
        const newSubTask = {
            subTaskName: req.body.subTaskName
        }
        await db.Groups.updateOne(
            {
                _id: groupId, "tasks._id": taskId

            },
            {
                $push: { "tasks.$.subTasks": newSubTask }
            },
            {
                runValidators: true
            }
        )
            .then(rs => res.status(201).json("Create subtask successfully"))
    } catch (error) {
        next(error)
        // new khong co next : throw httpError.400 
    }
}
async function getAllSubTask(req, res, next) {
    try {
        const { groupId, taskId } = req.params;
        const group = await db.Groups.findOne({ _id: groupId });
        if (!group) {
            throw createHttpErrors(404, "Group not found")
        }
        const task = group.tasks.find(t => t._id == taskId)
        if (!task) {
            throw createHttpErrors(404, "Task not found")
        }

        const { subTasks } = task;
        res.status(200).json(subTasks)

    } catch (error) {
        next(error)
        // new khong co next : throw httpError.400 
    }
}

async function editSubTask(req, res, next) {
    try {
        const { groupId, taskId, subTaskId } = req.params;
        const group = await db.Groups.findOne({ _id: groupId });
        if (!group) {
            throw createHttpErrors(404, "Group not found")
        }
        const task = group.tasks.find(t => t._id == taskId)
        if (!task) {
            throw createHttpErrors(404, "Task not found")
        }
        const subTask = task.subTasks.find(st => st._id == subTaskId)
        if (!subTask) {
            throw createHttpErrors(404, "Subtask not found")
        }
        const updateSubTask = {
            subTaskName: req.body.subTaskName ? req.body.subTaskName : subTask.subTaskName,
            assignee: req.body.assignee ? req.body.assignee : subTask.assignee,
            priority: req.body.priority ? req.body.priority : subTask.priority,
            status: req.body.status ? req.body.status : subTask.status,
            updatedAt: new Date()
        }

        await db.Groups.updateOne(
            {
                _id: groupId,
                "tasks._id": taskId,
                "tasks.subTasks._id": subTaskId
            },
            {
                $set: {
                    "tasks.$.subTasks.$[subtask].subTaskName": updateSubTask.subTaskName,
                    "tasks.$.subTasks.$[subtask].assignee": updateSubTask.assignee,
                    "tasks.$.subTasks.$[subtask].priority": updateSubTask.priority,
                    "tasks.$.subTasks.$[subtask].status": updateSubTask.status,
                    "tasks.$.subTasks.$[subtask].updatedAt": updateSubTask.updatedAt
                }
            },
            {
                arrayFilters: [{ "subtask._id": subTaskId }],
                runValidators: true
            })
            .then((rs) => res.status(200).json("Edit subtask successfully"));
    } catch (error) {
        next(error)
        // new khong co next : throw httpError.400 
    }
}

async function deleteSubTask(req, res, next) {
    try {
        const { groupId, taskId, subTaskId } = req.params;
        const group = await db.Groups.findOne({ _id: groupId });
        if (!group) {
            throw createHttpErrors(404, "Group not found")
        }
        const task = group.tasks.find(t => t._id == taskId)
        if (!task) {
            throw createHttpErrors(404, "Task not found")
        }
        const subTask = task.subTasks.find(st => st._id == subTaskId)
        if (!subTask) {
            throw createHttpErrors(404, "Subtask not found")
        }

        await db.Groups.updateOne(
            {
                _id: groupId, "tasks._id": taskId
            }
            , {
                $pull: { "tasks.$.subTasks": { _id: subTaskId } }
            }
        )

        res.status(200).json("Delete subtask successfully")
    } catch (error) {
        next(error)
        // new khong co next : throw httpError.400 
    }
}
const GroupController = {
    getAllTask,
    createTask,
    editTask,
    deleteTask,
    addSubTask,
    getAllSubTask,
    editSubTask,
    deleteSubTask
}

module.exports = GroupController;