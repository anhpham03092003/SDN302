const mongoose = require('mongoose');
const db = require("../models/index");
const bcrypt = require("bcrypt");

const getProfile = async (req, res, next) => {
    const userId = req.payload.id;
    try {
        const user = await db.Users.findById(userId);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

const updateProfile = async (req, res, next) => {
    const userId = req.payload.id;
    try {
        const newProfile = {
            username: req.body.username,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            avatar: req.body.avatar
        };

        console.log('Received profile data:', newProfile);  // Kiểm tra dữ liệu nhận từ frontend

        const user = await db.Users.findByIdAndUpdate(
            userId,
            {
                $set: {
                    'profile.phoneNumber': newProfile.phoneNumber,
                    'username': newProfile.username,
                    'account.email': newProfile.email,
                    'profile.avatar': newProfile.avatar
                }
            },
            { new: true, runValidators: true }
        );

        res.status(200).json(user);
    } catch (error) {
        console.error('Error updating profile:', error);  
        next(error);
    }
};


const changePassword = async (req, res, next) => {
    const userId = req.payload.id; // Get the user ID from the request payload
    const { oldPassword, newPassword, confirmPassword } = req.body; // Destructure the request body

    try {
        // Check if the user exists and validate the old password
        const user = await db.Users.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the old password is correct
        const isMatch = await bcrypt.compare(oldPassword, user.account.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        // Validate the new password and confirmation
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "New password and confirmation do not match" });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password in a single operation
        await db.Users.findOneAndUpdate(
            { _id: userId }, // Filter by user ID
            { 'account.password': hashedNewPassword }, // Update the password
            { new: true } // Return the updated document
        );

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        next(error); // Pass errors to the error handling middleware
    }
}


const getClassification = async (req, res, next) => {
    const userId = req.payload.id;
    try {
        const user = await db.Users.findById(userId);
        res.status(200).json(user.classifications);
    } catch (error) {
        next(error);
    }
}

const addClassification = async (req, res, next) => {
    const userId = req.payload.id;
    const newClassification = req.body.classification;

    if (!newClassification) {
        return res.status(400).json({ message: "Phân loại là bắt buộc." });
    }

    try {
        const updatedUser = await db.Users.findByIdAndUpdate(
            userId,
            { $addToSet: { classifications: newClassification } }, 
            { new: true, runValidators: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "Không tìm thấy người dùng." });
        }

        res.status(200).json(updatedUser);
    } catch (error) {

        console.error(error);
        return res.status(500).json({ message: "Đã xảy ra lỗi khi thêm phân loại." });
    }
};


const editClassification = async (req, res, next) => {
    const userId = req.payload.id;
    const { oldClassification, newClassification } = req.body;

    try {

        const user = await db.Users.findById(userId);
        if (!user) {
            return res.status(404).json({ error: { status: 404, message: "User not found" } });
        }

        const classificationIndex = user.classifications.indexOf(oldClassification);
        if (classificationIndex === -1) {
            return res.status(404).json({ error: { status: 404, message: "Classification not found" } });
        }

        await db.Users.findByIdAndUpdate(
            userId,
            { $set: { [`classifications.${classificationIndex}`]: newClassification } }, 
            { new: true, runValidators: true } 
        );

        await db.Users.findByIdAndUpdate(
            userId,
            { $set: { 'individualTasks.$[elem].status': newClassification } }, 
            {
                new: true,
                arrayFilters: [{ 'elem.status': oldClassification }], 
                runValidators: true
            }
        );

        const updatedUser = await db.Users.findById(userId);
        
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};

const deleteClassification = async (req, res, next) => {
    const userId = req.payload.id;
    const classification = req.body.classification;
    try {
        const user = await db.Users.findById(userId);
        if (!user) {
            return res.status(404).json({ error: { status: 404, message: "User not found" } });
        }
        const classificationIndex = user.classifications.indexOf(classification);
        if (classificationIndex === -1) {
            return res.status(404).json({ error: { status: 404, message: "Classification not found" } });
        }
        await db.Users.findByIdAndUpdate(
            userId,
            { $pull: { classifications: classification } },
            { new: true }
        );
        await db.Users.updateOne(
            { _id: userId }, // Filter by user ID
            { 
                $set: { "individualTasks.$[elem].status": "other" } // Set matching tasks' status to "other"
            },
            { 
                arrayFilters: [{ "elem.status": classification }] // Apply only to tasks with this status
            }
        );
        res.status(200).json({ message: "Classification deleted successfully" });
    } catch (error) {
        next(error);
    }    
};
        

const getTask = async (req, res, next) => {
    const userId = req.payload.id;
    try {
        const taskId = req.params.taskId;
        const user = await db.Users.findById(userId);
        const task = user.individualTasks.id(taskId);
        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
}
const addTask = async (req, res, next) => {
    const userId = req.payload.id;

    try {
        const newTask = {
            taskName: req.body.taskName,
            description: req.body.description,
            deadline: req.body.deadline,
            status: req.body.status,
            
        };

        const updatedUser = await db.Users.findOneAndUpdate(
            { _id: userId },
            { $push: { individualTasks: newTask } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: { status: 404, message: "User not found" } });
        }

        res.status(201).json(updatedUser);
    } catch (error) {
        console.error("Error adding task:", error);
        next(error);
    }
};


const updateTask = async (req, res, next) => {
    const userId = req.payload.id;
    const taskId = req.params.taskId;

    try {
        const updateFields = {};
        if (req.body.taskName !== undefined) updateFields["individualTasks.$.taskName"] = req.body.taskName;
        if (req.body.description !== undefined) updateFields["individualTasks.$.description"] = req.body.description;
        if (req.body.deadline !== undefined) updateFields["individualTasks.$.deadline"] = req.body.deadline;
        if (req.body.status !== undefined) updateFields["individualTasks.$.status"] = req.body.status;

        const updatedUser = await db.Users.findOneAndUpdate(
            { _id: userId, "individualTasks._id": taskId },
            { $set: updateFields },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: { status: 404, message: "User or task not found" } });
        }

        const updatedTask = updatedUser.individualTasks.id(taskId);
        res.status(200).json({ message: "Task updated successfully", task: updatedTask });
    } catch (error) {
        console.error("Error updating task:", error);
        next(error);
    }
};



const deleteTask = async (req, res, next) => {
    const userId = req.payload.id;
    const { taskId } = req.params;

    try {
        const updatedUser = await db.Users.findOneAndUpdate(
            { _id: userId },
            { $pull: { individualTasks: { _id: taskId } } },
            { new: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ error: { status: 404, message: "User not found" } });
        }

        const taskExists = updatedUser.individualTasks.some(task => task._id.toString() === taskId);
        if (taskExists) {
            return res.status(404).json({ error: { status: 404, message: "Task not found" } });
        }

        res.status(200).json({ message: "Task deleted successfully", updatedUser });
    } catch (error) {
        console.error("Error deleting task:", error);
        next(error);
    }
};

const addSubTask = async (req, res, next) => {
    const userId = req.payload.id;
    const { taskId } = req.params;
    const { subName, priority, status } = req.body;

    try {
        const newSubTask = {
            subName,
            priority,
            status,
            createdAt: Date.now(),
            updatedAt: Date.now() 
        };

        const updatedUser = await db.Users.findOneAndUpdate(
            { _id: userId, 'individualTasks._id': taskId },
            { $push: { 'individualTasks.$.subTasks': newSubTask } },
            { new: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ error: { status: 404, message: "Task not found" } });
        }

        res.status(201).json({ message: "SubTask added successfully", task: updatedUser.individualTasks.id(taskId) });
    } catch (error) {
        console.error("Error adding subTask:", error);
        next(error); 
    }
};
const getSubTask = async (req, res, next) => {
    const userId = req.payload.id;
    try {
        const taskId = req.params.taskId;
        const user = await db.Users.findById(userId);
        const task = user.individualTasks.id(taskId)
        const subTask = task.subTasks.id(req.params.subTaskId);
        res.status(200).json(subTask);
    } catch (error) {
        next(error);
    }
}

const updateSubTask = async (req, res, next) => {
    const userId = req.payload.id; 
    const { taskId, subTaskId } = req.params; 

    try {
        const updatedUser = await db.Users.findOneAndUpdate(
            { _id: userId, 'individualTasks._id': taskId, 'individualTasks.subTasks._id': subTaskId }, 
            { 
                $set: { 
                    'individualTasks.$[task].subTasks.$[subTask].subName': req.body.subName, 
                    'individualTasks.$[task].subTasks.$[subTask].priority': req.body.priority,
                    'individualTasks.$[task].subTasks.$[subTask].status': req.body.status
                }
            },
            { 
                new: true,
                arrayFilters: [
                    { 'task._id': taskId }, 
                    { 'subTask._id': subTaskId }
                ]
            }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: { status: 404, message: "SubTask not found" } });
        }

        const updatedSubTask = updatedUser.individualTasks.id(taskId).subTasks.id(subTaskId);

        res.status(200).json({ message: "SubTask updated successfully", subTask: updatedSubTask });
    } catch (error) {
        console.error("Error updating subTask:", error);
        next(error); 
    }
};

const deleteSubTask = async (req, res, next) => {
    const userId = req.payload.id;
    const { taskId, subTaskId } = req.params; 

    try {
        const user = await db.Users.findOneAndUpdate(
            { _id: userId, 'individualTasks._id': taskId },
            { $pull: { 'individualTasks.$.subTasks': { _id: subTaskId } } }, 
            { new: true } 
        );

        if (!user) {
            return res.status(404).json({ error: { status: 404, message: "User or Task not found" } });
        }

        res.status(200).json({ message: "SubTask deleted successfully", user });
    } catch (error) {
        console.error("Error deleting subTask:", error);
        next(error);
    }
};



const getAllUser = async (req, res, next) => {
    try {
        const users = await db.Users.find();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching all users:", error);
        res.status(500).json({ error: { status: 500, message: "Failed to fetch users" } });
        // next(error); 
    }
};

//test
const banUser = async (req, res, next) => {
    const userId = req.params.id;
    console.log("Attempting to ban user with ID:", userId);  // Log userId

    // Log the userId for verification
    console.log("Attempting to ban user with ID:", userId);

    // Validate userId as a MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.error("Invalid User ID format:", userId);
        return res.status(400).json({ error: { status: 400, message: "Invalid User ID format" } });
    }

    try {
        const result = await db.Users.updateOne({ _id: userId }, { status: 'banned' });
        
        // Log the result of the update operation
        console.log("Update operation result:", result);

        if (result.matchedCount === 0) {
            console.error("User not found with ID:", userId);
            return res.status(404).json({ error: { status: 404, message: "User not found" } });
        }
        if (result.modifiedCount === 0) {
            console.warn("User is already banned:", userId);
            return res.status(400).json({ error: { status: 400, message: "User is already banned" } });
        }
        
        res.status(200).json({ message: "User banned successfully", result });
    } catch (error) {
        console.error("Error banning user:", error);
        next(error);
    }
};

// const banUser = async (req, res, next) => {
//     const userId = req.params.id;
//     console.log("Attempting to ban user with ID:", userId);  // Log userId
//     res.status(200).json({ message: `User with ID ${userId} would be banned (test response)` });
// };

const countNormalUsers = async (req, res, next) => {
    try {
        const count = await db.Users.countDocuments({ role: 'user' });
        res.status(200).json({ count });
    } catch (error) {
        console.error("Error counting users with role 'user':", error);
        // next(error);
    }
};


module.exports = {
    getProfile, updateProfile, changePassword,
    getClassification, addClassification, editClassification,deleteClassification,
    getTask, addTask, updateTask, deleteTask,
    getSubTask, addSubTask, updateSubTask, deleteSubTask, getAllUser, banUser,
    countNormalUsers
};

