import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Dropdown, Modal, Row } from 'react-bootstrap';
import { FaList } from 'react-icons/fa';
import { IoMdMenu } from 'react-icons/io';
import IndividualSubTask from './IndividualSubTask';
import axios from 'axios';

function IndividualTaskDetail({ show, setShow, task, onUpdateTask }) {
    const token = localStorage.getItem('token');
    const [userInfo, setUserInfo] = useState(null);
    const [description, setDescription] = useState(task.description || '');
    const [currentStatus, setCurrentStatus] = useState(task.status || '');
    const [taskName, setTaskName] = useState(task.taskName || '');
    const [taskDate, setTaskDate] = useState(task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // New state for delete confirmation modal

    const [subtaskName, setSubtaskName] = useState('');
    const [subtaskPriority, setSubtaskPriority] = useState('medium');
    const [subtaskStatus, setSubtaskStatus] = useState('inprogress');
    const [dateError, setDateError] = useState('');
    const [subtasks, setSubtasks] = useState(task.subTasks || []);

    console.log(subtasks)
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

    const updateTask = async (updatedData) => {
        try {
            const response = await axios.put(`http://localhost:9999/users/individual-task/task/${task._id}/edit`, updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const updatedTask = response.data;
            onUpdateTask(updatedTask);
            console.log('Task updated successfully:', response.data);
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };
    useEffect(() => {
        const interval = setInterval(() => {
            fetchUserInfo();
        }, 500);
        return () => clearInterval(interval);
    }, []);
    const handleFieldChange = (field, value) => {
        const updatedData = { [field]: value };
        setTimeout(() => {
            switch (field) {
                case 'taskName':
                    setTaskName(value);
                    updateTask(updatedData);
                    break;
                case 'description':
                    setDescription(value);
                    updateTask(updatedData);
                    break;
                case 'deadline':
                    // Kiểm tra tính hợp lệ của ngày
                    const currentDate = new Date();
                    const selectedDate = new Date(value);

                    if (selectedDate < currentDate.setHours(0, 0, 0, 0)) {
                        setDateError('Ngày phải lớn hơn hoặc bằng ngày hiện tại.');
                        alert('Deadline cannot be in the past.');
                    } else {
                        setDateError('');
                        setTaskDate(value);
                        updateTask(updatedData);
                    }
                    break;
                case 'status':
                    setCurrentStatus(value);
                    updateTask(updatedData);
                    break;
                default:
                    return;
            }
        }, 500);
    };

    const handleAddSubtask = async () => {
        if (!subtaskName.trim()) {
            alert("Subtask name cannot be empty");
            return;
        }

        try {
            const newSubtask = {
                subName: subtaskName,
                priority: subtaskPriority,
                status: subtaskStatus,
            };

            const response = await axios.post(`http://localhost:9999/users/individual-task/task/${task._id}/sub-task/add`, newSubtask, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Response:', response.data);
            if (response.status === 201) {
                setSubtasks(prevSubtasks => [...prevSubtasks, newSubtask]); 
                console.log('Subtask added successfully:', response.data);
                setSubtaskName('');
                setSubtaskPriority('medium');
                setSubtaskStatus('inprogress');

            }

        } catch (error) {
            console.error('Error adding subtask:', error);
        }
    };

    const handleDeleteTask = async () => {

        try {
            const response = await axios.delete(`http://localhost:9999/users/individual-task/task/${task._id}/delete`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                onUpdateTask('delete');
                console.log('Task deleted successfully');
                setShowDeleteConfirm(false);
                setShow(false);
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleUpdateSubTask = (updatedSubTask) => {
        if (updatedSubTask.action === 'delete') {
            setSubtasks((prevSubtasks) =>
                prevSubtasks.filter((subtask) => subtask._id !== updatedSubTask._id)
            );
        } else {
            setSubtasks((prevSubtasks) =>
                prevSubtasks.map((subtask) =>
                    subtask._id === updatedSubTask._id ? updatedSubTask : subtask
                )
            );
        }
    };
    return (
        <>
            <Modal
                show={show}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton onHide={() => { setShow(false); }}>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <input
                            type="text"
                            value={taskName}
                            onChange={(e) => handleFieldChange('taskName', e.target.value)}
                            className='form-control'
                            placeholder='Task Name'
                            required
                        />
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='vh-83 overflow-auto'>
                    <Container>
                        <Row className='d-flex justify-content-between'>
                            <Col md={8}>
                                <Row className='mb-3'>
                                    <Col md={7}>
                                        <p className='m-0'>In the <strong className='text-success'>{task.status}</strong></p>
                                    </Col>
                                    <Col md={3} className='text-end'>
                                        <strong>Deadline</strong>
                                        <input
                                            type='date'
                                            value={taskDate}
                                            onChange={(e) => handleFieldChange('deadline', e.target.value)}
                                            className='ms-2 form-control'
                                            required
                                        />
                                    </Col>
                                    <Col md={2} className='text-end'>
                                        <strong>Status</strong>
                                        <select
                                            className='form-select'
                                            value={currentStatus}
                                            onChange={(e) => handleFieldChange('status', e.target.value)}
                                        >
                                            {
                                                userInfo?.classifications?.map((classification, index) => (
                                                    <option key={index} value={classification}>
                                                        {classification}
                                                    </option>
                                                )) || <option disabled>No classifications available</option>
                                            }
                                        </select>
                                    </Col>
                                </Row>
                                <Row className='mb-3'>
                                    <h5 className='mb-3'><IoMdMenu /> Description</h5>
                                    <textarea
                                        name='description'
                                        rows={4}
                                        cols={100}
                                        placeholder='...Add a description'
                                        className='ms-4 border border-secondary-subtle'
                                        required
                                        value={description}
                                        onChange={(e) => handleFieldChange('description', e.target.value)}

                                    />
                                </Row>
                                <Row className='mb-3'>
                                    <h5 className='mb-3'><FaList /> SubTask</h5>
                                    <Row className='ms-4'>
                                        {subtasks.map((subtask, index) => (
                                            <Col md={12} key={index}>
                                                <IndividualSubTask subtask={subtask} taskId={task._id} onUpdateSubTask={handleUpdateSubTask} />
                                            </Col>
                                        ))}
                                    </Row>
                                </Row>
                            </Col>
                            <Col md={3}>
                                <Row className='text-center my-2'>
                                    <Dropdown>
                                        <Dropdown.Toggle id="dropdown-custom-1" className='text-dark py-3 mx-1 w-100 rounded-0 border-0 background-hover background-color-third'>
                                            <strong>Add sub task</strong>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.ItemText>
                                                <input
                                                    type='text'
                                                    placeholder='Subtask Name'
                                                    value={subtaskName}
                                                    onChange={(e) => setSubtaskName(e.target.value)}
                                                    className='form-control'
                                                />
                                            </Dropdown.ItemText>
                                            <Dropdown.ItemText>
                                                <select
                                                    className='form-select'
                                                    value={subtaskPriority}
                                                    onChange={(e) => setSubtaskPriority(e.target.value)}
                                                >
                                                    <option value="high">High</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="low">Low</option>
                                                </select>
                                            </Dropdown.ItemText>
                                            <Dropdown.ItemText>
                                                <select
                                                    className='form-select'
                                                    value={subtaskStatus}
                                                    onChange={(e) => setSubtaskStatus(e.target.value)}
                                                >
                                                    <option value="inprogress">In Progress</option>
                                                    <option value="done">Done</option>
                                                </select>
                                            </Dropdown.ItemText>
                                            <Dropdown.ItemText>
                                                <Button
                                                    variant="primary"
                                                    onClick={handleAddSubtask}
                                                    className='w-100'
                                                >
                                                    Add Subtask
                                                </Button>
                                            </Dropdown.ItemText>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Row>
                                <Row className='text-center my-2'>
                                    <div>
                                        <Button
                                            className='text-danger py-3 px-0 mx-1 w-100 rounded-0 border-0 background-hover background-color-third'
                                            onClick={() => setShowDeleteConfirm(true)}
                                        >
                                            <strong>Delete Task</strong>
                                        </Button>
                                    </div>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>

            {/* Delete confirmation modal */}
            <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this task? This action cannot be undone.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteTask}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default IndividualTaskDetail;
