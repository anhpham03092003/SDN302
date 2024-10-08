import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { FaBell, FaCog, FaUser } from 'react-icons/fa';
import { MdSpaceDashboard } from 'react-icons/md';
import { Link } from 'react-router-dom';

function AdminSideBar() {
    return (
        <div>
            <Row className='vh-12'></Row>
          
            <Row className='py-2 sidebar-items'>
                <Col className='align-content-center text-start' md={2}>
                    <FaCog/>
                </Col>
                <Col className='align-content-center text-start' md={10}>
                    <Link to="/settings" className='text-decoration-none'>
                        <p className='m-2'>Setting</p>
                    </Link>
                </Col>
            </Row>

            <Row className='py-2 sidebar-items'>
                <Col className='align-content-center text-start' md={2}>
                    <FaBell/>
                </Col>
                <Col className='align-content-center text-start' md={10}>
                    <Link to="/notifications" className='text-decoration-none'>
                        <p className='m-2'>Notifications</p>
                    </Link>
                </Col>
            </Row>

            <Row className='py-2 sidebar-items'>
                <Col className='align-content-center text-start' md={2}>
                    <MdSpaceDashboard/>
                </Col>
                <Col className='align-content-center text-start' md={10}>
                    <Link to="/admin/dashboard" className='text-decoration-none'>
                        <p className='m-2'>Dashboard</p>
                    </Link>
                </Col>
            </Row>

            <Row className='py-2 sidebar-items'>
                <Col className='align-content-center text-start' md={2}>
                    <FaUser/>
                </Col>
                <Col className='align-content-center text-start' md={10}>
                    <Link to="/admin/userManagement" className='text-decoration-none'>
                        <p className='m-2'>User Management</p>
                    </Link>
                </Col>
            </Row>
        </div>
    );
}

export default AdminSideBar;
