import React, { useContext, useState } from "react";
import { Container, Row, Col, Card, Button, Form, Modal ,InputGroup, FormControl} from 'react-bootstrap';
import { MdTimelapse } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import styles from '../../Styles/Group_css/GroupList.module.css';
import { FaRegListAlt } from "react-icons/fa";
import { AppContext } from "../../Context/AppContext";
import axios from 'axios';

function GroupList() {
  const { groups , setGroups, accessToken, groups_API } = useContext(AppContext);
  const [groupCode, setGroupCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');


  const filteredGroups = groups?.filter((group) =>
    group.groupName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const joinGroupByCode = async () => {
    try {
      const response = await axios.post(
        `${groups_API}/join-by-code`,
        { groupCode },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      // Khi tham gia thành công, cập nhật nhóm và chuyển hướng
      const joinedGroup = response.data.group;
      setGroups((prevGroups) => [...prevGroups, joinedGroup]);
      setSuccess("Tham gia nhóm thành công!");
      setError(''); // Xóa lỗi nếu có

      if (joinedGroup?._id) {
        navigate(`/groups/${joinedGroup._id}`);
      }
      setShowModal(false);
    } catch (error) {
      // Xử lý lỗi và hiển thị thông báo tương ứng
      if (error.response?.status === 404) {
        setError("Không tìm thấy nhóm. Vui lòng kiểm tra mã nhóm.");
      } else if (error.response?.status === 400) {
        setError("Bạn đã là thành viên của nhóm này.");
      } else {
        setError(error.response?.data?.message || "Không thể tham gia nhóm. Vui lòng thử lại.");
      }
      setSuccess(''); // Xóa thông báo thành công nếu có
    }
  };

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    setError(''); // Đặt lại lỗi
    setSuccess(''); // Đặt lại thông báo thành công
    joinGroupByCode();
  };

  return (
    <Container>
      <h4 className={styles.container}><MdTimelapse /> Recent Groups</h4>
      <Row>
        {groups?.slice(0, 4).map((group) => 
          group ? (
            <Col md={3} className="mb-3" key={group._id}>
              <Link to={`/groups/${group._id}`} className={styles.card}>
                <Card className="text-center" style={{ position: 'relative' }}>
                  <Card.Img src="https://blog.delivered.co.kr/wp-content/uploads/2024/04/NEWJEANS.jpg" alt={group.groupName} className={styles.cardImage} />
                  <div className={styles.cardTitle}>{group.groupName}</div>
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
      <Col  md={2}>

      <Button  variant="primary" onClick={() => setShowModal(true)}>Join Group</Button>
      </Col>
      </Row>
      <h4 className={styles.container}><FaRegListAlt /> All Groups</h4>
      <div className={styles.allGroupsContainer}>
        <Row className="ms-2">
          {filteredGroups?.map((group) => 
            group ? (
              <Col md={5} className="mb-2" key={group._id}>
                <Link to={`/groups/${group._id}`} className={styles.allGroupItem}>
                  <img src="https://blog.delivered.co.kr/wp-content/uploads/2024/04/NEWJEANS.jpg" alt={group.groupName} className={styles.allGroupImage} />
                  <span className={styles.allGroupTitle}>{group.groupName}</span>
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
            </Form.Group>
            {/* Hiển thị thông báo lỗi hoặc thành công */}
            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>{success}</p>}
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
