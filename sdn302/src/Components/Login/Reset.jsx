import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from '../../Styles/Login/Forgot.module.css';
import { AppContext } from '../../Context/AppContext';

export default function Reset() {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};
  const { resetPassword } = useContext(AppContext); // Sử dụng context
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const changePassword = async (e) => {
    e.preventDefault(); // Ngăn chặn reload trang

    // Lấy ID và token từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const token = urlParams.get('token');

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await resetPassword(id, token, password, confirmPassword);
      alert(response.status);
      if (response.status === "Password change successful!") {
        navigate('/login'); // Điều hướng đến trang login
      }
    } catch (error) {
      setError("An error occurred while resetting the password.");
    }
  };

  return (
    <div className={styles.login_bg}>
      <div className={styles.wapper}>
        <h1>Change Password</h1>
        <form onSubmit={changePassword}>
          <div className={styles.formGroup}>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className={styles.icon}>🔒</span>
          </div>

          <div className={styles.formGroup}>
            <input
              type="password"
              name="confirm-password"
              id="confirm-password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span className={styles.icon}>🔒</span>
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button className={styles.formButton} type="submit">
            Save Password
          </button>
        </form>
      </div>
    </div>
  );
}
