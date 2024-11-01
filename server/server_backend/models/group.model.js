const mongoose = require('mongoose');
const { create } = require('./notification.model');

const groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        unique: [true,"Group name existed"],
        required: [true,"Group name is required"],
        maxlength: 15 // Limit group name to 10 characters
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
            unique:false,
            maxlength: 50 // Limit task name to 50 characters
        },
        description: {
            type: String,
            maxlength: 100 // Limit task description to 100 characters
        },
        assignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            default:null
        },
        reviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        deadline: {
            type: Date,
            default:null
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
        },
        comments: [{ 
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',
                required: true
            },
            content: {
                type: String,
                required: true,
                maxlength: 200 
            },
            status: {
                type: String,
                required: true,
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
                ref: 'user',
                default:null
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
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'user'
        },
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
