import React, { useState, useContext } from 'react';
import { FaUser } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import styles from '../../Styles/Login/Forgot.module.css';
import { AppContext } from '../../Context/AppContext'; // Import AppContext

export default function ForgotPass() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const { forgotPassword } = useContext(AppContext); // Sử dụng forgotPassword từ AppContext

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await forgotPassword(email, username); // Gọi hàm forgotPassword
            if (response) {
                setMessage('Recovery email sent successfully!'); // Thông báo thành công
            }
        } catch (error) {
            setMessage('Error sending recovery email. Please try again.'); // Thông báo lỗi
        }
    };

    return (
        <div className={styles.login_bg}>
            <div className={styles.wapper}>
                <h1>Forgot Password</h1>
                {message && <Alert variant="danger" className={styles.message}>{message}</Alert>}
                <form onSubmit={handleLogin} className={styles.form}>
                    <div className={styles.formGroup}>
                        <input
                            type="text"
                            placeholder="Username"
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
