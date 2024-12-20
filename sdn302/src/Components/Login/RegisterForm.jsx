import React, { useState, useContext } from 'react';
import axios from 'axios';
import { FaUser, FaLock, FaEnvelope, FaIdBadge } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../../Context/AppContext';
import styles from '../../Styles/Login/Login.module.css';
import { Alert } from 'react-bootstrap';

function RegisterForm() {
  const { authentication_API } = useContext(AppContext); // Sử dụng context
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [rePassword, setRePassword] = useState(''); // Trường rePassword
  const [phoneNumber, setPhoneNumber] = useState(''); // Thêm trường phoneNumber
  const [message, setMessage] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();

  const register_API = `${authentication_API}/register`;

  const registerUser = async (username, password, email, rePassword, phoneNumber) => {
    try {
      const response = await axios.post(register_API, { username, password, email, rePassword, phoneNumber });
      return response.data;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();


    if (username.length < 6 || username.includes(' ')) {
      setMessage("Username must be at least 6 characters and contain no spaces.");
      return;
    }
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }


    try {
      const response = await registerUser(username, password, email, rePassword, phoneNumber);


      setAlertMessage("A verification email has been sent. Please check your inbox.");
      setTimeout(() => {
        navigate('/login/loginForm');
      }, 3000);
    } catch (error) {
      console.error('Registration failed', error);
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      }
    }
  };



  return (
    <div>
      <div className={styles.wapper}>
        <form onSubmit={handleRegister} className={styles.form}>
          <h1>Register</h1>
          {message && <p className={styles.message}>{message}</p>}
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
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.formInput}
              required
            />
            <FaEnvelope className={styles.icon} />
          </div>
          <div className={styles.formGroup}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.formInput}
              required
            />
            <FaLock className={styles.icon} />
          </div>
          <div className={styles.formGroup}>
            <input
              type="password"
              placeholder="Re-Password"
              value={rePassword} // Trường rePassword
              onChange={(e) => setRePassword(e.target.value)}
              className={styles.formInput}
              required
            />
            <FaLock className={styles.icon} />
          </div>
          <div className={styles.formGroup}>
            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber} // Trường phoneNumber
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={styles.formInput}
              required
            />
            <FaIdBadge className={styles.icon} />
          </div>
          <button type="submit" className={styles.formButton}>
            Create a new account
          </button>
          <div className={styles.register}>
            <p className={styles.registerLink}>
              Back to login? <Link to="/login/loginForm">Login</Link>
            </p>
            <p className={styles.registerLink}>
              Back to home page? <Link to="/home">Home</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
