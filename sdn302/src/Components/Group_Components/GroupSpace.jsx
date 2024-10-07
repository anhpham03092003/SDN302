import React, { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import GroupColumn from './GroupColumn'
import { FaPlus } from 'react-icons/fa'
import { IoCheckmark } from 'react-icons/io5'
import { IoMdClose } from 'react-icons/io'

function GroupSpace() {
    const [addColumn, setAddColumn] = useState(false)
    return (
        <Container fluid className='overflow-auto vh-83'>

            <Row className='flex-nowrap mt-3 ms-2'>
                <Col md={3} className='mx-2 background-color-secondary'><GroupColumn /></Col>
                <Col md={3} className='mx-2 background-color-secondary'><GroupColumn /></Col>
                <Col md={3} className='mx-2 background-color-secondary'><GroupColumn /></Col>
                <Col md={3} className='mx-2 '>
                    {addColumn == false ? <p className='m-0 p-2 background-color-third background-hover' onClick={() => setAddColumn(true)}><FaPlus />  Add another list</p> :
                        <Row className='d-flex rounded p-2 justify-content-between background-color-third shadow'>
                            <Col md={8}><input type="text" name='columnName' className='w-100' required/></Col>
                            <Col md={2} className='background-hover bg-white  border border-1 border-black' onClick={() => { setAddColumn(false) }}><IoCheckmark /></Col>
                            <Col md={2} className='background-hover bg-white  border border-1 border-black' onClick={() => { setAddColumn(false) }}><IoMdClose /></Col>

                        </Row>}
                </Col>

            </Row>
        </Container>
    )
}

export default GroupSpace
