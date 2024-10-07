import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AdminSideBar from '../Components/Admin_Components/AdminSideBar'; // Sidebar component
import Home from '../Components/Admin_Components/Dashboard'; // Main dashboard content
import '../App.css'; // Your general styles

function AdminDashboard() {
  return (
    <div className="App">
      <Container fluid>
        <Row>
          <Col md={2} className="background-color-secondary vh-95">
            <AdminSideBar />
          </Col>
          <Col md={10} className="">
            {/* Add Home (dashboard content) */}
            <Row>
              <Home />
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AdminDashboard;
