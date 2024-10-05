import React, { useEffect, useState } from 'react';
// import Header from '../Components/Todo_components/Header2';
// import Footer from '../Components/Home_components/Footer';
import { Outlet } from 'react-router-dom';
// import styles from '../styles/Todo_css/Todo.module.css';

function Admin() {
  // const [user, setUser] = useState(null);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     fetch(`http://localhost:9999/tokens?token=${token}`)
  //       .then(response => response.json())
  //       .then(data => {
  //         if (data.length > 0) {
  //           const userId = data[0].userId;
  //           fetch(`http://localhost:9999/users/${userId}`)
  //             .then(response => response.json())
  //             .then(userData => {
  //               setUser(userData);
  //               setLoading(false);
  //             });
  //         } else {
  //           setLoading(false);
  //         }
  //       });
  //   } else {
  //     setLoading(false);
  //   }
  // }, []);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div>
      {/* <Header user={user} /> */}
      <div>
        <Outlet />
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default Admin;
