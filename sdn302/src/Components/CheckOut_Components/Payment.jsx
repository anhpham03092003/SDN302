import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styles from '../../Styles/Checkout/Checkout.module.css';

function Payment() {
    return (
        <Container fluid className={`${styles.checkoutContainer} vh-83 bg-white`}>
            <Row className="justify-content-center mt-5">
                <Col md={8} className={styles.paymentMethodSection}>
                    <h4>Select payment method</h4>
                    <Row className="mt-3">
                        <Col>
                            <img
                                src="/images/zalopay.png"
                                alt="Zalo Pay"
                                className={styles.paymentImage}
                            />
                        </Col>
                        <Col>
                            <img
                                src="/images/vnpay.png"
                                alt="VNPay"
                                className={styles.paymentImage}
                                disable
                            />
                        </Col>
                        <Col>
                            <img
                                src="/images/paypal.png"
                                alt="Paypal"
                                className={styles.paymentImage}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default Payment;
