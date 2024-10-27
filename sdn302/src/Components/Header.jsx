import React, { useContext } from 'react'; // Nhập useContext
import { Container, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaPen, FaPlus, FaUser } from "react-icons/fa";
import { AppContext } from '../Context/AppContext'; // Nhập AppContext
import styles from '../Styles/Header_css/Header.module.css';

function Header() {
    const { user, accessToken } = useContext(AppContext);

    const handleLogout = () => {
        // Xóa token
        localStorage.removeItem('token');
        // Thực hiện các hành động khác nếu cần
    };

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

                <Nav>
                    {accessToken ? (
                        <Nav.Item className='p-2'>
                            <NavDropdown title={<span className={styles.username}>{user ? user.username : 'User'}</span>} id="basic-nav-dropdown">
                                <NavDropdown.Item href="/profile/profileInfo"><FaUser /> User profile</NavDropdown.Item>
                                <NavDropdown.Item href="/profile/changePassword"><FaPen /> Change password</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout}>
                                    <FaArrowRight /> Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav.Item>
                    ) : (
                        <>
                            <Nav.Item className='p-2'>
                                <Link to="/login/loginForm" className='text-dark text-decoration-none'>Login</Link>
                            </Nav.Item>
                            <Nav.Item className='p-2'>
                                <Link to="/login/registerForm" className='text-dark text-decoration-none'>Register</Link>
                            </Nav.Item>
                        </>
                    )}
                </Nav>
            </div>
        </Container>
    );
}

export default Header;
