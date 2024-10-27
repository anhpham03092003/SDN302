const mongoose = require('mongoose');
const db = require("../models/index");

const getProfile = async (req, res, next) => {
    try {
        const user = await db.Users.findById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

const updateProfile = async (req, res, next) => {
    try {
        const newProfile = {
            avatar: req.body.avatar,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber
        }
        const user = await db.Users.findByIdAndUpdate(req.params.id, {
            $set: {
                'profile.phoneNumber': newProfile.phoneNumber,
                'profile.avatar': newProfile.avatar,
                'account.email': newProfile.email
            }
        },
            { new: true, runValidators: true });
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

const changePassword = async (req, res, next) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    try {
        const user = await db.Users.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Kiểm tra mật khẩu cũ đúng chưa
        const isMatch = await bcrypt.compare(oldPassword, user.account.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        // nhập và kiểm tra mật khẩu mới
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "New password and confirmation do not match" });
        }
        // Mã hóa 
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật 
        user.account.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        next(error);
    }
}

const getTask = async (req, res, next) => {
    try {
        const taskId = req.params.taskId;
        const user = await db.Users.findById(req.params.id);
        const task = user.individualTasks.id(taskId);
        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
}
const addTask = async (req, res, next) => {
    try {
        const user = await db.Users.findById(req.params.id);

        console.log("User found:", user);

        if (!user) {
            return res.status(404).json({ error: { status: 404, message: "User not found" } });
        }

        const newTask = {
            taskName: req.body.taskName,
            description: req.body.description,
            deadline: req.body.deadline,
            status: req.body.status,
            subTasks: req.body.subTasks.map(subTask => ({
                subName: subTask.subName,
                priority: subTask.priority,
                status: subTask.status,
                createdAt: Date.now(),
                updateAt: Date.now()
            }))
        };

        user.individualTasks.push(newTask);

        const savedUser = await user.save();
        res.status(200).json(savedUser);
    } catch (error) {
        console.error("Error adding task:", error);
        next(error);
    }
}

const updateTask = async (req, res, next) => {
    try {
        const user = await db.Users.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: { status: 404, message: "User not found" } });
        }
        const task = user.individualTasks.id(req.params.taskId);
        if (!task) {
            return res.status(404).json({ error: { status: 404, message: "Task not found" } });
        }

        task.taskName = req.body.taskName !== undefined ? req.body.taskName : task.taskName;
        task.description = req.body.description !== undefined ? req.body.description : task.description;
        task.deadline = req.body.deadline !== undefined ? req.body.deadline : task.deadline;
        task.status = req.body.status !== undefined ? req.body.status : task.status;

        const savedUser = await user.save();

        res.status(200).json({ message: "Task updated successfully", task });
    } catch (error) {
        console.error("Error updating task:", error);
        next(error);
    }
};


const deleteTask = async (req, res, next) => {
    try {
        const user = await db.Users.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: { status: 404, message: "User not found" } });
        }
        const task = user.individualTasks.id(req.params.taskId);
        if (!task) {
            return res.status(404).json({ error: { status: 404, message: "Task not found" } });
        }
        user.individualTasks.remove(task);
        const savedUser = await user.save();
        res.status(200).json({ message: "Task deleted successfully", savedUser });
    } catch (error) {
        console.error("Error deleting task:", error);
        next(error);
    }
};


const addSubTask = async (req, res, next) => {
    try {
        const user = await db.Users.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: { status: 404, message: "User not found" } });
        }
        const task = user.individualTasks.id(req.params.taskId);
        if (!task) {
            return res.status(404).json({ error: { status: 404, message: "Task not found" } });
        }

        const newSubTask = {
            subName: req.body.subName,
            priority: req.body.priority,
            status: req.body.status,
            createdAt: Date.now(),
            updateAt: Date.now()
        };
        task.subTasks.push(newSubTask);
        const savedUser = await user.save();
        res.status(200).json({ message: "SubTask added successfully", task });
    } catch (error) {
        console.error("Error adding subTask:", error);
        next(error);
    }
}
const getSubTask = async (req, res, next) => {
    try {
        const taskId = req.params.taskId;
        const user = await db.Users.findById(req.params.id);
        const task = user.individualTasks.id(taskId)
        const subTask = task.subTasks.id(req.params.subTaskId);
        res.status(200).json(subTask);
    } catch (error) {
        next(error);
    }
}

const updateSubTask = async (req, res, next) => {
    try {
        const user = await db.Users.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: { status: 404, message: "User not found" } });
        }
        const task = user.individualTasks.id(req.params.taskId);
        if (!task) {
            return res.status(404).json({ error: { status: 404, message: "Task not found" } });
        }
        const subTask = task.subTasks.id(req.params.subTaskId);
        if (!subTask) {
            return res.status(404).json({ error: { status: 404, message: "SubTask not found" } });
        }
        subTask.subName = req.body.subName !== undefined ? req.body.subName : subTask.subName;
        subTask.priority = req.body.priority !== undefined ? req.body.priority : subTask.priority;
        subTask.status = req.body.status !== undefined ? req.body.status : subTask.status;
        const savedUser = await user.save();
        res.status(200).json({ message: "SubTask updated successfully", subTask });
    } catch (error) {
        console.error("Error updating subTask:", error);
        next(error);
    }
};

const deleteSubTask = async (req, res, next) => {
    try {
        const user = await db.Users.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: { status: 404, message: "User not found" } });
        }
        const task = user.individualTasks.id(req.params.taskId);
        if (!task) {
            return res.status(404).json({ error: { status: 404, message: "Task not found" } });
        }
        const subTask = task.subTasks.id(req.params.subTaskId);
        if (!subTask) {
            return res.status(404).json({ error: { status: 404, message: "SubTask not found" } });
        }
        task.subTasks.remove(subTask);
        const savedUser = await user.save();
        res.status(200).json({ message: "SubTask deleted successfully", savedUser });
    } catch (error) {
        console.error("Error deleting subTask:", error);
        next(error);
    }
};

module.exports = { getProfile, updateProfile, changePassword, getTask, addTask, updateTask, deleteTask, getSubTask, addSubTask, updateSubTask, deleteSubTask };