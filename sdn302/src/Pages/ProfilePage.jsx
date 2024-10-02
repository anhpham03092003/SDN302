import React from 'react'
import styles from '../../Styles/Profile/Profile.module.css';
function ProfilePage() {
  return (
    <div>
      {/* <Header /> */}
      <div className={styles.mainContainer}>
        <UserProfile />
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default ProfilePage