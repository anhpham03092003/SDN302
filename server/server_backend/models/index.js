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
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Kết thúc quá trình nếu có lỗi
  }
};

module.exports = db;
