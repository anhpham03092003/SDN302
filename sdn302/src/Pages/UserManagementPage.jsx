import React from "react";
import AdminSideBar from '../Components/Admin_Components/AdminSideBar';
import UserManagement from '../Components/Admin_Components/UserManagement';
import Header from '../Components/Header';
import { Container, Row, Col } from 'react-bootstrap'
import '../App.css';

function UserManagementPage() {
    return (
        <div className="App">
  
      <Container fluid>
        <Row>
          <Col md={2} className='background-color-secondary vh-95'><AdminSideBar/></Col>
          <Col md={10} className=''>
            {/* <Row className='group-header background-color-third vh-12'>

            </Row> */}
            <Row>
              <UserManagement/>
             
            </Row>
          </Col>
        </Row>
      </Container>
        </div>
    );
}

export default UserManagementPage;