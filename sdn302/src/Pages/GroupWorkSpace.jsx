import React from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import GroupSpace from '../Components/Group_Components/GroupSpace'
import GroupSideBar from '../Components/Group_Components/GroupSideBar'
import BuyMembership from '../Components/Group_Components/BuyMembership'
import {Outlet} from 'react-router-dom'
import GroupTask from '../Components/Group_Components/GroupTask'
import GroupTaskDetail from '../Components/Group_Components/GroupTaskDetail'
import { FaPlus } from 'react-icons/fa'
import { FaUserPlus } from 'react-icons/fa6'
import { GrMoreVertical } from 'react-icons/gr'

function GroupWorkSpace() {
  return (
    <Container fluid>
        <Row>
          <Col md={2} className='background-color-secondary vh-95'><GroupSideBar /></Col>
          <Col md={10} className=''>
            <Row className='group-header background-color-third vh-12'>
                <Col md={6} className='align-content-center text-start'>
                    <h5>Group Name</h5>
                </Col>
                <Col md={6} className='align-content-center text-end'>

                    <Button className='rounded-0'><FaUserPlus/> Share</Button>
                    <GrMoreVertical className='mx-2'/> 
                </Col>
            </Row>
            <Row>
              <Outlet/>
            </Row>
          </Col>
        </Row>
      </Container>
  )
}

export default GroupWorkSpace
