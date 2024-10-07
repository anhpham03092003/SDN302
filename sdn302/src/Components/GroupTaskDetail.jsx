import React from 'react'
import { Button, Col, Container, Dropdown, Modal, Row } from 'react-bootstrap'
import { FaList } from 'react-icons/fa'
import { IoMenu } from 'react-icons/io5'
import GroupSubTask from './GroupSubTask'
import { IoMdMenu } from 'react-icons/io'

function GroupTaskDetail({show,setShow}) {
    return (
        <Modal
            show={show}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered

        >
            <Modal.Header closeButton onHide={()=>{setShow(false)}}>
                <Modal.Title id="contained-modal-title-vcenter">
                    Task Name
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='vh-83 overflow-auto'>
                <Container>
                    <Row className='d-flex justify-content-between'>
                        <Col md={8}>
                            <Row className='mb-3'>
                                <p>in the <strong className='text-success'>TODO</strong></p>
                            </Row>
                            <Row className='mb-3'>
                                <h5 className='mb-3'><IoMdMenu /> Description</h5>
                                <textarea name='description' rows={4} cols={100} placeholder='...Add a description' className='ms-4 border border-secondary-subtle' required>

                                </textarea>

                            </Row>
                            <Row className='mb-3'>
                                <h5 className='mb-3'><FaList /> SubTask</h5>
                                <Row className='ms-4'>
                                    <Col md={12}><GroupSubTask /></Col>
                                    <Col md={12}><GroupSubTask /></Col>
                                    <Col md={12}><GroupSubTask /></Col>

                                </Row>
                            </Row>

                            <Row className='mb-3'>
                                <h5 className='mb-3'><FaList /> Comments</h5>
                                <textarea name='comments' rows={4} cols={100} placeholder='...Add a description' className='ms-4 border border-secondary-subtle'>

                                </textarea>
                            </Row>
                        </Col>
                        <Col md={3}>
                            <Row className='text-center my-2'>
                                <Dropdown >
                                    <Dropdown.Toggle id="dropdown-custom-1" className=' text-dark py-3 mx-1 w-100 rounded-0  border-0 textt-dark background-hover background-color-third'>
                                        <strong>In Progress</strong>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu >
                                        <Dropdown.Header>Columns list</Dropdown.Header>
                                        <Dropdown.Item eventKey="1">Not Started</Dropdown.Item>
                                        <Dropdown.Item eventKey="2">In Progress</Dropdown.Item>
                                        <Dropdown.Item eventKey="3">Completed</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Row>
                            <Row className='text-center my-2'>
                                <Dropdown >
                                    <Dropdown.Toggle id="dropdown-custom-1" className=' text-dark py-3 mx-1 w-100 rounded-0  border-0 textt-dark background-hover background-color-third'>
                                        <strong>Unassigned</strong>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu >
                                        <Dropdown.Header>Members list</Dropdown.Header>
                                        <Dropdown.Item eventKey="1">TriNM</Dropdown.Item>
                                        <Dropdown.Item eventKey="2">HaoTH</Dropdown.Item>
                                        <Dropdown.Item eventKey="3">...</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Row>
                            
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    )
}

export default GroupTaskDetail
