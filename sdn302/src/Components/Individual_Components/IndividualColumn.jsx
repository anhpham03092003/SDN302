import React, { useState, useEffect } from 'react';
import { Button, Col, Container, Row, Modal, Form } from 'react-bootstrap';
import { FaCheck, FaPlus } from 'react-icons/fa';
import { FaRegTrashCan } from 'react-icons/fa6';
import { IoMdClose, IoMdMore } from "react-icons/io";
import IndividualTask from './IndividualTask';
import IndividualTaskDetail from './IndividualTaskDetail';
import { IoCheckmark } from 'react-icons/io5';
import axios from 'axios';

function IndividualColumn({ column }) {
    const [showTaskModal, setShowTaskModal] = useState(false); // for creating task
    const [showTaskDetail, setShowTaskDetail] = useState(false); // for task details
    const [currentTask, setCurrentTask] = useState(null);
    const [editColumn, setEditColumn] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [newColumnName, setNewColumnName] = useState(column);
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const token = localStorage.getItem('token');

    const fetchUserInfo = async () => {
        try {
            const response = await axios.get('http://localhost:9999/users/get-profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUserInfo(response.data);
        } catch (error) {
            console.error('Error fetching user information:', error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchUserInfo();
        }
    }, [token]);

    const tasks = userInfo?.individualTasks.filter((task) => task.status === column);

    const handleEditColumnName = async () => {
        try {
            const response = await axios.put(
                'http://localhost:9999/users/edit-classification',
                {
                    oldClassification: column,
                    newClassification: newColumnName,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setEditColumn(false);
            fetchUserInfo();
        } catch (error) {
            console.error("Error updating classification:", error);
        }
    };

    const handleCreateTask = async () => {
        if (!taskName.trim()) {
            alert("Task name cannot be empty");
            return;
        }

        try {
            const newTask = {
                taskName: taskName,
                description: description,
                status: column,
                deadline: deadline,
                subTasks: []
            };

            const response = await axios.post('http://localhost:9999/users/individual-task/add', newTask, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 201) {
                console.log('Task created successfully:', response.data);
                await fetchUserInfo(); // Refresh user info to include the new task
                handleCloseTaskModal(); // Close modal
            }
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    const handleRemoveTask = () => {
        if (window.confirm("Remove this column?")) {
            // Handle column removal logic here
        }
    };

    const handleCloseTaskModal = () => {
        setShowTaskModal(false);
        setTaskName(''); // Clear the task name
        setDescription(''); // Clear the description
        setDeadline(''); // Clear the deadline
    };

    return (
        <Container fluid className='py-1'>
            <Row className='my-2 d-flex justify-content-between'>
                <Col md={10} className='text-start'>
                    {editColumn === false ? (
                        <p className='m-0 p-1 rounded-1 background-hover fw-bold' onClick={() => setEditColumn(true)}>
                            {column}
                        </p>
                    ) : (
                        <Row className='d-flex justify-content-between'>
                            <Col md={8}>
                                <input
                                    type="text"
                                    name='columnName'
                                    className='w-100'
                                    value={newColumnName}
                                    onChange={(e) => setNewColumnName(e.target.value)}
                                    required
                                />
                            </Col>
                            <Col md={2} className='background-hover bg-white border border-1 border-black' onClick={handleEditColumnName}>
                                <IoCheckmark />
                            </Col>
                            <Col md={2} className='background-hover bg-white border border-1 border-black' onClick={() => setEditColumn(false)}>
                                <IoMdClose />
                            </Col>
                        </Row>
                    )}
                </Col>
                <Col md={2} className='text-end item-hover p-1'><IoMdMore /></Col>
            </Row>

            {tasks?.map((task) => (
                <Row key={task._id} className='my-2' onClick={() => {
                    setCurrentTask(task);
                    setShowTaskDetail(true);
                }}>
                    <IndividualTask task={task} />
                </Row>
            ))}

            <Row className='my-2'>
                <Col md={9} className='text-start p-1'>
                    <p className='m-0 p-1 rounded-1 background-hover' onClick={() => setShowTaskModal(true)}>
                        <FaPlus /> Create task
                    </p>
                </Col>
                <Col md={3} className='text-end p-1'>
                    <FaRegTrashCan className='item-hover' onClick={handleRemoveTask} />
                </Col>
            </Row>

            {/* Task Creation Modal */}
            <Modal show={showTaskModal} onHide={handleCloseTaskModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Task Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter task name" 
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3} 
                                placeholder="Enter task description" 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Deadline</Form.Label>
                            <Form.Control 
                                type="date" 
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseTaskModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleCreateTask}>
                        Create Task
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Task Detail Modal */}
            {currentTask && (
                <IndividualTaskDetail 
                    show={showTaskDetail} 
                    setShow={setShowTaskDetail} 
                    task={currentTask} 
                />
            )}
        </Container>
    );
}

export default IndividualColumn;
