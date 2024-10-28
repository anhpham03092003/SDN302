import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styles from '../../Styles/Checkout/Checkout.module.css';
import axios from 'axios';

function Payment() {
    const handleZaloPayClick = async () => {
        try {
            const response = await axios.post('http://localhost:8888/payment');
            if (response.data.order_url) {
                // Chuyển hướng đến trang thanh toán của ZaloPay
                window.location.href = response.data.order_url;
            }
        } catch (error) {
            console.error('Payment error:', error);
            alert('Giao dịch thất bại. Vui lòng thử lại!');
        }
    };

    const handleOtherPaymentClick = () => {
        // Hiển thị thông báo "coming soon"
        alert("Coming soon");
    };

    return (
        <Container fluid className={`${styles.checkoutContainer} vh-83 bg-white`}>
            <Row className="justify-content-center mt-5">
                <Col md={8} className={styles.paymentMethodSection}>
                    <h4>Select payment method</h4>
                    <Row className="mt-3">
                        <Col onClick={handleZaloPayClick} style={{ cursor: 'pointer' }}>
                            <img
                                src="/images/zalopay.png"
                                alt="Zalo Pay"
                                className={styles.paymentImage}
                            />
                        </Col>
                        <Col onClick={handleOtherPaymentClick} style={{ cursor: 'pointer' }}>
                            <img
                                src="/images/vnpay.png"
                                alt="VNPay"
                                className={styles.paymentImage}
                                style={{ filter: 'grayscale(100%)' }} // Làm mờ biểu tượng
                            />
                        </Col>
                        <Col onClick={handleOtherPaymentClick} style={{ cursor: 'pointer' }}>
                            <img
                                src="/images/paypal.png"
                                alt="Paypal"
                                className={styles.paymentImage}
                                style={{ filter: 'grayscale(100%)' }} // Làm mờ biểu tượng
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default Payment;
