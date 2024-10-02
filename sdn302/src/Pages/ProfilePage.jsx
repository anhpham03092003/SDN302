import React from 'react'
import styles from '../../Styles/Profile/Profile.module.css';
import ProfileInfo from '../Components/Profile/ProfileInfo';
function ProfilePage() {
  return (
    <div>
      {/* <Header /> */}
      <div className={styles.mainContainer}>
        <ProfileInfo />
        
      </div>
      {/* <Footer /> */}
    </div>
  )
}

export default ProfilePage