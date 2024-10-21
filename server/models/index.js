const mongoose = require("mongoose");
const Group = require("./group.model");
const User = require("./user.model");
const Notification = require("./notification.model");

const db = {};

db.Groups = Group;
db.Users = User;
db.Notifications = Notification;


db.connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI).then(() => {
      console.log("Connected to MongoDB");
    });
  } catch (err) {
    next(err);
    process.exit();
  }
};
module.exports = db;
