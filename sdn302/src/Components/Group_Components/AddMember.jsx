import React, { useState, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { AppContext } from '../../Context/AppContext';

const AddMember = ({ show, handleClose }) => {
  const { groups_API, group, authentication_API, accessToken } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('member');
  const groupId = group?._id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${authentication_API}/getByEmail`,
        { email },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );


      const fetchedUser = response.data;


      if (fetchedUser && fetchedUser.account && fetchedUser.account.email === email) {
        const isAlreadyMember = group.members.some(
          (member) => member._id === fetchedUser._id
        );


        if (isAlreadyMember) {
          alert('Member already exists in the group');
          return;
        }


        const inviteResponse = await axios.post(`${groups_API}/${groupId}/invite`, {
          email,
          role,
          action: 'inviteMember'
        });


        if (inviteResponse.data.error && inviteResponse.data.error.status === 400) {
          alert('You must upgrade group to invite more members!');
        } else {
          alert('Email invite sent successfully!');
          handleClose();
        }
      } else {
        alert('User with the provided email not found 1');
      }
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      if (error.response && error.response.status === 404) {
        alert('User with the provided email not found');
      } else {
        alert('An unexpected error occurred. Please try again later.');
      }
    }
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
          <Form.Group controlId="formRole">
            <Form.Label>Choose Role</Form.Label>
            <Form.Control as="select" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="member">Member</option>
              <option value="viewer">Viewer</option>
            </Form.Control>
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
