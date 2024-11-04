import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { FaBell, FaCog, FaUser } from 'react-icons/fa';
import { MdSpaceDashboard } from 'react-icons/md';
import { Link } from 'react-router-dom';

function AdminSideBar() {
    return (
        <div>
            <Row className='vh-12'></Row>
          
            <Row className='py-2 background-hover'>
                <Col className='align-content-center text-start' md={2}>
                    <FaBell/>
                </Col>
                <Col className='align-content-center text-start' md={10}>
                    <p className='m-0'>
                        <Link to="/notifications" className='text-decoration-none text-dark'>Notifications</Link>
                    </p>
                </Col>
            </Row>

            <Row className='py-2 background-hover'>
                <Col className='align-content-center text-start' md={2}>
                    <MdSpaceDashboard/>
                </Col>
                <Col className='align-content-center text-start' md={10}>
                    <p className='m-0'>
                        <Link to="/admin/dashboard" className='text-decoration-none text-dark'>Dashboard</Link>
                    </p>
                </Col>
            </Row>

            <Row className='py-2 background-hover'>
                <Col className='align-content-center text-start' md={2}>
                    <FaUser/>
                </Col>
                <Col className='align-content-center text-start' md={10}>
                    <p className='m-0'>
                        <Link to="/admin/userManagement" className='text-decoration-none text-dark'>User Management</Link>
                    </p>
                </Col>
            </Row>
        </div>
    );
}

export default AdminSideBar;
