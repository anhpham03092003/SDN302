import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { FaAngleLeft, FaAngleRight, FaLayerGroup, FaPlus } from 'react-icons/fa'
import { FaGear, FaUserGroup } from "react-icons/fa6"
import { MdOutlineWorkspacePremium, MdWorkspaces } from "react-icons/md"
import { AiOutlineGroup } from "react-icons/ai";
import { IoChevronBackOutline } from "react-icons/io5";
import {Link} from 'react-router-dom'
function GroupSideBar() {
    return (
        <div>
            <Row className='vh-12 border-2  border-bottom border-white'>
                <Col className='align-content-center text-start' md={3}><AiOutlineGroup className='display-6' /></Col>
                <Col className='align-content-center text-start' md={9}>
                    <h4>Group Name</h4>
                    <p>Vip / Basic</p>
                </Col>
            </Row>
            <Row className='py-2 sidebar-items'>
                <Col className='align-content-center text-start' md={2}><MdWorkspaces/></Col>
                <Col className='align-content-center text-start' md={10}>
                    <p className='m-0'><Link to='   ' className='text-decoration-none text-dark'>Workspace</Link></p>
                </Col>
            </Row>
            <Row className='py-2 sidebar-items'>
                <Col className='align-content-center text-start' md={2}><FaGear/></Col>
                <Col className='align-content-center text-start' md={10}>
                    <p className='m-0'> Group Settings</p>
                </Col>
            </Row>
            <Row className='py-2 sidebar-items'>
                <Col className='align-content-center text-start' md={2}><FaUserGroup/></Col>
                <Col className='align-content-center text-start' md={10}>
                    <p className='m-0'><Link to='memberList' className='text-decoration-none text-dark'>Manage members</Link>  </p>
                </Col>
            </Row>
            <Row className='py-2 sidebar-items border-bottom border-3 border-white'>
                <Col className='align-content-center text-start' md={2}><FaPlus/></Col>
                <Col className='align-content-center text-start' md={10}>
                    <p className='m-0'> Invite member</p>
                </Col>
            </Row>
            <Row className='py-2 sidebar-items'>
                <Col className='align-content-center text-start' md={2}><IoChevronBackOutline/></Col>
                <Col className='align-content-center text-start' md={10}>
                    <p className='m-0'><Link to='/groups' className='text-decoration-none text-dark'>Back to groups list</Link> </p>
                </Col>
            </Row>
            <Row className='py-3 btn-membership'>
                <Col className='align-content-center text-center  ' md={12}>
                    <h5 className='m-0'> <Link to='membership' className='text-decoration-none text-white'><MdOutlineWorkspacePremium/>Buy Membership</Link></h5>
                </Col>
            </Row>
        </div>
    )
}

export default GroupSideBar
