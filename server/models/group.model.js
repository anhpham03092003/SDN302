const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        unique: true,
        required: true,
        maxlength: 10 // Limit group name to 10 characters
    },
    groupCode: {
        type: String,
        unique: true,
        maxlength: 6 // Group code should be unique and max 6 characters
    },
    classifications: [{
        type: String // Add classifications array (add more detail based on your needs)
    }],
    tasks: [{
        taskName: {
            type: String,
            required: true,
            maxlength: 50 // Limit task name to 50 characters
        },
        description: {
            type: String,
            maxlength: 100 // Limit task description to 100 characters
        },
        assignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true // Assignee is required
        },
        reviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        deadline: {
            type: Date // Use Date type for deadline
        },
        status: {
            type: String,
            enum: ['todo', 'inprogress', 'done'],
            required: true
        },
        comments: [{ // Added comments to the task
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',
                required: true
            },
            content: {
                type: String,
                required: true,
                maxlength: 200 // Limit comment content to 200 characters
            },
            status: {
                type: String,
                required: true
            }
        }],
        subTasks: [{
            subtaskName: {
                type: String,
                required: true,
                maxlength: 200
            },
            assignee: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
            priority: {
                type: String,
                enum: ['low', 'medium', 'high'],
                default: 'medium' // Default priority to medium
            },
            status: {
                type: String,
                enum: ['inprogress', 'done'],
                default: 'inprogress'
            }
        }]
    }],
    members: [{
        _id: mongoose.Schema.Types.ObjectId,
        groupRole: {
            type: String,
            enum: ['owner', 'member', 'viewer'],
            required: true
        }
    }],
    isPremium: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
        required: true // Only for group owner
    }
});

const Group = mongoose.model('group', groupSchema);
module.exports = Group;
