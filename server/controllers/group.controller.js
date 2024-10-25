const db = require('../models');
const bcrypt = require("bcrypt")
const createHttpErrors = require("http-errors");




// Create new group

async  function createGroup(req, res, next) {
    try {
        const { groupName, groupCode} = req.body;

        const defaultClassifications = ['todo','inprogress','done'];
        

        const newGroup = new db.Groups({ 
            groupName,
            groupCode,
            classifications:  defaultClassifications,
            

        })

        await newGroup.save();
        res.status(201).json({message:"Group created successfully", group:  newGroup});

    } catch(error) {
        next(error);
    }
}


// Get all groups by user id






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
        const { groupId } = req.params;
        const group = await db.Groups.findOne({ _id: groupId });
        if (!group) {
            throw createHttpErrors(404, "Group not found")
        }
        const newTask = {
            taskName: req.body.taskName,
            description: req.body.description,
            reviewer: null,
            deadline: req.body.deadline,
            status: req.body.status,
        }
        await db.Groups.updateOne({_id:groupId},{$addToSet:{tasks:newTask}},{runValidators:true})
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
        if(!task){
            throw createHttpErrors(404, "Task not found")
        }
        const updateTask = {
            ...task,
            taskName: req.body.taskName ? req.body.taskName : task.name,
            description: req.body.description ? req.body.description : task.description,
            assignee: req.body.assignee ? req.body.assignee : task.assignee,
            reviewer: req.body.reviewer ? req.body.reviewer : task.reviewer,
            deadline: req.body.deadline ? req.body.deadline : task.deadline,
            status: req.body.status ? req.body.status : task.status,
            updatedAt: new Date()
        }

        await db.Groups.updateOne(
            {
                 _id: groupId, "tasks._id": taskId 
                },
            {
                 $set: { "tasks.$": updateTask } 
                },
            { 
                runValidators: true 
            })
            .then((rs) => res.status(200).json("Edit task successfully"));
    } catch (error) {
        next(error)
        // new khong co next : throw httpError.400 
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
        if(!task){
            throw createHttpErrors(404, "Task not found")
        }

        await db.Groups.updateOne(
            { 
                _id: groupId
            }
            ,{
                $pull: {tasks:{_id:taskId}}
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
        if(!task){
            throw createHttpErrors(404, "Task not found")
        }
        const newSubTask = {
            subTaskName: req.body.subTaskName
        }
        await db.Groups.updateOne(
            {
                _id:groupId,"tasks._id": taskId 
                
            },
            {
                $push:{"tasks.$.subTasks":newSubTask}
            },
            {
                runValidators:true
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
        const { groupId,taskId } = req.params;
        const group = await db.Groups.findOne({ _id: groupId });
        if (!group) {
            throw createHttpErrors(404, "Group not found")
        }
        const task = group.tasks.find(t => t._id == taskId)
        if(!task){
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
        const { groupId, taskId,subTaskId } = req.params;
        const group = await db.Groups.findOne({ _id: groupId });
        if (!group) {
            throw createHttpErrors(404, "Group not found")
        }
        const task = group.tasks.find(t => t._id == taskId)
        if(!task){
            throw createHttpErrors(404, "Task not found")
        }
        const subTask = task.subTasks.find(st => st._id == subTaskId)
        if(!subTask){
            throw createHttpErrors(404, "Subtask not found")
        }
        const updateSubTask = {
            ...subTask,
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
                 $set: {  "tasks.$.subTasks.$[subtask]": updateSubTask } 
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

const GroupController = {
    getAllTask,
    createTask,
    editTask,
    deleteTask,
    addSubTask,
    getAllSubTask,
    editSubTask,
    createGroup
}

module.exports = GroupController;