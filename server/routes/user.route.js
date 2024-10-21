const express = require("express");
const userRouter = express.Router();
const bodyParser = require("body-parser");

const db = require("../models/index");

userRouter.use(bodyParser.json());

userRouter.post("/add", async (req, res, next) => {
    try {
        const newUser = new db.Users(req.body);
        await newUser.save().then((data) => {
            res.status(200).json(data);
        });
        
    } catch (error) {
        next(error);
    }
})

module.exports = userRouter