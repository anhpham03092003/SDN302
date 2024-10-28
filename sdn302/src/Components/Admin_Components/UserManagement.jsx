import React, { useState } from 'react';
import { Table, Form, Button, Modal, Alert } from 'react-bootstrap';
import { MdOutlineSearch } from "react-icons/md";
import { FaPlus, FaUser, FaLock, FaEnvelope, FaIdBadge } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UserManagement() {
    const [show, setShow] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [message, setMessage] = useState('');
    const [emailError, setEmailError] = useState('');
    const navigate = useNavigate();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleRegister = async (event) => {
        event.preventDefault();
        try {
            const existingUser = await axios.get(`http://localhost:9999/users?username=${username}`);
            if (existingUser.data.length > 0) {
                setMessage('Username already exists');
                return;
            }

            const existingEmail = await axios.get(`http://localhost:9999/users?email=${email}`);
            if (existingEmail.data.length > 0) {
                setEmailError('The email has already been used!');
                return;
            }

            const newUserResponse = await axios.post('http://localhost:9999/users', {
                username,
                password,
                firstName,
                lastName,
                email,
                phone: '',
                role: 'user',
                banned: false
            });

            const newUser = newUserResponse.data;
            navigate('/home');
            console.log('Registration successful');
            handleClose(); // Close the modal after registration
        } catch (error) {
            console.error('Registration failed', error);
        }
    };

    return (
        <div className='ms-1 mt-4'>
            <Form className='d-flex justify-content-end me-4 mb-2'>
                <Form.Group controlId="form" className='position-relative'>
                    <Form.Control
                        type="text"
                        placeholder="Search User"
                    />
                    <MdOutlineSearch
                        style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)' }}
                    />
                </Form.Group>
                <Button className='ms-5' variant="primary" onClick={handleShow}>
                    <FaPlus className='me-2' style={{ position: 'relative', top: '25%', transform: 'translateY(-50%)' }} />
                    Add User
                </Button>
            </Form>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>John Doe</td>
                        <td>john.doe@example.com</td>
                        <td>Admin</td>
                        <td>Active</td>
                    </tr>
                    <tr>
                        <td>Jane Smith</td>
                        <td>jane.smith@example.com</td>
                        <td>User</td>
                        <td>Inactive</td>
                    </tr>
                </tbody>
            </Table>

            {/* Add User Modal */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleRegister}>
                        {message && <Alert variant="danger">{message}</Alert>}
                        {emailError && <Alert variant="danger">{emailError}</Alert>}

                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <FaUser className="icon" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Control
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <FaEnvelope className="icon" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                            <FaIdBadge className="icon" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                            <FaIdBadge className="icon" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <FaLock className="icon" />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Create User
                        </Button>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default UserManagement;
