const JWT = require('jsonwebtoken');
const createError = require('http-errors');
const morgan = require("morgan");
const bcrypt = require('bcrypt');
const db = require('../models');

async function isInGroup(req, res, next) {
    try {
        const { groupId } = req.params;
        const { id } = req.payload;

        const groupMember = await db.Users.findOne({ _id: id, groups: { $in: groupId } });

        if (!groupMember) {
            // throw createError.Unauthorized("The user is not in group")
            return res.status(400).json({ error: { status: 400, message: "The user is not in group" } })
            return res.status(400).json({ error: { status: 400, message: "The user is not in group" } })


        }
        console.log(groupMember);
        next();
    } catch (error) {
        next(error)
    }
}



async function isNotViewer(req, res, next) {
    try {
        const { groupId } = req.params;
        const { id } = req.payload;
        if (!id) {
            // throw createError.NotFound("Not found Id")
            return res.status(404).json({ error: { status: 404, message: "Not found Id" } })

        }
        const group = await db.Groups.findOne({ _id: groupId });

        if (group.members.find(m => m._id == id).groupRole == "viewer") {
            // throw createError.Unauthorized("Group viewer can not edit")
            return res.status(400).json({ error: { status: 400, message: "Group viewer can not edit" } })

        }
        next();
        return;
    } catch (error) {
        next(error)
    }
}

async function isMember(req, res, next) {
    try {
        const { groupId } = req.params;
        const { id } = req.payload;
        const group = await db.Groups.findOne({ _id: groupId });

        if (group.members.find(m => m._id == id).groupRole != "member") {
            // throw createError.Unauthorized("The user is not group member")
            return res.status(400).json({ error: { status: 400, message: "The user is not group member" } })
        }
        next();
        return;
    } catch (error) {
        next(error)
    }
}

async function isOwner(req, res, next) {
    try {
        const { groupId } = req.params;
        const { id } = req.payload;
        const group = await db.Groups.findOne({ _id: groupId });

        if (group.members.find(m => m._id == id).groupRole != "owner") {
            // throw createError.Unauthorized("The user is not group owner")
            return res.status(400).json({ error: { status: 400, message: "The user is not group owner" } })

        }
        next();
        return;
    } catch (error) {
        next(error)
    }
}

async function overBasicFunction(req, res, next) {
    try {
        const { groupId } = req.params;
        const group = await db.Groups.findOne({ _id: groupId });
        const isPremium = group.isPremium;
        if (isPremium == false) {
            if (group.classifications.length >= 5) {
                // throw createError[400]("You must upgrade group to create more column task!")
                return res.status(400).json({ error: { status: 400, message: "You must upgrade group to create more column task!" } })

            }
            if (group.members.length >= 5) {
                // throw createError[400]("You must upgrade group to invite more member!")
                return res.status(400).json({ error: { status: 400, message: "You must upgrade group to invite more member!" } })

            }
            // if(req.body){
            //     req.body.assignee =""
            //     req.body.priority =""
            //     req.body.status=""
            //     // throw createError[400]("You must upgrade group to unlock this function!")
            // return res.status(400).json({ error: { status: 400, message: "You must upgrade group to unlock functions!" } })
            // }
            // next();
            // return;

        }

        next();
        return;
    } catch (error) {
        next(error)
    }
}

async function restrictFunction(req, res, next) {
    try {
        const { groupId } = req.params;
        const group = await db.Groups.findOne({ _id: groupId });
        const isPremium = group.isPremium;
        if (isPremium == false) {
            req.body.assignee = ""
            req.body.priority = ""
            req.body.status = ""
            // throw createError[400]("You must upgrade group to unlock this function!")
            return res.status(400).json({ error: { status: 400, message: "You must upgrade group to unlock functions!" } })


        }

        next();
    } catch (error) {
        next(error);
    }
}



module.exports = {
    isInGroup,
    isMember,
    isOwner,
    isNotViewer,
    overBasicFunction,
    restrictFunction
}