import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap'
import { FaCheck, FaPlus } from 'react-icons/fa';
import { FaRegTrashCan } from 'react-icons/fa6';
import { IoMdClose, IoMdMore } from "react-icons/io";
import GroupTask from './GroupTask';
import GroupTaskDetail from './GroupTaskDetail';
import { IoCheckmark } from 'react-icons/io5';
import { AppContext } from '../../Context/AppContext';
import axios from 'axios';
function GroupColumn({ column }) {
    const { groups_API, group, setGroup, accessToken, show, setShow, selectedTask, setSelectedTask,currentUserRole,showUpgrade,setShowUpgrade } = useContext(AppContext)

    const tasks = group.tasks.filter((t) => {
        return t.status == column
    });
    const [newTask, setNewTask] = useState("");
    const [newColumn, setNewColumn] = useState(column);
    const [editColumn, setEditColumn] = useState(false)
    const [addTask, setAddTask] = useState(false)
    const [showDeletion, setShowDeletion] = useState(false)

    const handleDeleteColumn = async (e) => {
        e.preventDefault();
        if (currentUserRole?.groupRole != "viewer") {
            const alternativeColumn = e.target.classification.value;
            await axios.delete(`${groups_API}/${group._id}/delete-column`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    data: { selectedColumn: column, alternativeColumn },
                })
                .then((res) => setGroup(res.data))
                .catch((err) => console.log(err))
        } else {
            window.alert("You must be group member to add new column!")
        }


    }
    async function handleCreateTask() {
        
        if (currentUserRole?.groupRole != "viewer") {
            if (newTask != "") {
                await axios.post(`${groups_API}/${group._id}/tasks/create`, { taskName: newTask, status: column }, { headers: { Authorization: `Bearer ${accessToken}` } })
                    .then((res) => {
    
                        setGroup({ ...group, tasks: [...group.tasks, res.data] });
                        setNewTask('');
                        setAddTask(false)
                    })
                    .catch((err) => console.log(err));
            } else {
                window.alert("You must enter task name!")
            }
        } else {
            window.alert("You must be group member to add new column!")
        }
    }

    const handleEditColumn = async () => {

        if (currentUserRole?.groupRole != "viewer") {
            if (newColumn != "") {
                await axios.put(`${groups_API}/${group._id}/edit-column`,
                    { selectedColumn: column.toLowerCase(), newColumn: newColumn },
                    { headers: { Authorization: `Bearer ${accessToken}` } })
                    .then((res) => setGroup(res.data))
                    .catch((err) => console.log(err))
    
            } else {
                window.alert("You must enter column name!")
            }
        } else {
            window.alert("You must be group member to add new column!")
        }

    }

    return (
        <Container fluid className='py-1'>
            <Row className='my-2 d-flex justify-content-between '>
                <Col md={10} className='text-start'>
                    {editColumn == false ? <p className='m-0 p-1 rounded-1 background-hover fw-bold' onClick={() => setEditColumn(true)}>{column.toUpperCase()}</p> :
                        <Row className='d-flex justify-content-between'>
                            <Col md={8}><input type="text" name='columnName' className='w-100 m-0' value={newColumn} onChange={(e) => { setNewColumn(e.target.value) }} required /></Col>
                            <Col md={2} className='background-hover bg-white border border-1 border-black' onClick={() => { setEditColumn(false); handleEditColumn() }}><IoCheckmark /></Col>
                            <Col md={2} className='background-hover bg-white border border-1 border-black' onClick={() => { setEditColumn(false) }}><IoMdClose /></Col>

                        </Row>}
                </Col>
                <Col md={2} className='text-end item-hover p-1'><IoMdMore /></Col>
            </Row>

            {tasks?.map((task) => {
                return (<Row key={task._id} className='my-2' onClick={() => { setShow(true); setSelectedTask(task) }}>
                    <GroupTask task={task} />
                </Row>)
            })}

            <Row className='my-2'>
                <Col md={9} className='text-start p-1'>
                    {addTask == false ? <p className='m-0 p-1 rounded-1 background-hover' onClick={() => setAddTask(true)}><FaPlus />  Create task</p> :
                        <Row className='d-flex justify-content-between'>
                            <Col md={8}><input type="text" name='taskName' className='w-100 m-0'
                                onChange={(e) => { setNewTask(e.target.value) }} required /></Col>
                            <Col md={2} className='background-hover bg-white border border-1 border-black'
                                onClick={handleCreateTask}
                            ><IoCheckmark /></Col>

                            <Col md={2} className='background-hover bg-white border border-1 border-black' onClick={() => { setAddTask(false) }}><IoMdClose /></Col>

                        </Row>}
                </Col>
                <Col md={3} className='text-end p-1'><FaRegTrashCan className='item-hover ' onClick={() => setShowDeletion(true)} /></Col>
            </Row>
            <GroupTaskDetail />
            <Modal
                show={showDeletion}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header closeButton onHide={() => { setShowDeletion(false) }}>
                    Confirm deletion
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Form onSubmit={(e) => handleDeleteColumn(e)}>
                            <Form.Label>Choose alternative status for tasks:</Form.Label>
                            <Row className='d-flex justify-content-around'>

                                <Col md={5}>
                                    <Form.Select disabled>
                                        <option>{column.toUpperCase()}</option>
                                    </Form.Select>
                                </Col>
                                to
                                <Col md={5}>
                                    <Form.Select name='classification'>
                                        {group?.classifications.map((c) => {
                                            return <option disabled={c == column} value={c}>{c.toUpperCase()}</option>
                                        })}

                                    </Form.Select>
                                </Col>

                                <Col md={6} className='mt-2'></Col>
                                <Col md={2} className='mt-2'>
                                    <Button type='submit' className='bg-danger'>Confirm</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Container>
                </Modal.Body>
            </Modal>

        </Container>
    )
}

export default GroupColumn
