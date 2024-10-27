import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { FaCheckSquare, FaPen, FaRegCheckSquare } from 'react-icons/fa'

function GroupTask({task}) {
    return (
        <Container className='bg-white p-3 cursor-pointer shadow'>
            <Row>
                <Col md={9} className='text-start'><p className='m-0'>{task.taskName}</p></Col>
                <Col md={3} className='text-end'><FaPen className='item-hover'/></Col>
            </Row>
            <Row>
                <Col><p className='m-0 text-start'><FaRegCheckSquare/>   0/12</p></Col>

            </Row>
        </Container>
    )
}

export default GroupTask
