import React from 'react';
import { Table, Form, Button } from 'react-bootstrap';
import { MdOutlineSearch } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";

function UserManagement() {
    return (


     <div className='ms-1 mt-4  ' >

    <Form className='d-flex justify-content-end me-4 mb-2'>
        <Form.Group controlId="form" className='position-relative'>        
          <Form.Control 
            type="text" 
            placeholder="Search User"      
          />
          <MdOutlineSearch 
            style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)'}} 
          />
        </Form.Group>
        <Button className='ms-5' variant="primary">
          <FaPlus  className='me-2' style={{ position: 'relative', top: '25%', transform: 'translateY(-50%)'}} /> 
          Add User
        </Button>
      </Form>

    

    <Table striped bordered hover  >
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
          <tr>
            <td>John Doe</td>
            <td>john.doe@example.com</td>
            <td>Admin</td>
            <td>Active</td>
          </tr>
          <tr>
            <td>Jane Smith</td>
            <td>jane.smith@example.com</td>
            <td>User</td>
            <td>Inactive</td>
          </tr>
         
        </tbody>
    </Table>
     </div>

    );
}

export default UserManagement