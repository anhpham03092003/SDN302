const express = require("express");
const authRouter = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt"); // hash pass
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
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


// gửi link reser
authRouter.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    try {
        const oldUser = await db.Users.findOne({ 'account.email': email });
        if (!oldUser) {
            return res.status(404).json({ status: "User Not Exists!!" });
        }

        const secret = process.env.JWT_SECRET + oldUser.account.password;
        const token = jwt.sign({ email: oldUser.account.email, id: oldUser._id }, secret, {
            expiresIn: "5m",
        });

        const link = `http://localhost:9999/authentication/reset-password/${oldUser._id}/${token}`;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset",
            text: `Click this link to reset your password: ${link}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ status: "Error in sending email" });
            }
            console.log("Email sent: " + info.response);
            return res.json({ status: "Email sent, check your inbox!" });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "Something went wrong!" });
    }
});

//reset password
authRouter.post("/reset-password/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    const { password, confirmPassword } = req.body;

    try {
        if (password !== confirmPassword) {
            return res.status(400).json({ status: "Passwords do not match!" });
        }

        const oldUser = await User.findById(id);
        if (!oldUser) {
            return res.status(404).json({ status: "User Not Exists!!" });
        }

        const secret = process.env.JWT_SECRET + oldUser.account.password;
        const verify = jwt.verify(token, secret);

        const encryptedPassword = await bcrypt.hash(password, 10);
        await User.updateOne(
            { _id: id },
            { $set: { 'account.password': encryptedPassword } }
        );

        return res.json({ status: "Password reset successful!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "Something went wrong!" });
    }
});




module.exports = authRouter;
