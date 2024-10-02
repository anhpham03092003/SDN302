import React, { useState, createContext, useContext } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Alert } from 'react-bootstrap';
import styles from '../../Styles/Profile/Forgot.module.css';

// Create a new context for OTP
const OTPContext = createContext();

export default function ForgotPass() {
    const [otp, setOTP] = useState(null); // Store OTP
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.get(`http://localhost:9999/users?username=${username}`);
            if (response.data.length > 0) {
                const user = response.data[0];
                if (user.banned) {
                    setMessage('Your account has been banned by admin!');
                    return;
                }
                // Check if email matches
                if (user.email === email) {
                    const OTP = Math.floor(Math.random() * 9000 + 1000);
                    setOTP(OTP);
                    await axios.post("http://localhost:5000/send_recovery_email", {
                        OTP,
                        recipient_email: user.email,
                    });
                    navigate("/otp", { state: { email: user.email, otp: OTP } });
                } else {
                    setMessage('Email does not match with username.');
                }
            } else {
                setMessage('User does not exist');
            }
        } catch (error) {
            setMessage('Something went wrong. Please try again.');
        }
    };
    return (
        <div className={styles.login_bg}> {/* Sử dụng class cho background */}
            <div className={styles.wapper}>
                <h1>Forgot Password</h1>
                {message && <Alert variant="danger" className={styles.message}>{message}</Alert>}
                <form onSubmit={handleLogin} className={styles.form}>
                    <div className={styles.formGroup}>
                        <input
                            type="text"
                            placeholder="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={styles.formInput}
                            required
                        />
                        <FaUser className={styles.icon} />
                    </div>
                    <div className={styles.formGroup}>
                        <input
                            type="email"
                            placeholder="Your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.formInput}
                            required
                        />
                        <FaUser className={styles.icon} />
                    </div>
                    <button type="submit" className={styles.formButton}>
                        Gửi Email
                    </button>
                    <div className={styles.register}>
                        <p className={styles.registerLink}>
                            Chưa có tài khoản? <Link to="/login/registerForm">Đăng ký</Link>
                        </p>
                        <p className={styles.registerLink}>
                            Quay lại đăng nhập? <Link to="/login/loginForm">Đăng nhập</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}