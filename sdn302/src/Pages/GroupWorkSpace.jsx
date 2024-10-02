import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import GroupSpace from '../Components/GroupSpace'
import GroupSideBar from '../Components/GroupSideBar'
import BuyMembership from '../Components/BuyMembership'

function GroupWorkSpace() {
  return (
    <Container fluid>
        <Row>
          <Col md={2} className='background-color-secondary vh-95'><GroupSideBar /></Col>
          <Col md={10} className=''>
            <Row className='group-header background-color-third vh-12'>

            </Row>
            <Row>
              <BuyMembership/>
            </Row>
          </Col>
        </Row>
      </Container>
  )
}

export default GroupWorkSpace
