import React, { useContext } from "react";
import { Container, Row, Col, Card } from 'react-bootstrap';
import { MdTimelapse } from "react-icons/md";
import { Link } from 'react-router-dom';
import styles from '../../Styles/Group_css/GroupList.module.css';
import { FaRegListAlt } from "react-icons/fa";
import { AppContext } from "../../Context/AppContext";


function GroupList() {
  // const groups = [
  //   {
  //     id: 1,
  //     title: "Group 1",
  //     image: "https://blog.delivered.co.kr/wp-content/uploads/2024/04/NEWJEANS.jpg"
  //   },
  //   {
  //     id: 2,
  //     title: "Group 2",
  //     image: "https://blog.delivered.co.kr/wp-content/uploads/2024/04/NEWJEANS.jpg" 
  //   }
  // ];
  const {groups} = useContext(AppContext);
  return (
    <Container>
     
      <h4 className={styles.container}> <MdTimelapse/> Recent Groups</h4>
      <Row>
        {groups.slice(0, 4).map((group) => ( 
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
      <h4 className={styles.container}><FaRegListAlt/> All Groups</h4>
      <div className={styles.allGroupsContainer}>
        <Row className="ms-2">
          {groups.map((group) => (
            <Col md={5} className="mb-2" key={group._id}>
              <Link to={`/groups/${group._id}`} className={styles.allGroupItem}>
                <img src="https://blog.delivered.co.kr/wp-content/uploads/2024/04/NEWJEANS.jpg" alt={group.groupName} className={styles.allGroupImage} />
                <span className={styles.allGroupTitle}>{group.groupName}</span>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
}

export default GroupList;
