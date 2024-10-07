import React from "react";
import IndividualSpace from "../Components/Individual_Components/IndividualSpace";
import Header from "../Components/Header";
import { Col, Container, Row } from 'react-bootstrap'
import '../App.css';

function IndividualSpacePage() {
    return (
        <div className="App">
        <Header />
 <Container fluid>
   <Row>
     {/* <Col md={2} className='background-color-secondary vh-95'><AdminSideBar/></Col> */}
     <Col md={12} className=''>

       <Row>
         <IndividualSpace/>
        
       </Row>
     </Col>
   </Row>
 </Container>
   </div>
    );
}

export default IndividualSpacePage;