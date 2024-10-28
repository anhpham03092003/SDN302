const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    receivers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'group'
    },
    content: {
        type: String,
        required: true,
        maxlength: 200 // Limit content to 200 characters
    },
    activityUrl: {
        type: String,
        required: false
    },
    isSeen: {
        type: Boolean,
        default: false // Default false for unseen notifications
    }
}, {
    timestamps: true
});

const Notification = mongoose.model('notification', notificationSchema);
module.exports = Notification;
