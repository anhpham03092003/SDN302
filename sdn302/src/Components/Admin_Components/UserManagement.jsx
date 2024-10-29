// import React, { useState, useEffect, useContext } from 'react';
// import { Table, Form, Button, Modal, Alert } from 'react-bootstrap';
// import { MdOutlineSearch } from "react-icons/md";
// import { FaPlus, FaUser, FaLock, FaEnvelope, FaIdBadge } from "react-icons/fa";
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { AppContext } from '../../Context/AppContext'; // Ensure you have access to AppContext

// function UserManagement() {
//     const [show, setShow] = useState(false);
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [email, setEmail] = useState('');
//     const [firstName, setFirstName] = useState('');
//     const [lastName, setLastName] = useState('');
//     const [message, setMessage] = useState('');
//     const [emailError, setEmailError] = useState('');
//     const [users, setUsers] = useState([]); // To hold user data
//     const navigate = useNavigate();
//     const { accessToken } = useContext(AppContext); // Access token from context

//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const response = await axios.get('http://localhost:9999/users/all-users', {
//                     headers: { Authorization: `Bearer ${accessToken}` }
//                 });
//                 setUsers(response.data);
//             } catch (error) {
//                 console.error('Failed to fetch users', error);
//             }
//         };
//         fetchUsers();
//     }, [accessToken]);

//     const handleClose = () => setShow(false);
//     const handleShow = () => setShow(true);

//     const handleRegister = async (event) => {
//         event.preventDefault();
//         try {
//             const existingUser = await axios.get(`http://localhost:9999/users?username=${username}`);
//             if (existingUser.data.length > 0) {
//                 setMessage('Username already exists');
//                 return;
//             }

//             const existingEmail = await axios.get(`http://localhost:9999/users?email=${email}`);
//             if (existingEmail.data.length > 0) {
//                 setEmailError('The email has already been used!');
//                 return;
//             }

//             const newUserResponse = await axios.post('http://localhost:9999/users', {
//                 username,
//                 password,
//                 firstName,
//                 lastName,
//                 email,
//                 phone: '',
//                 role: 'user',
//                 banned: false
//             });

//             const newUser = newUserResponse.data;
//             navigate('/home');
//             console.log('Registration successful');
//             handleClose(); // Close the modal after registration
//         } catch (error) {
//             console.error('Registration failed', error);
//         }
//     };

//     const banUser = async (userId) => {
//         try {
//             const response = await axios.put(
//                 `http://localhost:9999/users/ban-user/${userId}`,
//                 {},
//                 {
//                     headers: { Authorization: `Bearer ${accessToken}` }
//                 }
//             );

//             if (response.status === 200 && response.data.user) {
//                 // Use the returned user object to update only that user's banned status
//                 setUsers((prevUsers) =>
//                     prevUsers.map((user) =>
//                         user._id === userId ? response.data.user : user
//                     )
//                 );


//                 setMessage(response.data.message); // Optional feedback message
//             } else {
//                 console.error('Unexpected response structure:', response.data);
//                 setMessage('Failed to ban user. Unexpected server response.');
//             }
//         } catch (error) {
//             console.error('Failed to ban user:', error);
//             setMessage('Failed to ban user. Please try again.');
//         }
//     };



//     return (
//         <div className='ms-1 mt-4'>
//             <Form className='d-flex justify-content-end me-4 mb-2'>
//                 <Form.Group controlId="form" className='position-relative'>
//                     <Form.Control
//                         type="text"
//                         placeholder="Search User"
//                     />
//                     <MdOutlineSearch
//                         style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)' }}
//                     />
//                 </Form.Group>
//                 <Button className='ms-5' variant="primary" onClick={handleShow}>
//                     <FaPlus className='me-2' style={{ position: 'relative', top: '25%', transform: 'translateY(-50%)' }} />
//                     Add User
//                 </Button>
//             </Form>

//             <Table striped bordered hover>
//                 <thead>
//                     <tr>
//                         <th>Name</th>
//                         <th>Email</th>
//                         <th>Role</th>
//                         <th>Status</th>
//                         <th>Action</th> {/* Added action column */}
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {users.map(user => (
//                         <tr key={user._id}>
//                             <td>{user.username}</td>
//                             <td>{user.account.email}</td>
//                             <td>{user.role}</td>
//                             <td>{user.status === 'banned' && 'Banned'}
//                                 {user.status === 'active' && 'Active'}
//                                 {user.status === 'inactive' && 'Inactive'}
//                             </td>
//                             {/* <td>{user.status === 'banned' ? 'Banned' : user.status === 'active' ? 'Active' : 'Inactive'}</td> */}
//                             <td>
//                                 {!user.banned && (
//                                     <Button variant="danger" onClick={() => banUser(user?._id)}>
//                                         Ban
//                                     </Button>
//                                 )}
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </Table>

//             {/* Add User Modal */}
//             <Modal show={show} onHide={handleClose}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Add New User</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <form onSubmit={handleRegister}>
//                         {message && <Alert variant="danger">{message}</Alert>}
//                         {emailError && <Alert variant="danger">{emailError}</Alert>}
//                         {/* Registration form fields */}
//                         <Button variant="primary" type="submit">
//                             Create User
//                         </Button>
//                     </form>
//                 </Modal.Body>
//             </Modal>
//         </div>
//     );
// }

// export default UserManagement;

import React, { useState, useEffect, useContext } from 'react';
import { Table, Form, Button, Modal, Alert } from 'react-bootstrap';
import { MdOutlineSearch } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../Context/AppContext';

function UserManagement() {
    const [show, setShow] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [message, setMessage] = useState('');
    const [emailError, setEmailError] = useState('');
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');  // State for the search term
    const [isLoading, setIsLoading] = useState(true);  // Loading state for user data

    const navigate = useNavigate();
    const { accessToken, user } = useContext(AppContext);

    useEffect(() => {
        const fetchUsers = async () => {
            if (!user) {
                setIsLoading(true);
                return;  
            }

            if (user.role !== 'admin') {
                navigate('/not-authorized');
                return;
            }

            try {
                const response = await axios.get('http://localhost:9999/users/all-users', {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });

                const filteredUsers = response.data.filter(u => u._id !== user._id);
                setUsers(filteredUsers);
            } catch (error) {
                console.error('Failed to fetch users', error);
            } finally {
                setIsLoading(false);  
            }
        };

        fetchUsers();
    }, [accessToken, user, navigate]);

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

            await axios.post('http://localhost:9999/users', {
                username,
                password,
                firstName,
                lastName,
                email,
                phone: '',
                role: 'user',
                banned: false
            });

            navigate('/home');
            handleClose();
        } catch (error) {
            console.error('Registration failed', error);
        }
    };

    const toggleBanUser = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'banned' ? 'active' : 'banned';
        try {
            const response = await axios.put(
                `http://localhost:9999/users/ban-user/${userId}`,
                { status: newStatus },
                {
                    headers: { Authorization: `Bearer ${accessToken}` }
                }
            );

            if (response.status === 200) {
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user._id === userId ? { ...user, status: newStatus } : user
                    )
                );

                setMessage(`User ${newStatus === 'banned' ? 'banned' : 'unbanned'} successfully`);
            } else {
                console.error('Unexpected response structure:', response.data);
                setMessage('Failed to update user status. Unexpected server response.');
            }
        } catch (error) {
            console.error('Failed to update user status:', error);
            setMessage('Failed to update user status. Please try again.');
        }
    };

    // Show loading spinner if data is loading
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Filter users based on search term
    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='ms-1 mt-4'>
            <Form className='d-flex justify-content-end me-4 mb-2'>
                <Form.Group controlId="form" className='position-relative'>
                    <Form.Control
                        type="text"
                        placeholder="Search User"
                        value={searchTerm}  // Set the value to the searchTerm state
                        onChange={(e) => setSearchTerm(e.target.value)}  // Update the searchTerm on input change
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
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map(user => (
                        <tr key={user._id}>
                            <td>{user.username}</td>
                            <td>{user.account.email}</td>
                            <td>{user.role}</td>
                            <td>{user.status === 'banned' ? 'Banned' : user.status === 'active' ? 'Active' : 'Inactive'}</td>
                            <td>
                                <Button
                                    variant={user.status === 'banned' ? 'success' : 'danger'}
                                    onClick={() => toggleBanUser(user._id, user.status)}
                                >
                                    {user.status === 'banned' ? 'Unban' : 'Ban'}
                                </Button>
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
