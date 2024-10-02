import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import { FaLock, FaUsers, FaArrowRight, FaTruck, FaGlobe, FaHeart, FaRegClock, FaClipboardCheck } from "react-icons/fa";
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import FAQ from './FAQ';
import styles from '../../Styles/Home_css/Layout.module.css';

function Layout() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`http://localhost:9999/tokens?token=${token}`)
        .then(response => response.json())
        .then(data => {
          if (data.length > 0) {
            const userId = data[0].userId;
            fetch(`http://localhost:9999/users/${userId}`)
              .then(response => response.json())
              .then(userData => {
                setUser(userData);
              });
          }
        });
    }
  }, []);

  return (
    <div>
      <Header user={user} setUser={setUser} />
      <Container className={styles.firstContainer}>
        <Carousel className={styles.carousel}>
          <Carousel.Item>
            <img className="d-block w-100" src="../images/background_3.jpeg" alt="First slide" />
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" src="../images/background_4.jpeg" alt="Second slide" />
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" src="../images/background_5.jpg" alt="Third slide" />
          </Carousel.Item>
        </Carousel>

        <h2 className={styles.title}>Why should you use COLOHURI?</h2>

        <div className={styles.cardContainer}>
          <div className={styles.cardRow}>
            <div className={styles.card}>
              <FaLock className={styles.cardIcon} />
              <p>Replace all your current work management solutions</p>
            </div>
            <div className={styles.card}>
              <FaUsers className={styles.cardIcon} />
              <p>Unlimited users</p>
            </div>
            <div className={styles.card}>
              <FaArrowRight className={styles.cardIcon} />
              <p>Easy to use</p>
            </div>
            <div className={styles.card}>
              <FaTruck className={styles.cardIcon} />
              <p>Predictable costs, no per user pricing</p>
            </div>
            <div className={styles.card}>
              <FaGlobe className={styles.cardIcon} />
              <p>Used, loved and trusted by over 10 teams</p>
            </div>
          </div>
        </div>

        <div className={styles.freeRegister}>
          <Link to="/login/registerForm" className={`btn ${styles.freeRegisterButton}`}>
            Free Register
          </Link>
        </div>

        <div className={styles.smallCardContainer}>
          <div className={styles.smallCard}>
            <FaRegClock className={styles.smallCardIcon} /> {/* Icon đồng hồ */}
            <p>Just few minutes</p>
          </div>
          <div className={styles.smallCard}>
            <FaClipboardCheck className={styles.smallCardIcon} /> {/* Icon kết thúc công việc */}
            <p>Work is carefully recorded</p>
          </div>
          <div className={styles.smallCard}>
            <FaHeart className={styles.smallCardIcon} /> {/* Icon like */}
            <p>The best way to get started with Colohuri</p>
          </div>
        </div>


      </Container>
      <Footer />
    </div>
  );
}

export default Layout;
