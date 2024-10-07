import React from "react";
import { Row, Col, Form , Button} from "react-bootstrap";
import styles from '../Styles/GroupCreate.module.css';

function GroupCreate() {
    return (
        <div className="container">

        
        <Row className=""> 
            <Col md={4} className="d-flex align-items-center"> 
         
            <div className={styles.form}>
            <Form >
                    <h3>Create New Project</h3>
                    <Form.Group controlId="formProjectName">
                        <Form.Label>Project Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter project name" />
                    </Form.Group>
                    <Form.Group controlId="formProjectCode">
                        <Form.Label>Project Code</Form.Label>
                        <Form.Control type="text" placeholder="Enter project code" />
                    </Form.Group>
                    <Form.Group controlId="formProjectPassword">
                        <Form.Label>Project Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter project password" />
                    </Form.Group>
                </Form>
             
                <Button variant="primary" >
                    Create Project
                </Button>
                </div>
                
              
            </Col>
            <Col md={8} className="">
                
                <img src="https://i.pinimg.com/564x/d6/1c/31/d61c310bc70efc39156912f8f06dd44e.jpg"style={{ width: '1060px', height: '730px'}} />
            </Col>
        </Row>
        </div>
    );
}

export default GroupCreate;
