import React, { useContext, useState } from 'react';
import { AppContext } from '../../Context/AppContext';
import { FaUser, FaLock } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import styles from '../../Styles/Login/Login.module.css';

function LoginForm() {
  const { loginUser } = useContext(AppContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await loginUser(username, password);
      if (result.token) {
        // Đẩy token lên local storage
        localStorage.setItem('token', result.token);
        navigate('/home');
        console.log('Login Successfully');
      } else {
        setMessage('Login failed');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.status == "Please verify your account!") {
          setMessage("Please verify your account! Check your email for the verification link.");
        } else {
          setMessage('Username or password is incorrect');
        }
      } else {
        setMessage('An unexpected error occurred');
      }
      console.log('Login Failed:', error);
    }
  };

  return (
    <div>
      <div className={styles.wapper}>
        <form onSubmit={onSubmit} className={styles.form}>
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
