import React from 'react'
import styles from '../Styles/Profile/Profile.module.css';
import Footer from '../Components/Home_components/Footer';
import { Outlet } from 'react-router-dom';
function ProfilePage() {
  return (
    <div>
      <div className={styles.mainContainer}>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default ProfilePage