const db = require('../models');
const bcrypt = require("bcrypt")
const createHttpErrors = require("http-errors");




// Create new group

async  function createGroup(req, res, next) {
    try {
        const { groupName, groupCode} = req.body;
        const {id} = req.payload;
        const existingGroup = await db.Groups.findOne({groupName,groupCode});
        if (existingGroup) {
            throw createHttpErrors(400, "Group already exists")
        }
        const defaultClassifications = ['todo','inprogress','done'];
        const members = [
            {
                _id: id, 
                groupRole: 'owner' 
            }
        ];
        const newGroup = new db.Groups({ 
            groupName,
            groupCode,
            classifications:  defaultClassifications,
            members,
        })
        await newGroup.save();
        res.status(201).json({message:"Group created successfully", group:  newGroup});
    } catch(error) {
        next(error);
    }
}


// Get all groups by user id
 
async function getAllGroup(req, res, next) {
    try {
        const {id} = req.payload;
        const groups = await db.Groups.find({ members: { $elemMatch: { _id: id } } });
        if (!groups) {
            throw createHttpErrors(404, "Group not found")
        }
        const newGroups = groups.map(group => {
            return {
            _id: group._id,
            groupName : group.groupName,
         
            }
        })
    
        res.status(200).json(newGroups)

    } catch (error) {
        next(error)
    }
}

// get group detail by group id

async function getGroupDetail(req, res, next) {
    try{
        const { groupId } = req.params;
        const group = await db.Groups.findOne({ _id: groupId });
        if (!group) {
            throw createHttpErrors(404, "Group not found")
        }
        res.status(200).json(group)

    }catch(error){
        next(error)
    }

    }

// edit group detail by group id

async function editGroupDetail(req, res, next) {
    try {
        const { groupId } = req.params;
        const { id } = req.payload;
        const { groupName, groupCode, classifications, groupRole } = req.body;

        const group = await db.Groups.findOne({ _id: groupId });
        if (!group) {
            throw createHttpErrors(404, "Group not found");
        }

        const member = group.members.find(member => member._id.toString() === id);
        if (!member) {
            throw createHttpErrors(403, "You don't have permission to edit this group");
        }

        const updateGroup = {};

        // Nếu thành viên là 'owner', cho phép chỉnh sửa tất cả các thuộc tính
        if (member.groupRole === 'owner') {
            if (groupName) updateGroup.groupName = groupName;
            
            if (groupCode) {
                // Check if the groupCode already exists (excluding the current group)
                const existingGroupByCode = await db.Groups.findOne({ 
                    groupCode, 
                    _id: { $ne: groupId } 
                });
                if (existingGroupByCode) {
                    throw createHttpErrors(409, "Group code already exists");
                }
                updateGroup.groupCode = groupCode;
            }
            if (classifications) updateGroup.classifications = classifications;


    }
        // Nếu thành viên là 'member', chỉ cho phép chỉnh sửa classifications
        else if (member.groupRole === 'member') {
            if (groupName && groupCode) {
                throw createHttpErrors(403, "Only the group owner can edit both the group name and group code");
            } else if (groupName) {
                throw createHttpErrors(403, "Only the group owner can edit the group name");
            } else if (groupCode) {
                throw createHttpErrors(403, "Only the group owner can edit the group code");
            }
            if (classifications) updateGroup.classifications = classifications;
        }

        await db.Groups.updateOne({ _id: groupId }, { $set: updateGroup }, { runValidators: true });

        res.status(200).json("Update group successfully");
    } catch (error) {
        next(error);
    }
}


// delete group by group id

async function deleteGroup(req, res, next) {
    try {
        const { groupId } = req.params; 
        const { id } = req.payload; 
        const group = await db.Groups.findOne({ _id: groupId });

        if (!group) {
            throw createHttpErrors(404, "Group not found");
        }
        const isOwner = group.members.some(member => member._id.toString() === id && member.groupRole === 'owner');
        if (!isOwner) {
            throw createHttpErrors(403, "Only the group owner can delete this group");
        }
        await db.Groups.deleteOne({ _id: groupId });
        res.status(200).json({ message: "Group deleted successfully" });
    } catch (error) {
        next(error);
    }
}

// join group by code
async function joinGroupByCode(req, res, next) {
    try {
        const { groupCode } = req.body;
        const { id } = req.payload;
        const group = await db.Groups.findOne({ groupCode });
        if (!group) {
            throw createHttpErrors(404, "Group not found");
        }
        const isMember = group.members.some(member => member._id.toString() === id);
        if (isMember) {
            throw createHttpErrors(400, "You are already a member of this group");
        }
        group.members.push({
            _id: id,
            groupRole: 'member'
        });

        await group.save();
        const user = await db.Users.findById(id);
        if (!user) {
            throw createHttpErrors(404, "User not found");
        }
        user.groups.push(group._id);
        await user.save();

        res.status(200).json({ message: "Joined the group successfully", group });

    } catch (error) {
        next(error);
    }
}

// out group for member
async function outGroup(req, res, next) {
    try {
        const { groupId } = req.params;
        const { id } = req.payload; 
        const group = await db.Groups.findOne({ _id: groupId });
        if (!group) {
            throw createHttpErrors(404, "Group not found");
        }

        const member = group.members.find(member => member._id.toString() === id);
        if (!member) {
            throw createHttpErrors(403, "You are not a member of this group");
        }

        // Nếu thành viên là owner, không cho phép rời nhóm
        if (member.groupRole === 'owner') {
            throw createHttpErrors(403, "The group owner cannot leave the group");
        }
        // Xóa thành viên khỏi danh sách
        group.members = group.members.filter(member => member._id.toString() !== id);
        await group.save();
        res.status(200).json("You have successfully left the group");
    } catch (error) {
        next(error);
    }
}


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
        const {id} = req.payload;
        const { groupId } = req.params;
        const group = await db.Groups.findOne({ _id: groupId });
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

const GroupController = {
    getAllTask,
    createTask,
    editTask,
    deleteTask,
    addSubTask,
    getAllSubTask,
    editSubTask,
    createGroup,
    getAllGroup,
    getGroupDetail,
    editGroupDetail,
    deleteGroup,
    joinGroupByCode,
    outGroup
}

module.exports = GroupController;