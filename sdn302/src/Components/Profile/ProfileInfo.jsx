import React from 'react'
import { FaAddressCard, FaUser, FaPhone } from 'react-icons/fa';
import { IoMail } from 'react-icons/io5';
import { Table, Button } from 'react-bootstrap';
import styles from '../../Styles/Profile/Profile.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
function ProfileInfo() {
  return (
    <div><div>
    <h2>User Profile</h2>
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th colSpan={2} style={{ fontSize: '1.3em', color: '#0F67B1' }}><FaUser /> User Information</th>
          </tr>
        </thead>
        <tbody>
        <tr>
            <td><strong>Firstname:</strong></td>
            <td>John</td>
          </tr>
          <tr>
            <td><strong>Lastname:</strong></td>
            <td>Doe</td>
          </tr>
          <tr>
            <td><strong>Username:</strong></td>
            <td>example_username</td>
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
            <td>john.doe@example.com</td>
          </tr>
          <tr>
            <td><strong><FaPhone /> Phone:</strong></td>
            <td>+123456789</td>
          </tr>
        </tbody>
      </Table>

      <div style={{ marginTop: '10px' }}>
        <Button variant="primary" style={{ marginRight: 5 }}>Edit Profile</Button>
        <Button variant="primary" style={{ marginRight: 5 }}>ChangePassword</Button>
        <Button variant="secondary">Back to Home</Button>
      </div>
    </div>
  </div></div>
  )
}

export default ProfileInfo