import React, { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from '../../Styles/Login/Forgot.module.css';
import { AppContext } from '../../Context/AppContext';
import axios from 'axios';

export default function Reset() {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const { authentication_API } = useContext(AppContext);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const changePassword = async (id, token, password, confirmPassword) => {
    try {
      const response = await axios.post(`${authentication_API}/reset-password/${id}/${token}`, { password, confirmPassword });
      return response.data; // Chỉ trả về data
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  }

  const changePasswordHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await changePassword(id, token, password, confirmPassword);
      // Kiểm tra response.data.status thay vì response.status
      if (response.status === "Password change successful!") {
        alert(response.status); // Hiện thông báo thành công
        navigate('/login/loginForm');
      } else {
        setError("Unexpected response structure"); // Xử lý trường hợp không thành công
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setError("An error occurred while resetting the password.");
    }
  };

  return (
    <div className={styles.login_bg}>
      <div className={styles.wapper}>
        <h1>Change Password</h1>
        <form onSubmit={changePasswordHandler}>
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
