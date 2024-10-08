import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import GroupColumn from '../Group_Components/GroupColumn'
import { FaPlus } from 'react-icons/fa'

function IndividualSpace() {
    return (
        <Container fluid className='vh-83'>
            
            <Row className='flex-nowrap mt-3 ms-2'>
                <Col md={3} className='mx-2 background-color-secondary'><GroupColumn /></Col>
                <Col md={3} className='mx-2 background-color-secondary'><GroupColumn /></Col>
                <Col md={3} className='mx-2 background-color-secondary'><GroupColumn /></Col>
                <Col md={3} className='mx-2 '>
                    <p className='p-2 background-color-third background-hover '><FaPlus/>     Add another list</p>
                </Col>
                
            </Row>
        </Container>
    )
}

export default IndividualSpace
