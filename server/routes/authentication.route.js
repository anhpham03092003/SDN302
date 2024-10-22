const express = require("express");
const authRouter = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt"); // hash pass
const db = require("../models/index");

authRouter.use(bodyParser.json());

authRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await db.Users.findOne({ "account.email": email });
        if (!user) {
            return res.status(404).json({ status: "User not found!" });
        }

        const isMatch = await bcrypt.compare(password, user.account.password);
        if (!isMatch) {
            return res.status(401).json({ status: "Invalid password!" });
        }

        res.json({ status: "Login successful!", user });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ status: "Something went wrong!", error: error.message });
    }
});


authRouter.post("/register", async (req, res, next) => {
    try {
        const { username, email, password, phoneNumber } = req.body;
        if (!username || !email || !password || !phoneNumber) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // check duplicate email
        const existingUser = await db.Users.findOne({ "account.email": email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already in use" });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new db.Users({
            username,
            account: {
                email,
                password: hashedPassword,
            },
            profile: {
                phoneNumber,
            }
        });

        await newUser.save().then((data) => {
            res.status(201).json({ message: "User registered successfully", user: data });
        });

    } catch (error) {
        next(error);
    }
});

authRouter.post("/forgot-password", async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const user = await db.Users.findOne({ "account.email": email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        next(error);
    }
});

module.exports = authRouter;
