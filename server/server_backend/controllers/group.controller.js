const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");



const authenticationController = require("./authentication.controller");


// Create new group


function generateGroupCode(length = 6) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

async function createGroup(req, res, next) {
    try {
        const { groupName } = req.body;
        const { id } = req.payload;
        const groupCode = generateGroupCode();
        const existingGroup = await db.Groups.findOne({ groupName });
        if (existingGroup) {
            return res.status(400).json({ message: "Group name already exists, please choose another name." });
        }

        const defaultClassifications = ['todo', 'inprogress', 'done'];
        const members = [
            {
                _id: id,
                groupRole: 'owner'
            }
        ];
        const newGroup = new db.Groups({
            groupName,
            groupCode,
            classifications: defaultClassifications,
            members,
            imageGroup: 'https://blog.delivered.co.kr/wp-content/uploads/2024/04/NEWJEANS.jpg'
        });

        const nGroup = await newGroup.save();
        const nGroupId = nGroup._id;
        console.log(nGroupId);

        const updatedUser = await db.Users.findOneAndUpdate(
            { _id: id },
            { $push: { groups: nGroupId } },
            { new: true } 
        );
        
        if (!updatedUser) {
            throw createHttpErrors(400, "Failed to update user with group ID");
        }

        res.status(201).json({ message: "Group created successfully", group: newGroup });
    } catch (error) {
        next(error);
    }
}


// Get all groups by user id

async function getAllGroup(req, res, next) {
    try {
        const { id } = req.payload;
        const groups = await db.Groups.find({ members: { $elemMatch: { _id: id } } });
        if (!groups) {
            throw createHttpErrors(404, "Group not found")
        }
        // const newGroups = groups.map(group => {
        //     return {
        //     _id: group._id,
        //     groupName : group.groupName,

        //     }
        // })

        res.status(200).json(groups)

    } catch (error) {
        next(error)
    }
}

// get group detail by group id
async function getGroupDetail(req, res, next) {
    try {
        const { groupId } = req.params;
        const group = await db.Groups.findOne({ _id: groupId });
        if (!group) {
            throw createHttpErrors(404, "Group not found")
        }

        res.status(200).json(group)

    } catch (error) {
        next(error)
    }

}


// edit group detail by group id
async function editGroupDetail(req, res, next) {
    try {
        const { groupId } = req.params;
        const { id } = req.payload;
        const { groupName, groupCode, imageGroup, groupRole } = req.body;

        const group = await db.Groups.findOne({ _id: groupId });
        if (!group) {
            throw createHttpErrors(404, "Group not found");
        }

        const member = group.members.find(member => member._id.toString() === id);
        if (!member) {
            throw createHttpErrors(403, "You don't have permission to edit this group");
        }

        const updateGroup = {};

        // If the member is 'owner', allow editing of all attributes including imageGroup
        if (member.groupRole === 'owner') {
            if (groupName) updateGroup.groupName = groupName;

            if (groupCode) {
                // Check if the groupCode already exists (excluding the current group)
                const existingGroupByCode = await db.Groups.findOne({
                    groupCode,
                    _id: { $ne: groupId }
                });
                if (existingGroupByCode) {
                    res.status(409).json({ error: "Group code already exists" });
                    return;
                }
                updateGroup.groupCode = groupCode;
            }

            // Allow updating the imageGroup
            if (imageGroup) {
                updateGroup.imageGroup = imageGroup;
            }
        } 
        // If the member is 'member', restrict editing to only groupRole validation
        else if (member.groupRole === 'member') {
            if (groupName || groupCode || imageGroup) {
                throw createHttpErrors(403, "Only the group owner can edit the group name, group code, and image");
            }
        }

        await db.Groups.updateOne({ _id: groupId }, { $set: updateGroup }, { runValidators: true });
        const saveGroup = await db.Groups.findOne({ _id: groupId });

        res.status(200).json(saveGroup);

    } catch (error) {
        next(error);
    }
}



// delete group by group id

// async function deleteGroup(req, res, next) {
//     try {
//         const { groupId } = req.params;
//         const { id } = req.payload;
//         const group = await db.Groups.findOne({ _id: groupId });

//         if (!group) {
//             throw createHttpErrors(404, "Group not found");
//         }
//         const isOwner = group.members.some(member => member._id.toString() === id && member.groupRole === 'owner');
//         if (!isOwner) {
//             throw createHttpErrors(403, "Only the group owner can delete this group");
//         }
//         await db.Groups.deleteOne({ _id: groupId });
//         res.status(200).json({ message: "Group deleted successfully" });
//     } catch (error) {
//         next(error);
//     }
// }

async function deleteGroup(req, res, next) {
    try {
        const { groupId } = req.params;
        const { id } = req.payload;
        const group = await db.Groups.findOne({ _id: groupId });

        if (!group) {
            throw createHttpErrors(404, "Group not found");
        }
        
        // Check if the user is the owner of the group
        const isOwner = group.members.some(member => member._id.toString() === id && member.groupRole === 'owner');
        if (!isOwner) {
            throw createHttpErrors(403, "Only the group owner can delete this group");
        }
        
        // Remove group from all users in the group
        await db.Users.updateMany(
            { groups: groupId }, // Find users with the groupId in their groups array
            { $pull: { groups: groupId } } // Remove the groupId from their groups array
        );

        // Delete the group
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
        const { id } = req.payload; // The user's ID from the payload
        const group = await db.Groups.findOne({ groupCode });

        // Check if the group exists
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Check if the user is already a member of the group
        const isMember = group.members.some(member => member._id.toString() === id);
        if (isMember) {
            return res.status(400).json({error: { status: 400, message: "You are already a member of this group" }});
        }

        // Add the user to the group
        group.members.push({
            _id: id,
            groupRole: 'member'
        });

        // Save the updated group
        await group.save();

        // Update the user's groups using findOneAndUpdate
        const updatedUser = await db.Users.findOneAndUpdate(
            { _id: id },
            { $addToSet: { groups: group._id } }, // Using $addToSet to avoid duplicates
            { new: true } 
        );

        // Check if the user update was successful
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "Joined the group successfully", group, updatedUser });

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
        await db.Users.updateMany(
            { groups: groupId }, // Find users with the groupId in their groups array
            { $pull: { groups: groupId } } // Remove the groupId from their groups array
        );

        res.status(200).json("You have successfully left the group");
    } catch (error) {
        next(error);
    }
}

// get member of group

async function getGroupMember(req, res, next) {
    try {
        const { groupId } = req.params;

        const group = await db.Groups.findOne({ _id: groupId })
            .populate({
                path: 'members._id',
                model: 'user',
                select: 'username'
            });

        if (!group) {
            throw createHttpErrors(404, "Group not found");
        }
        const memberInfo = group.members.map(member => ({
            id: member._id ? member._id._id : null,
            name: member._id ? member._id.username : null,
            groupRole: member.groupRole
        }));

        res.status(200).json({ memberInfo });

    } catch (error) {
        next(error);
    }
}


// Set role for member in group
async function setGroupMemberRole(req, res, next) {
    try {
        const { groupId, memberId } = req.params;
        const { id } = req.payload;
        const { groupRole } = req.body;

        const group = await db.Groups.findOne({ _id: groupId });
        if (!group) {
            throw createHttpErrors(404, "Group not found");
        }
        const owner = group.members.find(member => member._id.toString() === id && member.groupRole === 'owner');
        if (!owner) {
            throw createHttpErrors(403, "Only the group owner can edit member roles");
        }
        const member = group.members.find(member => member._id.toString() === memberId);
        if (!member) {
            throw createHttpErrors(404, "Member not found");
        }
        if (memberId === owner._id.toString()) {
            throw createHttpErrors(403, "You cannot change your own role");
        }
        const otherOwners = group.members.filter(member => member.groupRole === 'owner' && member._id.toString() !== memberId);
        if (groupRole === 'owner' && otherOwners.length > 0) {
            throw createHttpErrors(400, "Cannot assign owner role as there is already an owner");
        }

        // Cập nhật vai trò thành viên
        await db.Groups.updateOne(
            { _id: groupId, "members._id": memberId },
            { $set: { "members.$.groupRole": groupRole } }
        );
        res.status(200).json({ message: "Member role updated successfully", memberId, newRole: groupRole });
    } catch (error) {
        next(error);
    }
}

// delete group member

async function deleteGroupMember(req, res, next) {
    try {
        const { groupId, memberId } = req.params;
        const { id } = req.payload;

        // Find the group by its ID
        const group = await db.Groups.findOne({ _id: groupId });
        if (!group) {
            throw createHttpErrors(404, "Group not found");
        }

        // Check if the requester is the owner of the group
        const owner = group.members.find(member => member._id.toString() === id && member.groupRole === 'owner');
        if (!owner) {
            throw createHttpErrors(403, "Only the group owner can delete a member");
        }

        // Check if the member to be deleted exists
        const memberToDelete = group.members.find(member => member._id.toString() === memberId);
        if (!memberToDelete) {
            throw createHttpErrors(404, "Member not found");
        }

        // Ensure the owner is not trying to delete themselves
        if (memberId === id) {
            throw createHttpErrors(403, "The owner cannot remove themselves from the group");
        }

        // Remove the member from the group
        group.members = group.members.filter(member => member._id.toString() !== memberId);
        await group.save();

        // Optionally, remove the group from the user's list of groups
        const user = await db.Users.findById(memberId);
        if (user) {
            user.groups = user.groups.filter(group => group.toString() !== groupId);
            await user.save();
        }

        res.status(200).json({ message: "Member removed from the group successfully" });
    } catch (error) {
        next(error);
    }
}

// get user id 

async function getUserRole(req, res, next) {
    try {
        const { groupId } = req.params;
        const { id } = req.payload;

        const group = await db.Groups.findOne({ _id: groupId });

        if (!group) {
            throw createHttpErrors(404, "Group not found");
        }
        const member = group.members.find(member => member._id.toString() === id);

        if (!member) {
            throw createHttpErrors(404, "User not found in the specified group");
        }
        res.status(200).json({
            id: member._id,
            groupRole: member.groupRole,
        });

    } catch (error) {
        next(error);
    }
}


async function getAllTask(req, res, next) {
    try {
        const { groupId } = req.params;
        const group = await db.Groups.findOne({ _id: groupId });
        if (!group) {
            // throw createHttpErrors[404]("Group not found")
            return res.status(404).json({ error: { status: 404, message: "Group not found" } })

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
            // throw createHttpErrors(404, "Group not found")
            return res.status(404).json({ error: { status: 404, message: "Group not found" } })
        }
        const newTask = {
            taskName: req.body.taskName,
            description: req.body.description,
            reviewer: id,
            deadline: req.body.deadline,
            status: req.body.status.toLowerCase(),
        }
        await db.Groups.findOneAndUpdate({ _id: groupId }, { $addToSet: { tasks: newTask } }, { runValidators: true })
        const saveGroup = await db.Groups.findOne({ _id: groupId });

        res.status(201).json(saveGroup.tasks[saveGroup.tasks.length - 1])



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
            // throw createHttpErrors(404, "Group not found")
            return res.status(404).json({ error: { status: 404, message: "Group not found" } })

        }
        const task = group.tasks.find(t => t._id == taskId)
        if (!task) {
            // throw createHttpErrors(404, "Task not found")
            return res.status(404).json({ error: { status: 404, message: "Task not found" } })

        }
        if (!req.body) {
            // throw createHttpErrors(400, "Input is reqiured")
            return res.status(400).json({ error: { status: 400, message: "Input is reqiured" } })

        }
        const updateTask = {
            taskName: req.body.taskName ? req.body.taskName : task.taskName,
            description: req.body.description ? req.body.description : task.description,
            reviewer: req.body.reviewer ? req.body.reviewer : task.reviewer,
            assignee: req.body.assignee ? req.body.assignee : task.assignee,
            deadline: req.body.deadline ? req.body.deadline : task.deadline,
            status: req.body.status?.toLowerCase(),
            updatedAt: new Date()
        }
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
            // throw createHttpErrors(404, "Group not found")
            return res.status(404).json({ error: { status: 404, message: "Group not found" } })


        }
        const task = group.tasks.find(t => t._id == taskId)
        if (!task) {
            // throw createHttpErrors(404, "Task not found")
            return res.status(404).json({ error: { status: 404, message: "Task not found" } })

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
            // throw createHttpErrors(404, "Group not found")
            return res.status(404).json({ error: { status: 404, message: "Group not found" } })

        }
        const task = group.tasks.find(t => t._id == taskId)
        if (!task) {
            // throw createHttpErrors(404, "Task not found")
            return res.status(404).json({ error: { status: 404, message: "Task not found" } })

        }
        if (!req.body.subTaskName) {
            // throw createHttpErrors.BadRequest("Subtask name is required")
            return res.status(404).json({ error: { status: 404, message: "Sub task not found" } })

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
                runValidators: true,
                new: true
            }
        )

        const saveGroup = await db.Groups.findOne({ _id: groupId })
        const subTasks = saveGroup.tasks.find(t => t._id == taskId).subTasks
        res.status(201).json(subTasks[subTasks.length - 1])

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
            return res.status(404).json({ error: { status: 404, message: "Group not found" } })

        }
        const task = group.tasks.find(t => t._id == taskId)
        if (!task) {
            throw createHttpErrors(404, "Task not found")
            return res.status(404).json({ error: { status: 404, message: "Task not found" } })

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
            // throw createHttpErrors(404, "Group not found")
            return res.status(404).json({ error: { status: 404, message: "Group not found" } })

        }
        const task = group.tasks.find(t => t._id == taskId)
        if (!task) {
            // throw createHttpErrors(404, "Task not found")
            return res.status(404).json({ error: { status: 404, message: "Task not found" } })

        }
        const subTask = task.subTasks.find(st => st._id == subTaskId)
        if (!subTask) {
            // throw createHttpErrors(404, "Subtask not found")
            return res.status(404).json({ error: { status: 404, message: "Sub task not found" } })

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
            .then((rs) => res.status(200).json(updateSubTask));
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
            // throw createHttpErrors(404, "Group not found")
            return res.status(404).json({ error: { status: 404, message: "Group not found" } })

        }
        const task = group.tasks.find(t => t._id == taskId)
        if (!task) {
            // throw createHttpErrors(404, "Task not found")
            return res.status(404).json({ error: { status: 404, message: "Task not found" } })

        }
        const subTask = task.subTasks.find(st => st._id == subTaskId)
        if (!subTask) {
            // throw createHttpErrors(404, "Subtask not found")
            return res.status(404).json({ error: { status: 404, message: "Sub task not found" } })

        }

        await db.Groups.updateOne(
            {
                _id: groupId, "tasks._id": taskId
            }
            , {
                $pull: { "tasks.$.subTasks": { _id: subTaskId } }
            }
        ).then((rs) => res.status(200).json(subTaskId))
            .catch((err) => { console.log(err); })


    } catch (error) {
        next(error)
        // new khong co next : throw httpError.400 
    }
}

// CRUD column 
async function createColumn(req, res, next) {
    try {
        const { groupId } = req.params;
        const group = await db.Groups.findOne({ _id: groupId });
        if (!group) {
            // throw createHttpErrors(404, "Group not found")
            return res.status(404).json({ error: { status: 404, message: "Group not found" } })

        }
        const newColumn = req.body.newColumn.toLowerCase();
        if (newColumn == "") {

            return res.status(400).json({ error: { status: 400, message: "Input please" } })
        }
        if (group.classifications.includes(newColumn)) {
            // throw createHttpErrors(400, "Column already exists");
            return res.status(404).json({ error: { status: 404, message: "Column not found" } })

        }

        const updatedGroup = await db.Groups.findByIdAndUpdate(
            { _id: groupId },
            { $addToSet: { classifications: newColumn } },
            {
                runValidators: true,
                new: true
            }
        );

        res.status(201).json(updatedGroup);

    } catch (error) {
        next(error)
        // new khong co next : throw httpError.400 
    }
}

async function editColumn(req, res, next) {
    try {
        const { groupId } = req.params;
        const group = await db.Groups.findOne({ _id: groupId });
        if (!group) {
            // throw createHttpErrors(404, "Group not found")
            return res.status(404).json({ error: { status: 404, message: "Group not found" } })

        }
        const newColumn = req.body.newColumn?.toLowerCase();
        const selectedColumn = req.body.selectedColumn?.toLowerCase();
        if (newColumn == "" || selectedColumn == "") {
            return res.status(400).json({ error: { status: 400, message: "Input please" } })

        }
        if (!group.classifications.includes(selectedColumn)) {
            // throw createHttpErrors(400, "The selected column does not exist");
            return res.status(400).json({ error: { status: 400, message: "The selected column does not exist" } })

        }
        if (group.classifications.includes(newColumn)) {
            // throw createHttpErrors(400, "The new column already existed");
            return res.status(400).json({ error: { status: 400, message: "The new column already existed" } })

        }
        const updatedClassifications = group.classifications.map((column) => column == selectedColumn ? newColumn : column);
        const updatedTasks = [...group.tasks]

        updatedTasks.forEach(task => {
            if (task.status.toLowerCase() == selectedColumn) {
                task.status = newColumn;
            }
            return task;
        });

        const updatedGroup = await db.Groups.findByIdAndUpdate(
            { _id: groupId },
            {
                $set: {
                    tasks: updatedTasks,
                    classifications: updatedClassifications
                }
            },
            {
                runValidators: true,
                new: true
            }
        );

        res.status(201).json(updatedGroup);

    } catch (error) {
        next(error)
        // new khong co next : throw httpError.400 
    }
}

async function deleteColumn(req, res, next) {
    try {
        const { groupId } = req.params;
        const group = await db.Groups.findOne({ _id: groupId });
        if (!group) {
            // throw createHttpErrors(404, "Group not found")
            return res.status(404).json({ error: { status: 404, message: "Group not found" } })
        }
        const selectedColumn = req.body.selectedColumn.toLowerCase();
        const alternativeColumn = req.body.alternativeColumn.toLowerCase();
        if (alternativeColumn == "" || selectedColumn == "") {
            // throw createHttpErrors(400, "Input please");
            return res.status(400).json({ error: { status: 400, message: "Input please" } })
        }
        if (!group.classifications.includes(selectedColumn)) {
            // throw createHttpErrors(400, "The selected column does not exist");
            return res.status(400).json({ error: { status: 400, message: "The selected column does not exist" } })
        }
        if (!group.classifications.includes(alternativeColumn)) {
            // throw createHttpErrors(400, "The alternative column does not exist");
            return res.status(400).json({ error: { status: 400, message: "The alternative column already existed" } })
        }
        const { tasks } = group;

        const updatedTasks = [...group.tasks]

        updatedTasks.forEach(task => {
            if (task.status.toLowerCase() == selectedColumn) {
                task.status = alternativeColumn;
            }
            return task;
        });

        const updatedGroup = await db.Groups.findByIdAndUpdate(
            { _id: groupId },
            {
                $set: { tasks: [...updatedTasks] },
                $pull: { classifications: selectedColumn }
            },
            {
                runValidators: true,
                new: true
            }
        );

        res.status(201).json(updatedGroup);

    } catch (error) {
        next(error)
        // new khong co next : throw httpError.400 
    }
}

// Comment
async function getAllComments(req, res, next) {
    try {
        const { groupId, taskId } = req.params;
        const group = await db.Groups.findOne({ _id: groupId });
        if (!group) {
            // throw createHttpErrors(404, "Group not found")
            return res.status(404).json({ error: { status: 404, message: "Group not found" } })

        }
        const task = group.tasks.find(t => t._id == taskId)
        if (!task) {
            // throw createHttpErrors(404, "Task not found")
            return res.status(404).json({ error: { status: 404, message: "Task not found" } })

        }

        const { comments } = task;
        res.status(200).json(comments)

    } catch (error) {
        next(error)
    }
}

async function addComment(req, res, next) {
    try {
        const { id } = req.payload;
        const { groupId, taskId } = req.params;
        const group = await db.Groups.findOne({ _id: groupId });
        if (!group) {
            // throw createHttpErrors(404, "Group not found")
            return res.status(404).json({ error: { status: 404, message: "Group not found" } })

        }
        const task = group.tasks.find(t => t._id == taskId)
        if (!task) {
            // throw createHttpErrors(404, "Task not found")
            return res.status(404).json({ error: { status: 404, message: "Task not found" } })

        }
        if (!req.body) {

            // throw createHttpErrors.BadRequest("Comment is required")
            return res.status(400).json({ error: { status: 400, message: "Input please" } })
        }
        const newComment = {
            user: id,
            content: req.body.content,
            status: req.body.status
        }
        const saveGroup = await db.Groups.findOneAndUpdate(
            {
                _id: groupId, "tasks._id": taskId

            },
            {
                $push: { "tasks.$.comments": newComment }
            },
            {
                runValidators: true,
                new: true
            }
        )
        const comments = saveGroup?.tasks.find(t => t._id == taskId).comments
        res.status(201).json(comments[comments.length - 1])

    } catch (error) {
        next(error)
        // new khong co next : throw httpError.400 
    }
}

async function editComment(req, res, next) {
    try {
        const { groupId, taskId, commentId } = req.params;
        const group = await db.Groups.findOne({ _id: groupId });
        if (!group) {
            // throw createHttpErrors(404, "Group not found")
            return res.status(404).json({ error: { status: 404, message: "Group not found" } })

        }
        const task = group.tasks.find(t => t._id == taskId)
        if (!task) {
            // throw createHttpErrors(404, "Task not found")
            return res.status(404).json({ error: { status: 404, message: "Task not found" } })

        }
        const comment = task.comments.find(c => c._id == commentId)
        if (!comment) {
            // throw createHttpErrors(404, "Comment not found")
            return res.status(404).json({ error: { status: 404, message: "Comment not found" } })

        }

        const updateComment = {
            content: req.body.content ? req.body.content : comment.content,
            status: req.body.status ? req.body.status : comment.status,
            updatedAt: new Date()
        }
        await db.Groups.findOneAndUpdate(
            {
                _id: groupId,
                "tasks._id": taskId,
                "tasks.comments._id": commentId
            },
            {
                $set: {
                    "tasks.$.comments.$[comment].content": updateComment.content,
                    "tasks.$.comments.$[comment].status": updateComment.status,
                    "tasks.$.comments.$[comment].updatedAt": updateComment.updatedAt
                }
            },
            {
                arrayFilters: [{ "comment._id": commentId }],
                runValidators: true,
                new: true
            })
            .then((rs) => res.status(200).json(rs))

    } catch (error) {
        next(error)
        // new khong co next : throw httpError.400 
    }
}

async function deleteComment(req, res, next) {
    try {
        const { groupId, taskId, commentId } = req.params;
        const group = await db.Groups.findOne({ _id: groupId });
        if (!group) {
            // throw createHttpErrors(404, "Group not found")
            return res.status(404).json({ error: { status: 404, message: "Group not found" } })
        }
        const task = group.tasks.find(t => t._id == taskId)
        if (!task) {
            // throw createHttpErrors(404, "Task not found")
            return res.status(404).json({ error: { status: 404, message: "Task not found" } })
        }
        const comment = task.comments.find(c => c._id == commentId)
        if (!comment) {
            // throw createHttpErrors(404, "Comment not found")
            return res.status(404).json({ error: { status: 404, message: "Comment not found" } })
        }

        await db.Groups.findOneAndUpdate(
            {
                _id: groupId, "tasks._id": taskId
            }
            , {
                $pull: { "tasks.$.comments": { _id: commentId } }
            }
        ).then((rs) => res.status(200).json(commentId))
            .catch((err) => { console.log(err); })


    } catch (error) {
        next(error)
        // new khong co next : throw httpError.400 
    }
}


const updatePremium = async (req, res) => {
    try {
        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({ message: "_id is required in request body" });
        }

        // Cập nhật isPremium thành true cho nhóm có _id tương ứng
        const result = await db.Groups.updateOne(
            { _id }, // Điều kiện lọc dựa trên _id
            { $set: { isPremium: true } } // Cập nhật trường isPremium thành true
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Group not found" });
        }

        res.status(200).json({
            message: "Group's premium status updated successfully",
            result
        });
    } catch (error) {
        console.error("Error updating premium status:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};


const countGroups = async (req, res, next) => {
    try {
        const filter = {};
        const count = await db.Groups.countDocuments(filter);
        res.status(200).json({ count });
    } catch (error) {
        console.error("Error counting groups:", error);
        next(error);
    }
};

const countPremiumGroups = async (req, res, next) => {
    try {
        const filter = { isPremium: true };
        const count = await db.Groups.countDocuments(filter);
        res.status(200).json({ count });
    } catch (error) {
        console.error("Error counting groups:", error);
        next(error);
    }
};


// Hàm để thêm người dùng vào nhóm thông qua email và gửi link xác nhận
async function inviteUserToGroup(req, res, next) {
    try {
        const { email, role } = req.body;
        const groupId = req.params.groupId;

        if (!email || !groupId || !role) {
            throw createError.BadRequest("Missing required fields: email, groupId, or role");
        }
        const user = await db.Users.findOne({ "account.email": email });
        if (!user) {
            throw createError.NotFound("User with this email not found");
        }

        const group = await db.Groups.findById(groupId);
        if (!group) {
            throw createError.NotFound("Group not found");
        }

        if (!group.isPremium && group.members.length >= 5) {
            throw createError.BadRequest("Cannot invite more members to a non-premium group with 5 members");
        }

        // Tạo token mới để mời
        const token = JWT.sign(
            { userId: user._id, groupId, role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Link xác nhận
        const link = `http://localhost:9999/groups/confirm-invite?token=${token}`;

        // Gửi email với link xác nhận
        await authenticationController.sendEmail("verify", email, link);

        res.status(200).json({ message: "Invitation sent successfully" });
    } catch (error) {
        next(error);
    }
}


// xác nhận vào nhóm bằng link
async function confirmInvite(req, res, next) {
    try {
        const token = req.query.token;

        if (!token) throw createHttpErrors.BadRequest("Token is required");

        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        const { userId, groupId, role } = decoded;

        const group = await db.Groups.findById(groupId);
        if (!group) throw createHttpErrors.NotFound("Group not found");

        const isMember = group.members.some(member => member._id.toString() === userId);
        if (isMember) {
            throw createHttpErrors.Conflict("User is already in the group");
        }

        group.members.push({ _id: userId, groupRole: role });
        await group.save();

        const user = await db.Users.findById(userId);
        if (!user) throw createHttpErrors.NotFound("User not found");

        const isGroupExists = user.groups.some(groupId => groupId.toString() === group._id.toString());
        if (!isGroupExists) {
            user.groups.push(group._id);
            await user.save();
        }

        res.status(200).json({ message: "User added to group successfully", groupId });
    } catch (error) {
        next(error);
    }
}



// Get all groups from the database
async function getAllGroups(req, res, next) {
    try {
        const groups = await db.Groups.find();
        res.status(200).json(groups);
    } catch (error) {
        next(error);
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
    outGroup,
    deleteSubTask,
    getGroupMember,
    setGroupMemberRole,
    deleteGroupMember,
    getUserRole,
    updatePremium,
    countGroups,
    countPremiumGroups,
    getAllGroups,
    addComment,
    editComment,
    deleteComment,
    inviteUserToGroup,
    confirmInvite,
    getAllComments,
    createColumn,
    editColumn,
    deleteColumn
}

module.exports = GroupController;