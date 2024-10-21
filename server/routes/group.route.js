const express = require("express");
const groupRouter = express.Router();
const bodyParser = require("body-parser");

const db = require("../models/index");

groupRouter.use(bodyParser.json());

groupRouter.post("/add", async (req, res, next) => {
    try {
        const newGroup = new db.Groups(req.body);
        await newGroup.save().then((data) => {
            res.status(200).json(data);
        });
        
    } catch (error) {
        next(error);
    }
})

module.exports = groupRouter