import React from "react";
import GroupList from "../Components/Group_Components/GroupList";
import { Col, Container, Row } from 'react-bootstrap';
import '../App.css';
function GroupListPage() {
    return (
        <div>

      <Container fluid>
        <Row>
          <Col md={1} ></Col>
          <Col md={10} className=''>

            <Row>
              <GroupList/>           
            </Row>
          </Col>
          <Col md={1} ></Col>
        </Row>
      </Container>
        </div>
    );
}

export default GroupListPage;