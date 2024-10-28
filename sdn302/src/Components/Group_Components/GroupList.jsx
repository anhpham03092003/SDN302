import React, { useContext, useState } from "react";
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import { MdTimelapse } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import styles from '../../Styles/Group_css/GroupList.module.css';
import { FaRegListAlt } from "react-icons/fa";
import { AppContext } from "../../Context/AppContext";
import axios from 'axios';

function GroupList() {
  const { groups, setGroups, accessToken, groups_API } = useContext(AppContext);
  const [groupCode, setGroupCode] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const joinGroupByCode = async () => {
    try {
      const response = await axios.post(
        `${groups_API}/join-by-code`,
        { groupCode },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const joinedGroup = response.data.group;
      setGroups((prevGroups) => [...prevGroups, joinedGroup]);
      setMessage("Joined the group successfully!");

      // Navigate directly to the group page using the group's ID
      navigate(`/groups/${joinedGroup?._id}`); 
      setShowModal(false);
    } catch (error) {
      // Check if the error message is related to group not found
      if (error.response?.status === 404) {
        setMessage("Group not found. Please check the group code.");
      } else {
        setMessage(error.response?.data?.message || "Failed to join the group. Please try again.");
      }
    }
  };

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    joinGroupByCode();
  };

  return (
    <Container>
      <h4 className={styles.container}><MdTimelapse /> Recent Groups</h4>
      <Row>
        {groups?.slice(0, 4).map((group) => (
          <Col md={3} className="mb-3" key={group._id}>
            <Link to={`/groups/${group._id}`} className={styles.card}>
              <Card className="text-center" style={{ position: 'relative' }}>
                <Card.Img src="https://blog.delivered.co.kr/wp-content/uploads/2024/04/NEWJEANS.jpg" alt={group.groupName} className={styles.cardImage} />
                <div className={styles.cardTitle}>{group.groupName}</div>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
      
      <Button className={styles.buttonJoin} variant="primary" onClick={() => setShowModal(true)}>Join Group</Button>
      <h4 className={styles.container}><FaRegListAlt /> All Groups</h4>
      <div className={styles.allGroupsContainer}>
        <Row className="ms-2">
          {groups?.map((group) => (
            <Col md={5} className="mb-2" key={group._id}>
              <Link to={`/groups/${group._id}`} className={styles.allGroupItem}>
                <img src="https://blog.delivered.co.kr/wp-content/uploads/2024/04/NEWJEANS.jpg" alt={group.groupName} className={styles.allGroupImage} />
                <span className={styles.allGroupTitle}>{group.groupName}</span>
              </Link>
            </Col>
          ))}
        </Row>
      </div>

      {/* Join Group Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Join Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleJoinSubmit}>
            <Form.Group controlId="groupCode">
              <Form.Label>Group Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter group code"
                value={groupCode}
                onChange={(e) => setGroupCode(e.target.value)}
                required
              />
            </Form.Group>
            {message && <p className={styles.message}>{message}</p>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleJoinSubmit}>Join Group</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default GroupList;
