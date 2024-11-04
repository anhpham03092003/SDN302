import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, Modal, InputGroup, FormControl, Alert } from 'react-bootstrap';
import { MdTimelapse } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import styles from '../../Styles/Group_css/GroupList.module.css';
import { FaRegListAlt } from "react-icons/fa";
import { AppContext } from "../../Context/AppContext";
import axios from 'axios';

function GroupList() {
  const { groups, setGroups, accessToken, groups_API } = useContext(AppContext);
  const [groupCode, setGroupCode] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Sort and filter groups
  const sortedGroups = groups?.slice().sort((a, b) => 
    new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
  );

  const filteredGroups = groups?.filter((group) =>
    group?.groupName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Join group by code
  const joinGroupByCode = async () => {
    try {
      const response = await axios.post(
        `${groups_API}/join-by-code`,
        { groupCode },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const joinedGroup = response.data.group;
      setGroups((prevGroups) => [...prevGroups, joinedGroup]);

      if (joinedGroup?._id) {
        navigate(`/groups/${joinedGroup._id}`);
      }
      setShowModal(false);
      setMessage('');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setMessage("You are already a member of this group");
        } else if (error.response.status === 404) {
          setMessage("Group not found");
        } else {
          setMessage("An error occurred. Please try again.");
        }
      } else {
        setMessage("An error occurred. Please try again.");
      }
    }
  };

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    joinGroupByCode();
  };

  useEffect(() => {
  }, [groups]);
console.log(groups);

  return (
    <Container>
      <h4 className={styles.container}><MdTimelapse /> Recent Groups</h4>
      <Row>
        {sortedGroups?.slice(0, 4).map((group) => 
          group ? (
            <Col md={3} className="mb-3" key={group?._id}>
              <Link to={`/groups/${group?._id}`} className={styles.card}>
                <Card className="text-center" style={{ position: 'relative' }}>
                  <Card.Img src="https://blog.delivered.co.kr/wp-content/uploads/2024/04/NEWJEANS.jpg" alt={group?.groupName} className={styles.cardImage} />
                  <div className={styles.cardTitle}>{group?.groupName}</div>
                </Card>
              </Link>
            </Col>
          ) : null
        )}
      </Row>
      <Row>
        <Col md={6}>
          <InputGroup>
            <FormControl
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={4}></Col>
        <Col md={2}>
          <Button variant="primary" onClick={() => setShowModal(true)}>Join Group</Button>
        </Col>
      </Row>
      <h4 className={styles.container}><FaRegListAlt /> All Groups</h4>
      <div className={styles.allGroupsContainer}>
        <Row className="ms-2">
          {filteredGroups?.map((group) => 
            group ? (
              <Col md={5} className="mb-2" key={group?._id}>
                <Link to={`/groups/${group?._id}`} className={styles.allGroupItem}>
                  <img src="https://blog.delivered.co.kr/wp-content/uploads/2024/04/NEWJEANS.jpg" alt={group?.groupName} className={styles.allGroupImage} />
                  <span className={styles.allGroupTitle}>{group?.groupName}</span>
                </Link>
              </Col>
            ) : null
          )}
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
              {message && <Alert variant="warning" className="mt-2">{message}</Alert>}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" type="submit" onClick={handleJoinSubmit}>Join Group</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default GroupList;
