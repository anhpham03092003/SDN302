import React from "react";
import { useLocation } from "react-router-dom";
import styles from '../../Styles/Profile/Forgot.module.css'; // Import CSS module

export default function Reset() {
  const location = useLocation();
  const { email } = location.state || {};

  const changePassword = () => {
    alert(`Password changed for ${email}`);
  };

  return (
    <div className={styles.login_bg}>
      <div className={styles.wapper}>
        <h1>Change Password</h1>
        <form>
          <div className={styles.formGroup}>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="New Password"
            />
            <span className={styles.icon}>🔒</span>
          </div>

          <div className={styles.formGroup}>
            <input
              type="password"
              name="confirm-password"
              id="confirm-password"
              placeholder="Confirm Password"
            />
            <span className={styles.icon}>🔒</span>
          </div>

          <button className={styles.formButton} onClick={changePassword}>
            Save Password
          </button>
        </form>
      </div>
    </div>
  );
}
