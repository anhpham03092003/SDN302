import React, { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Alert } from 'react-bootstrap';
import styles from '../Styles/login.module.css';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(`http://localhost:9999/users?username=${username}&password=${password}`);
      if (response.data.length > 0) {
        const user = response.data[0];
        if (user.banned) {
          setMessage('Your account has been banned by admin!');
          return;
        }
        const tokenResponse = await axios.get(`http://localhost:9999/tokens?userId=${user.id}`);
        if (tokenResponse.data.length > 0) {
          const token = tokenResponse.data[0].token;
          localStorage.setItem('token', token);
          navigate('/home');
          console.log('Login Successfully');
        } else {
          setMessage('User not exist');
          console.log('User not exist');
        }
      } else {
        setMessage('Username or password is incorrect');
        console.log('Username or password is incorrect');
      }
    } catch (error) {
      setMessage('Login Failed');
      console.log('Login Failed');
    }
  };

  return (
    <div>
      <div className={styles.wapper}>
        <form onSubmit={handleLogin} className={styles.form}>
          <h1>Login</h1>
          {message && <Alert variant="danger" className={styles.message}>{message}</Alert>}
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
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.formInput}
              required
            />
            <FaLock className={styles.icon} />
          </div>
          <div className={styles.remember}>
            <label>
              <input type="checkbox" className={styles.rememberInput} />
              Remember me
            </label>
            <Link className={styles.forgot} to="/login/forgotPass">Forgot password</Link>
          </div>
          <button type="submit" className={styles.formButton}>
            Login
          </button>
          <div className={styles.register}>
            <p className={styles.registerLink}>
              Not a member? <Link to="/login/registerForm">Register</Link>
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

export default LoginForm;
