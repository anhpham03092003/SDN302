import React from 'react'
import { Button, Col, Container, Dropdown, Nav, NavDropdown, Row } from 'react-bootstrap'
import {Link} from 'react-router-dom'
import { FaArrowRight, FaBell, FaNutritionix, FaPen, FaPlus, FaUser } from "react-icons/fa";
function Header() {
    return (
        <Container fluid className='d-flex justify-content-between background-color-primary vh-5'>
            <Nav className=''>
                <Nav.Item className='ps-5  align-content-center mx-2'>
                    <Link to="/" className='fw-bolder text-decoration-none text-dark '><h5 className='fw-bolder m-0 '>COLOHURI</h5></Link>
                </Nav.Item>
                <Nav.Item className='align-content-center background-hover'>
                    <Nav.Link href="/"><p className='m-0 text-dark fs-6'>Home</p></Nav.Link>
                </Nav.Item>
                <Nav.Item className='align-content-center background-hover'>
                    <Nav.Link href="/groups"><p className='m-0 text-dark fs-6'>Groups</p></Nav.Link>
                </Nav.Item>
                <Nav.Item className='align-content-center background-hover'>
                    <Nav.Link href="/"><p className='m-0 text-dark fs-6'>Individual</p></Nav.Link>
                </Nav.Item> 
                <Nav.Item className='text-dark align-content-center'>
                    <Link to="/groups/create" className=' btn btn-primary btn-sm rounded-0  '><FaPlus></FaPlus> Create</Link>
                </Nav.Item> 
            </Nav>
            <Nav>
                        <Nav.Item className='p-2 align-content-center '>
                            <Link to="/login/loginForm" className='text-dark text-decoration-none item-hover'>Login</Link>
                        </Nav.Item>
                        <Nav.Item className='p-2 align-content-center'>
                            <Link to="/login/registerForm" className='text-dark text-decoration-none item-hover'>Register</Link>
                        </Nav.Item>
            </Nav>
            {/* <Nav>
                        <Nav.Item className='align-content-center'>
                            <NavDropdown  title={<FaBell className='text-dark m-0 item-hover'/>} id="basic-nav-dropdown">
                                <NavDropdown.Header href="/"><h5>Notifications</h5></NavDropdown.Header>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="/">Notification 1</NavDropdown.Item>
                                <NavDropdown.Item href="/">Notification 2</NavDropdown.Item>
                            </NavDropdown>
                        </Nav.Item>
                        <Nav.Item className='align-content-center'>
                        <NavDropdown  title={<p className='text-dark m-0 item-hover'>Username</p>} id="basic-nav-dropdown">
                                <NavDropdown.Item href="/"><FaUser /> User profile</NavDropdown.Item>
                                <NavDropdown.Item href="/"><FaPen /> Change passwood</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#">
                                    <FaArrowRight/>  Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav.Item>
            </Nav> */}
        </Container>
    )
}

export default Header
