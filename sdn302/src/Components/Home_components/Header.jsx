import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineTask } from "react-icons/md";
import { Button } from 'react-bootstrap';
import styles from '../../Styles/Home_css/Header.module.css';
import { VscFeedback } from "react-icons/vsc";
import { FaUserGear } from "react-icons/fa6";

function Header({ user, setUser }) {
  const [currentUser, setCurrentUser] = useState(user);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setUser(null);
    navigate('/home');
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link to={`/home`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className={styles.label}><MdOutlineTask size={50} />TASK SNAP</div>
        </Link>
        <div className={styles.userSection}>
          {currentUser ? (
            <>
              <div className={styles.actionButtons}>
                {(currentUser && currentUser.role === 'admin') && (
                  <Link to="/admin/userList" className={`btn btn-primary ${styles.button} ${styles.largeButton}`} style={{ backgroundColor: 'green', borderColor: 'green', marginRight: '10px' }}>
                    <FaUserGear className={styles.buttonIcon} /> Manage user
                  </Link>
                )}
                {(currentUser && currentUser.role === 'admin') && (
                  <Link to="/admin/feedbackList" className={`btn btn-primary ${styles.button} ${styles.largeButton}`} style={{ backgroundColor: 'green', borderColor: 'green' }}>
                    <VscFeedback className={styles.buttonIcon} /> Manage feedback
                  </Link>
                )}
              </div>
              <Link to={`/profile/${currentUser.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <span className={styles.userName}>{currentUser.firstName} {currentUser.lastName}</span>
              </Link>
              <Button onClick={handleLogout} variant="secondary" className={styles.logoutButton}>Logout</Button>
            </>
          ) : (
            <span className={styles.signInText}>Already have an account? <Link to="/login/loginForm" className={styles.signInLink}>Sign in</Link></span>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
