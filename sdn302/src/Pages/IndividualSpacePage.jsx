import React from "react";
import IndividualSpace from "../Components/Individual_Components/IndividualSpace";
import AdminSideBar from "../Components/Admin_Components/AdminSideBar";
import Header from "../Components/Header";
import { Col, Container, Row } from 'react-bootstrap'
import '../App.css';

function IndividualSpacePage() {
    return (
        <div className="App">
 <Container fluid>
   <Row>
     <Col md={1} ></Col>
     <Col md={10} className=''>

       <Row>
         <IndividualSpace/>
        
       </Row>
     </Col>
     <Col md={1} ></Col>
   </Row>
 </Container>
   </div>
    );
}

export default IndividualSpacePage;