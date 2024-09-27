import React from 'react'
import { Button, Col, Container, Dropdown, Nav, NavDropdown, Row } from 'react-bootstrap'
import {Link} from 'react-router-dom'
import { FaArrowRight, FaBell, FaNutritionix, FaPen, FaPlus, FaUser } from "react-icons/fa";
function Header() {
    return (
        <Container fluid className='d-flex justify-content-between header-background'>
            <Nav className=''>
                <Nav.Item className='ps-5 text-dark align-content-center'>
                    <Link to="/" className='fw-bolder text-decoration-none text-dark '><h5 className='fw-bolder m-0 '>COLOHURI</h5></Link>
                </Nav.Item>
                <Nav.Item className='align-content-center'>
                    <Nav.Link href="/"><p className='m-0 text-dark fs-6'>Home</p></Nav.Link>
                </Nav.Item>
                <Nav.Item className='align-content-center'>
                    <Nav.Link href="/"><p className='m-0 text-dark fs-6'>Groups</p></Nav.Link>
                </Nav.Item>
                <Nav.Item className='align-content-center'>
                    <Nav.Link href="/"><p className='m-0 text-dark fs-6'>Individual</p></Nav.Link>
                </Nav.Item> 
                <Nav.Item className='text-dark align-content-center'>
                    <Button variant='primary' className='rounded-0 btn-sm'><FaPlus></FaPlus> Create</Button>
                </Nav.Item> 
            </Nav>
            {/* <Nav>
                        <Nav.Item className='p-2 '>
                            <Nav.Link href="/" className='text-dark'>Login</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className='p-2 '>
                            <Nav.Link href="/" className='text-dark'>Register</Nav.Link>
                        </Nav.Item>
            </Nav> */}
            <Nav>
                        <Nav.Item className='align-content-center'>
                            <NavDropdown  title={<FaBell className='text-dark m-0'/>} id="basic-nav-dropdown">
                                <NavDropdown.Item href="/"><FaUser /> User profile</NavDropdown.Item>
                                <NavDropdown.Item href="/"><FaPen /> Change passwood</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#">
                                    <FaArrowRight/>  Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav.Item>
                        <Nav.Item className='align-content-center'>
                        <NavDropdown  title={<p className='text-dark m-0'>Username</p>} id="basic-nav-dropdown">
                                <NavDropdown.Item href="/"><FaUser /> User profile</NavDropdown.Item>
                                <NavDropdown.Item href="/"><FaPen /> Change passwood</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#">
                                    <FaArrowRight/>  Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav.Item>
            </Nav>
        </Container>
    )
}

export default Header
