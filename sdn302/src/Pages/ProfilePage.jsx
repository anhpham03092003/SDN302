import React from 'react'
import styles from '../Styles/Profile/Profile.module.css';
import Header from '../Components/Home_components/Header';
import Footer from '../Components/Home_components/Footer';
import { Outlet } from 'react-router-dom';
function ProfilePage() {
  return (
    <div>
      <Header />
      <div className={styles.mainContainer}>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default ProfilePage