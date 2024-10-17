const mongoose = require("mongoose");

const db = {};

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
