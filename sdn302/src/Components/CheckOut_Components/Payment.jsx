import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

function Payment() {
    return (
        <Container fluid className="vh-83">
            <Row className="d-flex justify-content-center mt-5">
                <Col md={6} className="mx-2 p-0 background-color-secondary">
                    <Card className="p-3">
                        <h3 className="m-0 text-center">Buy membership</h3>
                        <Row className="m-1 py-">
                            <Col md={12}>
                                <h4 className="m-0">Features included</h4>
                                <ul>
                                    <li>Unlimited groups member</li>
                                    <li>Unlimited spectial Function</li>
                                    <li>Unlimited column</li>
                                </ul>
                            </Col>
                        </Row>
                        <Row className="m-3 py-5">
                            <Col md={12}>
                                <Card className="p-3 border border-success">
                                    <h4 className="m-0 text-center">1000$</h4>
                                    <ul>
                                        <li>Price: 1000$</li>
                                        <li>Duration: For life</li>
                                    </ul>
                                    <Button className="rounded-0 btn-payment border-0 py-3 fw-bolder">Buy now</Button>
                                </Card>
                            </Col>
                        </Row>

                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Payment;