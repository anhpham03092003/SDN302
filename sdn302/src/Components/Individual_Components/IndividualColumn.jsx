import React, { useState, useEffect } from 'react';
import { Button, Col, Container, Row, Modal, Form } from 'react-bootstrap';
import { FaCheck, FaPlus } from 'react-icons/fa';
import { FaRegTrashCan } from 'react-icons/fa6';
import { IoMdClose, IoMdMore } from "react-icons/io";
import IndividualTask from './IndividualTask';
import IndividualTaskDetail from './IndividualTaskDetail';
import { IoCheckmark } from 'react-icons/io5';
import axios from 'axios';

function IndividualColumn({ column, updateColumnName, onDataChange  }) {
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
    const [tasks, setTasks] = useState([]);
    const isOtherColumn = column === "other";
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

    useEffect(() => {
        const interval = setInterval(() => {
            fetchUserInfo();
        }, 500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (userInfo) {
            const filteredTasks = userInfo.individualTasks.filter((task) => task.status === column);
            setTasks(filteredTasks);
        }
    }, [userInfo]);
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
            console.log("Classification updated successfully:", response.data);
            setEditColumn(false);
            setNewColumnName(newColumnName);
            updateColumnName(column, newColumnName);
            await fetchUserInfo();
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
                await fetchUserInfo(); // Cập nhật danh sách sau khi tạo task mới
                handleCloseTaskModal();
            }
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    const deleteClassification = async () => {
        const classification = column;
        
        try {
            const response = await axios.delete(
                `http://localhost:9999/users/delete-classification`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    data: { classification },
                }
            );
    
            if (response.status === 200) {
                console.log("Classification deleted successfully:", response.data);
                onDataChange();
                await fetchUserInfo(); 
            } else {
                console.error("Error deleting classification:", response.data);
            }
        } catch (error) {
            console.error("Error deleting classification:", error);
        }
    };
    
    const handleRemoveTask = () => {
        if (window.confirm("Remove this column, yor task will be moved to 'Other'?")) {
            deleteClassification();
        }
    };

    const handleCloseTaskModal = () => {
        setTaskName(''); // Clear the task name
        setDescription(''); // Clear the description
        setDeadline(''); // Clear the deadline
        console.log("Modal closing... Current showTaskModal:", showTaskModal);
        setShowTaskModal(false);
    };

    const handleUpdateTask = async (updatedTask) => {
        if (updatedTask) {
            const updatedTasks = userInfo.individualTasks.map((task) =>
                task._id === updatedTask._id ? updatedTask : task
            );
            setUserInfo({ ...userInfo, individualTasks: updatedTasks });
    
            const filteredTasks = updatedTasks.filter((task) => task.status === column);
            setTasks(filteredTasks);
    
            await fetchUserInfo(); 
        } else {
            // If the task was deleted
            const filteredTasks = userInfo.individualTasks.filter(task => task._id !== updatedTask._id);
            setUserInfo({ ...userInfo, individualTasks: filteredTasks });

            const updatedTasks = filteredTasks.filter((task) => task.status === column);
            setTasks(updatedTasks);
    
            await fetchUserInfo(); 
        }
        onDataChange(); 
    };
    
    



    return (
        <Container fluid className='py-1'>
            <Row className='my-2 d-flex justify-content-between'>
                <Col md={10} className='text-start'>
                    {!isOtherColumn ? (
                        editColumn ? (
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
                                <Col
                                    md={2}
                                    className='background-hover bg-white border border-1 border-black'
                                    onClick={handleEditColumnName}
                                >
                                    <IoCheckmark />
                                </Col>
                                <Col
                                    md={2}
                                    className='background-hover bg-white border border-1 border-black'
                                    onClick={() => setEditColumn(false)}
                                >
                                    <IoMdClose />
                                </Col>
                            </Row>
                        ) : (
                            <p
                                className='m-0 p-1 rounded-1 background-hover fw-bold'
                                onClick={() => setEditColumn(true)}
                            >
                                {column}
                            </p>
                        )
                    ) : (
                        // Always display "other" as non-editable
                        <p className='m-0 p-1 rounded-1 fw-bold'>
                            {column}
                        </p>
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
                    {!isOtherColumn && (
                        <FaRegTrashCan className='item-hover' onClick={handleRemoveTask} />
                    )}
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
                                required
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
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Deadline</Form.Label>
                            <Form.Control
                                type="date"
                                value={deadline}
                                onChange={(e) => {
                                    const selectedDate = new Date(e.target.value);
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    if (selectedDate >= today) {
                                        setDeadline(e.target.value);
                                    } else {
                                        alert("Please select a date that is today or in the future.");
                                    }
                                }}
                                required
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
                    onUpdateTask={handleUpdateTask}
                />
            )}
        </Container>
    );
}

export default IndividualColumn;
