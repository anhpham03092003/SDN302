const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    account: {
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/.+\@.+\..+/, "asaf"] // Email validation
        },
        password: {
            type: String,
            required: true,
            minlength: 6 // Password validation, adjust as needed
            // nếu lưu với password hash thì validate ở đâu
        }
    },
    profile: {
        phoneNumber: {
            type: String,
            match: /^(0|\+)[0-9]{9,12}$/, // Phone number validation (10 digits) 
            // thiếu điều kiện so
            required: true
        },
        avatar: {
            type: String,
            default: '/images/avatar/imageDefault.jpg' // Default avatar URL, update with a valid URL
        }
    },
    groups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'group'
    }],
    notifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'notification'
    }],
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['inactive', 'active', 'banned'],
        default: 'inactive'
    },
    classifications: {
        type: [String],
        default: ['todo', 'doing', 'done', 'other']
    },
    individualTasks: [{
        taskName: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        deadline: {
            type: Date, // Date type
            validate: {
                validator: function (value) {
                    return value > Date.now(); // Deadline must be in the future
                },
                message: 'Deadline must be in the future.'
            }
        },
        status: {
            type: String,
            default: 'todo'
        },
        subTasks: [{
            subName: {
                type: String,
                required: true
            },
            priority: {
                type: String,
                enum: ['low', 'medium', 'high'],
                default: 'medium'
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
            updateAt: {
                type: Date,
                default: Date.now
            }
        }],

    }]
}, {
    timestamps: true
});

const User = mongoose.model('user', userSchema);
module.exports = User;
