import React, { useState, useEffect } from 'react';
import { FaAddressCard, FaUser, FaPhone } from 'react-icons/fa';
import { IoMail } from 'react-icons/io5';
import { Table, Button } from 'react-bootstrap';
import styles from '../../Styles/Profile/Profile.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditProfile() {
  const [userInfo, setUserInfo] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageList, setShowImageList] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const imageList = [
    '/images/avatar/image1.jpg',
    '/images/avatar/image2.jpeg',
    '/images/avatar/image3.jpg',
    '/images/avatar/image4.jpg',
    '/images/avatar/image5.jpg',
    '/images/avatar/image6.jpg',
    '/images/avatar/image7.jpg',
    '/images/avatar/image8.jpg',
    '/images/avatar/imageDefault.jpg',
  ];

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
          setSelectedImage(response.data.profile.avatar || null); // Ensure we reference the correct avatar path
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

    // Create payload to send as JSON
    const payload = {
      username,
      email,
      phoneNumber,
      avatar: selectedImage, // URL of the image from `imageList`
    };

    try {
      const response = await axios.put('http://localhost:9999/users/update-profile', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // Send as JSON
        },
      });

      navigate('/profile/profileInfo');
      alert('User information updated successfully.');
    } catch (error) {
      console.error('Error updating user information:', error.response ? error.response.data : error);
    }
  };

  const handleImageSelect = (image) => {
    setSelectedImage(image); 
    setShowImageList(false);
  };

  const toggleImageList = () => {
    setShowImageList((prev) => !prev);
  };

  return (
    <div>
      <h2>Edit User Profile</h2>
      <form onSubmit={handleSaveChanges}>
        
        {/* Display selected avatar above the tables */}
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <h3>Select an Image:</h3>
          <div onClick={toggleImageList} style={{ cursor: 'pointer' }}>
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Selected Avatar"
                className={styles.avatarImage} // Use CSS class for styling
              />
            ) : (
              <Button variant="primary">Select Avatar</Button>
            )}
          </div>

          {/* List of images to choose from */}
          {showImageList && (
            <div className={styles.imageList}>
              {imageList.map((image, index) => (
                <div key={index} className={styles.imageItem}>
                  <img
                    src={image}
                    alt={`Image ${index + 1}`}
                    onClick={() => handleImageSelect(image)}
                    className={styles.imageItem} // Class for styling each image in the list
                    style={{
                      cursor: 'pointer',
                      border: selectedImage === image ? '2px solid #0F67B1' : 'none',
                      width: '100px',
                      height: '100px',
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

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
                  required
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
                  readOnly
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
                  required
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
  );
}

export default EditProfile;
