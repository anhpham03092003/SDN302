import React from 'react'
import styles from '../../Styles/Login/login.module.css';
import { Outlet } from 'react-router-dom'
function Login() {
  return (
    <div className={styles.login_bg}>
      <Outlet />
    </div>
  )
}

export default Login