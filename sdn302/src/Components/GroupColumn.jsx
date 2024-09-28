import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { FaPlus } from 'react-icons/fa';
import { FaRegTrashCan } from 'react-icons/fa6';
import { IoMdMore } from "react-icons/io";
import GroupTask from './GroupTask';
function GroupColumn() {
    return (
        <Container fluid className='py-1'>
            <Row className='my-2'>
                <Col md={9} className='text-start'><p className='m-0'>Column Name</p></Col>
                <Col md={3} className='text-end item-hover'><IoMdMore/></Col>
            </Row>

            <Row className='my-2'>
                <GroupTask/>
            </Row>  
            <Row className='my-2'>
                <GroupTask/>
            </Row>

            <Row className='my-2'>
                <Col md={9} className='text-start background-hover p-1'><p className='m-0'> <FaPlus/>  Create task</p></Col>
                <Col md={3} className='text-end'><FaRegTrashCan className='item-hover' /></Col>
            </Row>
        </Container>
    )
}

export default GroupColumn
