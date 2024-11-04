import React, { useState } from 'react';
import { Col, Row, Modal, Button } from 'react-bootstrap';
import { FaRegSquareCheck, FaRegTrashCan, FaSquareCheck } from 'react-icons/fa6';
import { GrTasks } from 'react-icons/gr';
import axios from 'axios';

function IndividualSubTask({ subtask, taskId , onUpdateSubTask }) {
    const [isDone, setIsDone] = useState(subtask.status === 'done');
    const [priority, setPriority] = useState(subtask.priority || 'medium');
    const [subtaskName, setSubtaskName] = useState(subtask.subName);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State for delete confirmation modal
    const token = localStorage.getItem('token');

    const updateSubTask = async (updatedData) => {
        try {
            await axios.put(
                `http://localhost:9999/users/individual-task/task/${taskId}/sub-task/${subtask._id}/edit`,
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            onUpdateSubTask({ ...subtask, ...updatedData });
            console.log('Subtask updated successfully');
        } catch (error) {
            console.error('Error updating subtask:', error);
        }
    };

    const handlePriorityChange = (e) => {
        const newPriority = e.target.value;
        setPriority(newPriority);
        updateSubTask({ priority: newPriority });
    };

    const toggleIsDone = () => {
        const newStatus = !isDone ? 'done' : 'inprogress';
        setIsDone(!isDone);
        updateSubTask({ status: newStatus });
    };

    const handleNameBlur = () => {
        updateSubTask({ subName: subtaskName });
    };

    const handleRemoveSubTask = () => {
        setShowDeleteConfirm(true); 
    };

    const confirmDeleteSubTask = async () => {
        try {
            await axios.delete(
                `http://localhost:9999/users/individual-task/task/${taskId}/sub-task/${subtask._id}/delete`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            onUpdateSubTask('delete');
            console.log('Subtask deleted successfully');
        } catch (error) {
            console.error('Error deleting subtask:', error);
        } finally {
            setShowDeleteConfirm(false); 
        }
    };

    return (
        <>
            <Row className='d-flex border border-1 border-secondary-subtle vh-5'>
                <Col md={1} className='align-self-center'>
                    <GrTasks />
                </Col>
                <Col md={5} className='align-self-center'>
                    <input
                        type="text"
                        value={subtaskName}
                        onChange={(e) => setSubtaskName(e.target.value)}
                        onBlur={handleNameBlur}
                        className='form-control form-control-sm'
                    />
                </Col>
                <Col md={3} className='align-self-center'>
                    <select
                        className='form-select form-select-sm'
                        value={priority}
                        onChange={handlePriorityChange}
                    >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </Col>
                <Col md={2} className='align-self-center text-end'>
                    {!isDone  ? (
                        <FaRegSquareCheck className='mx-1 item-hover' onClick={toggleIsDone} />
                    ) : (
                        <FaSquareCheck className='mx-1 item-hover' onClick={toggleIsDone} />
                    )}
                    <FaRegTrashCan className='mx-1 item-hover' onClick={handleRemoveSubTask} />
                </Col>
            </Row>

            {/* Delete confirmation modal */}
            <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this subtask? This action cannot be undone.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDeleteSubTask}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default IndividualSubTask;
