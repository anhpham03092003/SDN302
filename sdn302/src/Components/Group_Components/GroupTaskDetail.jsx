import React, { useContext } from 'react'
import { Button, Col, Container, Dropdown, Modal, Row } from 'react-bootstrap'
import { FaList } from 'react-icons/fa'
import { IoMenu } from 'react-icons/io5'
import GroupSubTask from './GroupSubTask'
import { IoMdMenu } from 'react-icons/io'
import { AppContext } from '../../Context/AppContext'
import axios from 'axios'
import { useParams } from 'react-router-dom'

function GroupTaskDetail() {
    const {groupId}=  useParams();
    const { show, setShow, selectedTask, setSelectedTask, groups_API, group, setGroup, accessToken } = useContext(AppContext)
    const handleDelete = async () => {
            if (window.confirm("Remove this task?")) {
                await axios.delete(`${groups_API}/${groupId}/tasks/${selectedTask._id}/delete`, { headers: { Authorization: `Bearer ${accessToken}` } })
                    .then((res) => {
                        const updatedTasks = group?.tasks?.filter((t)=>{
                            return t._id != selectedTask._id
                        })

                        setGroup({...group,tasks:[...updatedTasks]}); 
                        setSelectedTask();
                        setShow(false)
                    })
                    .catch((err) => console.error(err));
            }
        }
    
    return (
        <Modal
            show={show}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered

        >
            <Modal.Header closeButton onHide={() => { setShow(false) }}>
                <Modal.Title id="contained-modal-title-vcenter">
                    {selectedTask?.taskName}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='vh-83 overflow-auto'>
                <Container>
                    <Row className='d-flex justify-content-between'>
                        <Col md={8}>
                            <Row className='mb-3'>
                                <Col md={8} className='align-content-center'><p className='m-0'>in the <strong className='text-success '>{selectedTask?.status.toUpperCase()}</strong></p></Col>
                                <Col md={2} className='text-end'>
                                    <Dropdown >
                                        <Dropdown.Toggle id="dropdown-custom-1" className=' text-dark  mx-1 rounded-0  border-0 textt-dark background-hover background-color-third'>
                                            <strong>Deadline</strong>
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu >
                                            <Dropdown.Header><input type='date' /> </Dropdown.Header>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Col>
                                <Col md={2} className='text-end'>
                                    <Dropdown >
                                        <Dropdown.Toggle id="dropdown-custom-1" className=' text-dark  mx-1 rounded-0  border-0 textt-dark background-hover background-color-third'>
                                            <strong>{selectedTask?.status.toUpperCase()}</strong>
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu >
                                            <Dropdown.Header>Columns list</Dropdown.Header>
                                            <Dropdown.Item eventKey="1">Not Started</Dropdown.Item>
                                            <Dropdown.Item eventKey="2">In Progress</Dropdown.Item>
                                            <Dropdown.Item eventKey="3">Completed</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Col>

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
                                    <Col md={12}><GroupSubTask /></Col>
                                    <Col md={12}><GroupSubTask /></Col>
                                    <Col md={12}><GroupSubTask /></Col>
                                    <Col md={12}><GroupSubTask /></Col>
                                    <Col md={12}><GroupSubTask /></Col>
                                    <Col md={12}><GroupSubTask /></Col>
                                    <Col md={12}><GroupSubTask /></Col>
                                    <Col md={12}><GroupSubTask /></Col>
                                    <Col md={12}><GroupSubTask /></Col>

                                </Row>
                            </Row>

                            <Row className='mb-3'>
                                <h5 className='mb-3'><FaList /> Comments</h5>
                                <textarea name='comments' rows={4} cols={100} placeholder='...Add a comment' className='ms-4 border border-secondary-subtle'>

                                </textarea>
                            </Row>
                        </Col>
                        <Col md={3}>
                            <Row className='text-center my-2'>
                                <Dropdown >
                                    <Dropdown.Toggle id="dropdown-custom-1" className=' text-dark py-3 mx-1 w-100 rounded-0  border-0 textt-dark background-hover background-color-third'>
                                        <strong>Unassigned</strong>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu >
                                        <Dropdown.ItemText   ><input type='text' /></Dropdown.ItemText >
                                        <Dropdown.Header>Members list</Dropdown.Header>
                                        <Dropdown.Item eventKey="1">TriNM</Dropdown.Item>
                                        <Dropdown.Item eventKey="2">HaoTH</Dropdown.Item>
                                        <Dropdown.Item eventKey="3">...</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Row>
                            <Row className='text-center my-2'>
                                <Dropdown >
                                    <Dropdown.Toggle id="dropdown-custom-1" className=' text-dark py-3 mx-1 w-100 rounded-0  border-0 textt-dark background-hover background-color-third'>
                                        <strong>Add sub task</strong>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu >
                                        <Dropdown.ItemText   ><input type='text' /></Dropdown.ItemText >
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Row>
                            <Row className='text-center my-2'>
                                <div>
                                    <Button className=' text-dark py-3 px-0 mx-1 w-100 rounded-0  border-0 text-dark background-hover background-color-third'
                                        onClick={handleDelete}>
                                        <strong>Remove</strong>
                                    </Button>
                                </div>

                            </Row>

                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    )
}

export default GroupTaskDetail
