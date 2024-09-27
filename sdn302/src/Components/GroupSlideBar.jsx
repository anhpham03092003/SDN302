import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { FaAngleLeft, FaAngleRight, FaLayerGroup, FaPlus } from 'react-icons/fa'

function GroupSlideBar() {
    return (
        <div>
            <Row className='py-2 border-2  border-bottom border-white'>
                <Col className='align-content-center text-start' md={3}><FaAngleLeft className='display-6' /></Col>
                <Col className='align-content-center text-start' md={9}>
                    <h4>Group Name</h4>
                    <p>Vip / Basic</p>
                </Col>
            </Row>
            <Row className='py-2'>
                <Col className='align-content-center text-start' md={3}></Col>
                <Col className='align-content-center text-start' md={9}>
                    <p className='m-0'>Workspace</p>
                </Col>
            </Row>
            <Row className='py-2'>
                <Col className='align-content-center text-start' md={3}><FaLayerGroup/></Col>
                <Col className='align-content-center text-start' md={9}>
                    <p className='m-0'> Manage User</p>
                </Col>
            </Row>
            <Row className='py-2'>
                <Col className='align-content-center text-start' md={3}><FaPlus/></Col>
                <Col className='align-content-center text-start' md={9}>
                    <p className='m-0'> Invite member</p>
                </Col>
            </Row>
        </div>
    )
}

export default GroupSlideBar
