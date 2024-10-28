const mongoose = require('mongoose');
const { create } = require('./notification.model');

const groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        unique: [true,"Group name existed"],
        required: [true,"Group name is required"],
        maxlength: 10 // Limit group name to 10 characters
    },
    groupCode: {
        type: String,
        unique: [true,"Group code existed"],
        required: [true,"Group code is required"],
        maxlength: 6 // Group code should be unique and max 6 characters
    },
    classifications: [{
        type: String // Add classifications array (add more detail based on your needs)
    }],
    tasks: [{
        taskName: {
            type: String,
            required: [true,"Task name is required"],
            maxlength: 50 // Limit task name to 50 characters
        },
        description: {
            type: String,
            maxlength: 100 // Limit task description to 100 characters
        },
        assignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
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
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
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
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            updatedAt: {
                type: Date,
                default: Date.now
            }
        }],
        subTasks: [{
            subTaskName: {
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
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            updatedAt: {
                type: Date,
                default: Date.now
            }

        }]
    }],
    members: [{
        _id: mongoose.Schema.Types.ObjectId,
        groupRole: {
            type: String,
            enum: ['owner', 'member', 'viewer'],
            default:"member",
            required: [true,"Role is required"]
        }
    }],
    isPremium: {
        type: Boolean,
        default: false,
        required: [true,"Role is required"]
        
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
        required: true // Only for group owner
    }
}, {
    timestamps: true
});

// groupSchema.methods = {
//     memberRole: function (userId){
//         return this.members.find(m=>m._id == userId)
//     }
// }

const Group = mongoose.model('group', groupSchema);
module.exports = Group;
