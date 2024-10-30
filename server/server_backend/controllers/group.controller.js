const db = require('../models');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
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
// edit group detail by group id
async function editGroupDetail(req, res, next) {
    try {
        const { groupId } = req.params;
        const { id } = req.payload;
        const { groupName, groupCode, groupRole } = req.body;

        const group = await db.Groups.findOne({ _id: groupId });
        if (!group) {
            throw createHttpErrors(404, "Group not found");
        }

        const member = group.members.find(member => member._id.toString() === id);
        if (!member) {
            throw createHttpErrors(403, "You don't have permission to edit this group");
        }

        const updateGroup = {};

        // If the member is 'owner', allow editing of all attributes except classifications
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
        }
        // If the member is 'member', restrict editing to only groupRole validation
        else if (member.groupRole === 'member') {
            if (groupName || groupCode) {
                throw createHttpErrors(403, "Only the group owner can edit the group name and group code");
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

// get member of group

async function getGroupMember(req, res, next) {
    try {
      const { groupId } = req.params;

      const group = await db.Groups.findOne({ _id: groupId })
        .populate({
          path: 'members._id',  
          model: 'user',  
          select : 'username'               
        });
  
      if (!group) {
        throw createHttpErrors(404, "Group not found");
      }
      const memberInfo = group.members.map(member => ({
        id: member._id ? member._id._id : null, 
        name: member._id ? member._id.username : null, 
        groupRole: member.groupRole                   
    }));

        res.status(200).json({memberInfo });
    
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
            throw createHttpErrors[404]("Group not found")
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
            status: req.body.status.toLowerCase(),
        }
        await db.Groups.findOneAndUpdate({ _id: groupId }, { $addToSet: { tasks: newTask } }, { runValidators: true})
        const saveGroup = await db.Groups.findOne({ _id: groupId });

        res.status(201).json(saveGroup.tasks[saveGroup.tasks.length-1])


        
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
        if(!req.body){
            throw createHttpErrors(400, "Input is reqiured")
        }
        const updateTask = {
            taskName: req.body.taskName? req.body.taskName:task.taskName,
            description: req.body.description? req.body.description:task.description,        
            reviewer: req.body.reviewer? req.body.reviewer:task.reviewer,
            assignee: req.body.assignee? req.body.assignee:task.assignee,
            deadline: req.body.deadline? req.body.deadline:task.deadline,
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
        if(!req.body.subTaskName){
            throw createHttpErrors.BadRequest("Subtask name is required")
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
                new:true
            }
        )
        
        const saveGroup= await db.Groups.findOne({ _id: groupId })
        const subTasks = saveGroup.tasks.find(t=>t._id==taskId).subTasks
        res.status(201).json(subTasks[subTasks.length-1])
        
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
        ).then((rs)=>res.status(200).json(subTaskId))
        .catch((err)=>{console.log(err);})

        
    } catch (error) {
        next(error)
        // new khong co next : throw httpError.400 
    }
}

// CRUD column 
async function createColumn(req, res, next) {
    try {
        const { groupId} = req.params;
        const group = await db.Groups.findOne({ _id: groupId });
        if (!group) {
            throw createHttpErrors(404, "Group not found")
        }
        const newColumn = req.body.newColumn.toLowerCase();
        if(newColumn == ""){
            throw createHttpErrors(400, "Input please");
        }
        if (group.classifications.includes(newColumn)) {
            throw createHttpErrors(400, "Column already exists");
        }

        const updatedGroup = await db.Groups.findByIdAndUpdate(
            {_id:groupId}, 
            {$addToSet: {classifications: newColumn} },
            {
                runValidators:true,
                new:true
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
        const { groupId} = req.params;
        const group = await db.Groups.findOne({ _id: groupId });
        if (!group) {
            throw createHttpErrors(404, "Group not found")
        }
        const newColumn = req.body.newColumn?.toLowerCase();
        const selectedColumn = req.body.selectedColumn?.toLowerCase();
        if(newColumn == ""||selectedColumn == ""){
            throw createHttpErrors(400, "Input please");
        }
        if (!group.classifications.includes(selectedColumn)) {
            throw createHttpErrors(400, "The selected column does not exist");
        }
        if (group.classifications.includes(newColumn)) {
            throw createHttpErrors(400, "The new column already existed");
        }
        const updatedClassifications = group.classifications.map((column)=> column == selectedColumn ? newColumn : column);

        const updatedGroup = await db.Groups.findByIdAndUpdate(
            {_id:groupId}, 
            { classifications: updatedClassifications },
            {
                runValidators:true,
                new:true
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
        const { groupId} = req.params;
        const group = await db.Groups.findOne({ _id: groupId });
        if (!group) {
            throw createHttpErrors(404, "Group not found")
        }
        const selectedColumn = req.body.selectedColumn.toLowerCase();
        const alternativeColumn = req.body.alternativeColumn.toLowerCase();
        if(alternativeColumn == ""||selectedColumn == ""){
            throw createHttpErrors(400, "Input please");
        }
        if (!group.classifications.includes(selectedColumn)) {
            throw createHttpErrors(400, "The selected column does not exist");
        }
        if (!group.classifications.includes(alternativeColumn)) {
            throw createHttpErrors(400, "The alternative column does not exist");
        }
        const {tasks} = group;

        const updatedTasks = tasks.map((task) => {
            return {
                ...task,
                status: task.status.toLowerCase() == selectedColumn ? alternativeColumn : task.status.toLowerCase()
            }
        });
        
        // const updatedGroup = await db.Groups.findByIdAndUpdate(
        //     {_id:groupId}, 
        //     { 
        //         $set:{tasks:[...updatedTasks]},
        //         $pull:{classifications: selectedColumn} },
        //     {
        //         runValidators:true,
        //         new:true
        //     }
        // );

        res.status(201).json(updatedTasks);
        
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
    outGroup,
    deleteSubTask,
    getGroupMember,
    setGroupMemberRole,
    deleteGroupMember,
    getUserRole,
    createColumn,
    editColumn,
    deleteColumn
}

module.exports = GroupController;