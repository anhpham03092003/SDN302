import React, { useState, useEffect, useContext } from 'react';
import { Table, Form, Button, Modal, Alert } from 'react-bootstrap';
import { MdOutlineSearch } from "react-icons/md";
import { FaPlus, FaUser, FaLock, FaEnvelope, FaIdBadge } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../Context/AppContext'; // Ensure you have access to AppContext

function UserManagement() {
    const [show, setShow] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [message, setMessage] = useState('');
    const [emailError, setEmailError] = useState('');
    const [users, setUsers] = useState([]); // To hold user data
    const navigate = useNavigate();
    const { accessToken } = useContext(AppContext); // Access token from context

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:9999/users/all-users', {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Failed to fetch users', error);
            }
        };
        fetchUsers();
    }, [accessToken]);

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

    const banUser = async (userId) => {
        try {
            const response = await axios.put(
                `http://localhost:9999/users/ban-user/${userId}`,
                {},
                {
                    headers: { Authorization: `Bearer ${accessToken}` }
                }
            );
    
            if (response.status === 200 && response.data.user) {
                // Use the returned user object to update only that user's banned status
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.id === userId ? response.data.user : user
                    )
                );
    
                console.log(response.data.message);
                setMessage(response.data.message); // Optional feedback message
            } else {
                console.error('Unexpected response structure:', response.data);
                setMessage('Failed to ban user. Unexpected server response.');
            }
        } catch (error) {
            console.error('Failed to ban user:', error);
            setMessage('Failed to ban user. Please try again.');
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
                        <th>Action</th> {/* Added action column */}
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.account.email}</td>
                            <td>{user.role}</td>
                            <td>{user.status === 'banned' ? 'Banned' : user.status === 'active' ? 'Active' : 'Inactive'}</td>
                            <td>
                                {!user.banned && (
                                    <Button variant="danger" onClick={() => banUser(user.id)}>
                                        Ban
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
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
                        {/* Registration form fields */}
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

