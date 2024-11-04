import React, { useContext } from 'react';
import { Container, Nav, NavDropdown, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowRight, FaBell, FaPen, FaPlus, FaUser } from "react-icons/fa";
import { AppContext } from '../Context/AppContext';
import styles from '../Styles/Header_css/Header.module.css';

function Header() {
    const { user, accessToken, handleLogout } = useContext(AppContext);
    const navigate = useNavigate();
    const handleLogoutClick = () => {
        handleLogout(); // Gọi hàm logout từ AppContext
        navigate('/'); // Điều hướng đến trang chủ
    };
    console.log(user);
    return (
        <Container fluid className={styles.headerContainer}>
            <div className="d-flex justify-content-between align-items-center w-100">
                <Nav className='d-flex align-items-center'>
                    <Nav.Item className='ps-5 mx-2'>
                        <Link to="/" className='fw-bolder text-decoration-none text-dark'>
                            <h5 className='fw-bolder m-0'>COLOHURI</h5>
                        </Link>
                    </Nav.Item>
                    <Nav.Item className='mx-2'>
                        <Link to="/" className='text-dark text-decoration-none'>Home</Link>
                    </Nav.Item>
                    <Nav.Item className='mx-2'>
                        <Link to="/groups" className='text-dark text-decoration-none'>Groups</Link>
                    </Nav.Item>
                    <Nav.Item className='mx-2'>
                        <Link to="/individualSpace" className='text-dark text-decoration-none'>Individual</Link>
                    </Nav.Item>
                    <Nav.Item className='text-dark'>
                        <Link to="/groups/create" className='btn btn-primary btn-sm rounded-0'><FaPlus /> Create</Link>
                    </Nav.Item>
                </Nav>
                {accessToken ? (
                    <Nav className='d-flex align-items-center'>
                        {user && user.role === 'admin' && (
                            <Nav.Item className='mx-2'>
                                <Link to="/admin/userManagement" className="btn btn-success btn-md">
                                    For Admin
                                </Link>
                            </Nav.Item>
                        )}
                        <Nav.Item className='align-content-center'>
                            <NavDropdown title={<FaBell className='text-dark m-0 item-hover' />} id="basic-nav-dropdown">
                                <NavDropdown.Header as="div"><h5>Notifications</h5></NavDropdown.Header>
                                <NavDropdown.Divider />
                                <NavDropdown.Item as={Link} to="/">Notification 1</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/">Notification 2</NavDropdown.Item>
                            </NavDropdown>
                        </Nav.Item>
                        <Nav.Item className='p-2'>
                            <NavDropdown title={<span className={styles.username}>{user ? user.username : 'User'}</span>} id="basic-nav-dropdown">
                                <NavDropdown.Item as={Link} to="/profile/profileInfo"><FaUser /> User profile</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/profile/changePassword"><FaPen /> Change password</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogoutClick}>
                                    <FaArrowRight /> Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav.Item>
                    </Nav>
                ) : (
                    <Nav>
                        <Nav.Item className='p-2'>
                            <Link to="/login/loginForm" className='text-dark text-decoration-none'>Login</Link>
                        </Nav.Item>
                        <Nav.Item className='p-2'>
                            <Link to="/login/registerForm" className='text-dark text-decoration-none'>Register</Link>
                        </Nav.Item>
                    </Nav>
                )}
            </div>
        </Container>
    );
}

export default Header;
