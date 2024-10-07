import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { FaAngleLeft,FaBell, FaAngleRight, FaLayerGroup, FaPlus, FaUser } from 'react-icons/fa'
import { FaGear, FaUserGroup } from "react-icons/fa6"
import { MdSpaceDashboard } from "react-icons/md";
function AdminSideBar() {
    return (
        <div>
            <Row className='vh-12  '>
            
            </Row>
          
            <Row className='py-2 sidebar-items'>
                <Col className='align-content-center text-start' md={2}><FaGear/></Col>
                <Col className='align-content-center text-start' md={10}>
                    <p className='m-2'>Setting</p>
                </Col>
            </Row>
            <Row className='py-2 sidebar-items'>
                <Col className='align-content-center text-start' md={2}><FaBell/></Col>
                <Col className='align-content-center text-start' md={10}>
                    <p className='m-2'> Notifications</p>
                </Col>
            </Row>
            <Row className='py-2 sidebar-items'>
                <Col className='align-content-center text-start' md={2}><MdSpaceDashboard/></Col>
                <Col className='align-content-center text-start' md={10}>
                    <p className='m-2'> Dashboard</p>
                </Col >
            </Row>
            <Row className='py-2 sidebar-items'>
                <Col className='align-content-center text-start' md={2}><FaUser/></Col>
                <Col className='align-content-center text-start' md={10}>
                    <p className='m-2'> User Management</p>
                </Col>
            </Row>
         
            
        </div>
    )
}

export default AdminSideBar
