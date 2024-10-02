import React from "react";
import { Container, Row, Col, Card } from 'react-bootstrap';
import { MdTimelapse } from "react-icons/md";
import { Link } from 'react-router-dom';
import styles from '../Styles/GroupList.module.css';


function GroupList() {
  const groups = [
    {
      id: 1,
      title: "Group 1",
      image: "https://blog.delivered.co.kr/wp-content/uploads/2024/04/NEWJEANS.jpg"
    },
    {
      id: 2,
      title: "Group 2",
      image: "https://blog.delivered.co.kr/wp-content/uploads/2024/04/NEWJEANS.jpg" 
    },
    {
      id: 3,
      title: "Group 3",
      image: "https://blog.delivered.co.kr/wp-content/uploads/2024/04/NEWJEANS.jpg" 
    },
    {
      id: 4,
      title: "Group 4",
      image: "https://blog.delivered.co.kr/wp-content/uploads/2024/04/NEWJEANS.jpg" 
    },
    {
      id: 5,
      title: "Group 5",
      image: "https://blog.delivered.co.kr/wp-content/uploads/2024/04/NEWJEANS.jpg" 
    },
    {
      id: 6,
      title: "Group 6",
      image: "https://blog.delivered.co.kr/wp-content/uploads/2024/04/NEWJEANS.jpg" 
    },
    {
      id: 7,
      title: "Group 7",
      image: "https://blog.delivered.co.kr/wp-content/uploads/2024/04/NEWJEANS.jpg" 
    },
    {
      id: 8,
      title: "Group 8",
      image: "https://blog.delivered.co.kr/wp-content/uploads/2024/04/NEWJEANS.jpg" 
    },
    {
      id: 9,
      title: "Group 9",
      image: "https://blog.delivered.co.kr/wp-content/uploads/2024/04/NEWJEANS.jpg" 
    },
    {
      id: 10,
      title: "Group 10",
      image: "https://blog.delivered.co.kr/wp-content/uploads/2024/04/NEWJEANS.jpg" 
    },
    {
      id: 11,
      title: "Group 11",
      image: "https://blog.delivered.co.kr/wp-content/uploads/2024/04/NEWJEANS.jpg" 
    }
  ];

  return (
    <Container>
     
      <h4 className={styles.container}> <MdTimelapse/> Recent Groups</h4>
      <Row>
        {groups.slice(0, 4).map((group) => ( 
          <Col md={3} className="mb-3" key={group.id}>
            <Link to={`/group/${group.id}`} className={styles.card}>
              <Card className="text-center" style={{ position: 'relative' }}>
                <Card.Img src={group.image} alt={group.title} className={styles.cardImage} />
                
                <div className={styles.cardTitle}>{group.title}</div>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
      <h4 className={styles.container}>All Groups</h4>
      <div className={styles.allGroupsContainer}>
        <Row className="ms-2">
          {groups.map((group) => (
            <Col md={5} className="mb-2" key={group.id}>
              <Link to={`/group/${group.id}`} className={styles.allGroupItem}>
                <img src={group.image} alt={group.title} className={styles.allGroupImage} />
                <span className={styles.allGroupTitle}>{group.title}</span>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
}

export default GroupList;
