import React from 'react'
import { FaAddressCard, FaUser, FaPhone } from 'react-icons/fa';
import { IoMail } from 'react-icons/io5';
import { Table, Button } from 'react-bootstrap';
import styles from '../../Styles/Profile/Profile.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
function EditProfile() {
  return (
    <div>
      <h2>Edit User Profile</h2>
      <form>
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
                  defaultValue="example_username" 
                  className={styles.inputField} 
                />
              </td>
            </tr>
            <tr>
              <td><strong>Firstname:</strong></td>
              <td>
                <input 
                  type="text" 
                  name="firstName" 
                  defaultValue="John" 
                  className={styles.inputField} 
                />
              </td>
            </tr>
            <tr>
              <td><strong>Lastname:</strong></td>
              <td>
                <input 
                  type="text" 
                  name="lastName" 
                  defaultValue="Doe" 
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
                  defaultValue="john.doe@example.com" 
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
                  defaultValue="+123456789" 
                  className={styles.inputField} 
                />
              </td>
            </tr>
          </tbody>
        </Table>

        <div style={{ marginTop: '10px' }}>
          <Link to="/profile/profileinfo"><Button variant="primary" style={{ marginRight: 5 }}>Save</Button></Link>
          <Button variant="secondary" style={{ marginRight: 5 }} type='reset'>Clear</Button>
        </div>
      </form>
    </div>
  )
}

export default EditProfile