import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import GroupSideBar from '../Components/Group_Components/GroupSideBar';
import { Outlet, useParams } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa6';
import { GrMoreVertical } from 'react-icons/gr';
import AddMember from '../Components/Group_Components/AddMember'; // Import AddMember
import { AppContext } from '../Context/AppContext';
import axios from 'axios';

function GroupWorkSpace() {
  const {groupId}=  useParams();
  const {groups_API,group,setGroup,accessToken} = useContext(AppContext);
  
  useEffect(()=>{
    axios.get(`${groups_API}/${groupId}/get-group`,{headers:{ Authorization: `Bearer ${accessToken}`}})
    .then((res)=>{setGroup(res.data)})
    .catch((err) => console.error(err));
  },[])
  const [showAddMemberModal, setShowAddMemberModal] = useState(false); // State to control modal visibility

  const handleShow = () => setShowAddMemberModal(true);
  const handleClose = () => setShowAddMemberModal(false);
  
  return (
    <Container fluid>
      <Row>
        <Col md={2} className="background-color-secondary vh-95">
          <GroupSideBar />
        </Col>
        <Col md={10}>
          <Row className="group-header background-color-third vh-12">
            <Col md={6} className="align-content-center text-start">
              <h5>{group?.groupName}</h5>
            </Col>
            <Col md={6} className="align-content-center text-end">
              <Button className="rounded-0" onClick={handleShow}>
                <FaUserPlus /> Invite User
              </Button>
              <GrMoreVertical className="mx-2" />
            </Col>
          </Row>
          <Row>
            <Outlet />
          </Row>
        </Col>
      </Row>

      {/* AddMember Modal */}
      <AddMember show={showAddMemberModal} handleClose={handleClose} />
    </Container>
  );
}

export default GroupWorkSpace;
