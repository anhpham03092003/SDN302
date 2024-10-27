import React, { useState, useEffect } from 'react'
import { FaAddressCard, FaUser, FaPhone } from 'react-icons/fa';
import { IoMail } from 'react-icons/io5';
import { Table, Button } from 'react-bootstrap';
import styles from '../../Styles/Profile/Profile.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditProfile() {
  const [userInfo, setUserInfo] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const fetchUserInfo = async () => {
        try {
          const response = await axios.get('http://localhost:9999/users/get-profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserInfo(response.data);
        } catch (error) {
          console.error('Error fetching user information:', error);
        }
      };
      fetchUserInfo();
    }
  }, [token]);


  const handleSaveChanges = async (event) => {
    event.preventDefault();

    const username = event.target.username.value;
    const email = event.target.email.value;
    const phoneNumber = event.target.phone.value;

    console.log('Data to be sent:', { username, email, phoneNumber });

    try {
        const response = await axios.put('http://localhost:9999/users/update-profile', {
            username,
            email,
            phoneNumber,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
        navigate('/profile/profileInfo');
        alert('User information updated successfully.');
        console.log('Response from API:', response.data);
    } catch (error) {
        console.error('Error updating user information:', error.response ? error.response.data : error);
    }
};


  return (
    <div>
      <h2>Edit User Profile</h2>
      <form onSubmit={handleSaveChanges}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th colSpan={2} style={{ fontSize: '1.3em', color: '#0F67B1' }}><FaUser /> User Information</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Username:</strong></td>
              <td>
                <input
                  type="text"
                  name="username"
                  defaultValue={userInfo ? userInfo.username : ''}
                  className={styles.inputField}

                />
              </td>
            </tr>
          </tbody>
        </Table>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th colSpan={2} style={{ fontSize: '1.3em', color: '#0F67B1' }}><FaAddressCard /> Contact</th>
            </tr>
          </thead>
          <tbody>

            <tr>
              <td><strong><IoMail /> Email:</strong></td>
              <td>
                <input
                  type="email"
                  name="email"
                  defaultValue={userInfo ? userInfo.account.email : ''}
                  className={styles.inputField}

                />
              </td>
            </tr>
            <tr>
              <td><strong><FaPhone /> Phone:</strong></td>
              <td>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={userInfo ? userInfo.profile.phoneNumber : ''}
                  className={styles.inputField}
                />
              </td>
            </tr>
          </tbody>
        </Table>

        <div style={{ marginTop: '10px' }}>
          <Button variant="primary" type='submit' style={{ marginRight: 5 }}>Save</Button>
          <Button variant="secondary" style={{ marginRight: 5 }} type='reset'>Clear</Button>
        </div>
      </form>
    </div>
  )
}

export default EditProfile