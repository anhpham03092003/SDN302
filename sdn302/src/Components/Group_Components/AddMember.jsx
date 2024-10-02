import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddMember = ({ show, handleClose }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle adding the member here
    console.log('Member Added:', { email, name });
    handleClose(); // Close the modal after submission
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Invite Members to your team</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formEmail">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Eg. john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formName">
            <Form.Label>Name (Optional)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Eg. John"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
            Send Invitation
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddMember;
