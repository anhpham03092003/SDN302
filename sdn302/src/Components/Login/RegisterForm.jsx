import React, { useState } from 'react';
import { FaUser, FaLock, FaEnvelope, FaIdBadge } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from '../../Styles/Login/Login.module.css';
import { Alert } from 'react-bootstrap';

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      const existingUser = await axios.get(`http://localhost:9999/users?username=${username}`);
      if (existingUser.data.length > 0) {
        setMessage('Username already exists');
        return;
      }

      const existingEmail = await axios.get(`http://localhost:9999/users?email=${email}`);
      if (existingEmail.data.length > 0) {
        setEmailError('The email has already been used!');
        return;
      }

      const newUserResponse = await axios.post('http://localhost:9999/users', {
        username,
        password,
        firstName,
        lastName,
        email,
        phone: '',
        role: 'user',
        banned: false
      });

      const newUser = newUserResponse.data;

      navigate('/home');
      console.log('Registration successful');
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  return (
    <div>
      <div className={styles.wapper}>
        <form onSubmit={handleRegister} className={styles.form}>
          <h1>Register</h1>
          {message && <p className={styles.message}>{message}</p>}
          {emailError && <Alert variant="danger">{emailError}</Alert>}
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
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={styles.formInput}
              required
            />
            <FaIdBadge className={styles.icon} />
          </div>
          <div className={styles.formGroup}>
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={styles.formInput}
              required
            />
            <FaIdBadge className={styles.icon} />
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
