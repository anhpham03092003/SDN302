// Footer.jsx
import React from 'react';
import styles from '../../Styles/Home_css/Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer_info}>
        <div className={styles.footer_width}>
          <h3>About</h3>
          <p className={styles.about_p}>
            Welcome to Colohuri! Stay organized, boost productivity, and conquer your day with our intuitive to-do list app.
            Add tasks, set deadlines, and track your progress effortlessly. Let’s get things done together!
          </p>
        </div>
        <div className={`${styles.footer_width} ${styles.group_info}`}>
          <h3>Services</h3>
          <p><strong>Todo list</strong></p>
          <p><strong>Group Creation</strong></p>
          <p><strong>Feedback</strong></p>
        </div>
        <div className={styles.footer_width}>
          <h3>Contact</h3>
          <p><strong>Address:</strong> Hoa Lac, Hanoi, Vietnam</p>
          <p><strong>Phone:</strong> +84 123 456 789</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
