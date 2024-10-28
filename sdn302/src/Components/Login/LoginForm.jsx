import React, { useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AppContext } from '../../Context/AppContext';
import { FaUser, FaLock } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import axios from 'axios';
import styles from '../../Styles/Login/Login.module.css';


function LoginForm() {
  const { authentication_API, setUser } = useContext(AppContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const login_API = `${authentication_API}/login`;
  //check token 
  const checkTokenExpiration = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const { exp } = jwtDecode(token);
      if (Date.now() >= exp * 1000) {
        localStorage.removeItem('token'); // Xóa token
        setMessage('Session expired, please log in again'); // Thông báo hết phiên đăng nhập
        setTimeout(() => {
          navigate('/login/loginForm'); // Điều hướng về trang đăng nhập sau 2 giây
        }, 2000);
      }
    }
  };

  useEffect(() => {
    checkTokenExpiration();
  }, []);

  const loginUser = async (username, password) => {
    try {
      const response = await axios.post(login_API, { username, password });
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      const result = await loginUser(username, password);
      if (result.token) {
        // Đẩy token lên local storage
        localStorage.setItem('token', result.token);

        // Lấy thông tin người dùng và cập nhật
        const userResponse = await axios.get(`${authentication_API}/get-user`, {
          headers: { Authorization: `Bearer ${result.token}` }
        });
        setUser(userResponse.data); // Cập nhật thông tin người dùng 
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
