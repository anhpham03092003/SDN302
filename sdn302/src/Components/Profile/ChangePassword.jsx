import React from 'react'
import { Table } from 'react-bootstrap';
import styles from '../../Styles/Profile/Profile.module.css';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function ChangePassword() {
  return (
    <div>
      <h2>Change Password</h2>
      <form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th colSpan={2} style={{ fontSize: '1.3em', color: '#0F67B1' }}>Change Password</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Old Password:</strong></td>
            <td>
              <input
                type="password"
                name="oldPassword"
                placeholder="Enter old password"
                className="inputField"
              />
            </td>
          </tr>
          <tr>
            <td><strong>New Password:</strong></td>
            <td>
              <input
                type="password"
                name="newPassword"
                placeholder="Enter new password"
                className="inputField"
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

export default ChangePassword