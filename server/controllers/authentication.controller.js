const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const db = require("../models/index");

// Hàm gửi email
async function sendEmail(email, link) {
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
        subject: "Change your password",
        text: `Click this link to change your password: ${link}`,
    };

    return transporter.sendMail(mailOptions);
}

// Hàm đăng nhập
async function login(req, res) {
    const { username, password } = req.body;
    try {
        const user = await db.Users.findOne({ username });
        if (!user) {
            return res.status(404).json({ status: "User not found!" });
        }

        const isMatch = await bcrypt.compare(password, user.account.password);
        if (!isMatch) {
            return res.status(401).json({ status: "Invalid password!" });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ status: "Login successful!", user, token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: error.message });
    }
}

// Hàm đăng ký
async function register(req, res, next) {
    try {
        const { username, email, password, rePassword, phoneNumber } = req.body;
        if (!username || !email || !password || !rePassword || !phoneNumber) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== rePassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        const existingUser = await db.Users.findOne({ "account.email": email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already in use" });
        }

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

        await newUser.save();
        res.status(201).json({ message: "User registered successfully", user: newUser });

    } catch (error) {
        next(error);
    }
}

// Hàm quên mật khẩu
async function forgotPassword(req, res) {
    const { username, email } = req.body;
    try {
        const oldUser = await db.Users.findOne({ username, 'account.email': email });
        if (!oldUser) {
            return res.status(404).json({ status: "User or Email not found!" });
        }

        const secret = process.env.JWT_SECRET + oldUser.account.password;
        const token = jwt.sign({ email: oldUser.account.email, id: oldUser._id }, secret, {
            expiresIn: "10m",
        });

        const link = `http://localhost:9999/authentication/reset-password/${oldUser._id}/${token}`;

        await sendEmail(email, link);
        res.json({ status: "Email sent, check your inbox!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "Something went wrong!" });
    }
}

// Hàm đặt lại mật khẩu
async function resetPassword(req, res) {
    const { id, token } = req.params;
    const { password, confirmPassword } = req.body;

    try {
        if (password !== confirmPassword) {
            return res.status(400).json({ status: "Passwords do not match!" });
        }

        const oldUser = await db.Users.findById(id);
        if (!oldUser) {
            return res.status(404).json({ status: "User Not Exists!" });
        }

        const secret = process.env.JWT_SECRET + oldUser.account.password;
        jwt.verify(token, secret);

        const encryptedPassword = await bcrypt.hash(password, 10);
        await db.Users.updateOne(
            { _id: id },
            { $set: { 'account.password': encryptedPassword } }
        );

        res.json({ status: "Password change successful!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "Something went wrong!" });
    }
}

const authenticationController = {
    login,
    register,
    forgotPassword,
    resetPassword
};

module.exports = authenticationController

