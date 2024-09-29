import React from 'react';
import { Accordion, Container } from 'react-bootstrap';
import styles from '../../Styles/Home_css/Layout.module.css';
import { IoMdHelpCircleOutline } from "react-icons/io";

function FAQ() {
    return (
        <div>
            <Container className={styles.secondContainer}>
                <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header><strong><IoMdHelpCircleOutline style={{ marginRight: 5 }} />What's our purpose?</strong></Accordion.Header>
                        <Accordion.Body>
                            Our purpose is to help you streamline your tasks and manage your time more effectively with our intuitive tools and features.
                            We aim to simplify your daily routine and reduce stress by providing a clear overview of your responsibilities.
                            With our platform, you can focus on what truly matters and achieve your goals more efficiently.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header><strong><IoMdHelpCircleOutline style={{ marginRight: 5 }} />What can it bring for you?</strong></Accordion.Header>
                        <Accordion.Body>
                            It can bring increased productivity, better organization, and peace of mind by keeping all your tasks in one place.
                            Our tools are designed to help you prioritize tasks and meet deadlines without feeling overwhelmed.
                            Additionally, you’ll benefit from insights and reports that track your progress and highlight areas for improvement.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2">
                        <Accordion.Header><strong><IoMdHelpCircleOutline style={{ marginRight: 5 }} />Is it free?</strong></Accordion.Header>
                        <Accordion.Body>
                            Yes, our basic plan is completely free to use. We also offer premium features for advanced needs.
                            The premium plan includes additional customization options, advanced analytics, and priority support to help you get the most out of our platform.
                            You can upgrade at any time if you find that you need more functionality.
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Container>
        </div>
    )
}

export default FAQ