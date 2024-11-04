import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Modal, Row } from 'react-bootstrap';
import GroupSideBar from '../Components/Group_Components/GroupSideBar';
import { Outlet, useParams,useNavigate  } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa6';
import { GrMoreVertical } from 'react-icons/gr';
import AddMember from '../Components/Group_Components/AddMember'; // Import AddMember
import { AppContext } from '../Context/AppContext';
import axios from 'axios';

function GroupWorkSpace() {
  const {groupId}=  useParams();
  const {groups_API,group,setGroup,accessToken,setGroupMembers,groupMembers,setCurrentUserRole,currentUserRole,user} = useContext(AppContext);
  const navigate = useNavigate(); 
  
    // Fetch group data and user role
    useEffect(() => {
      axios.get(`${groups_API}/${groupId}/get-group`, { headers: { Authorization: `Bearer ${accessToken}` } })
        .then((res) => { setGroup(res.data); })
        .catch((err) => console.error(err));
  
      axios.get(`${groups_API}/user/${groupId}/get-user-role`, { headers: { Authorization: `Bearer ${accessToken}` } })
        .then((res) => { setCurrentUserRole(res.data); })
        .catch((err) => console.error(err));
  
      axios.get(`${groups_API}/${groupId}/get-member`, { headers: { Authorization: `Bearer ${accessToken}` } })
        .then((res) => { 
          setGroupMembers(res.data.memberInfo);
        })
        .catch((err) => console.error(err));
    }, [groupId, groups_API, accessToken, setGroup, setGroupMembers, setCurrentUserRole]);
  
    // Check if the logged-in user is a member of the group
    useEffect(() => {
      const isMember = groupMembers.some(member => member?.userId === user?.userId); // Check if the user is a member
      console.log(user?.userId);
      if (!isMember) {
        navigate('/not-authorized'); // Redirect if not a member
      }
    }, [groupMembers, user, navigate]);



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
              <h5>{group?.groupName}{}</h5>
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
      <Modal
                show={showUpgrade}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header className='background-color-quadra' closeButton onHide={() => { setShowUpgrade(false) }}>
                    <Modal.Title><h5 className='text-white   fw-bolder'>Need more?</h5></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                      <Container>
                          <Row>Buy membership to unlock the restrictions</Row>  
                      </Container>
                </Modal.Body>
                <Modal.Footer>
                      <Container>
                          <Row>
                            <Col md={7}></Col>  
                            <Col md={2}><Button className=' bg-secondary border-0' onClick={()=>setShowUpgrade(false)}>Cancel</Button></Col>  
                            <Col md={2}><Button className=' btn-membership border-0'onClick={()=>{setShow(false);setShowUpgrade(false);navigate(`membership`)}} >Upgrade</Button></Col>  
                          </Row>  
                      </Container>
                </Modal.Footer>
            </Modal>
    </Container>
  );
}

export default GroupWorkSpace;
