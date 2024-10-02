import React from "react";
import { Col, Row } from 'react-bootstrap'
import { FaGear } from "react-icons/fa6";
import { AiOutlineGroup } from "react-icons/ai";
import { FaListUl } from "react-icons/fa";
import { Link } from 'react-router-dom';
import styles from '../Styles/GroupList.module.css';

function IndividualSideBar() {

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
        }
      ];

    return (
        <div className="d-flex flex-column h-100">
            {/* Top Half */}
            <div className="flex-grow-1 border-bottom border-white">
                <Row className='vh-12 border-2 border-bottom border-white'>
                    <Col className='align-content-center text-start' md={3}><AiOutlineGroup className='display-6' /></Col>
                    <Col className='align-content-center text-start' md={9}>
                        <h4>Project Name</h4>
                    </Col>
                </Row>
                <Row className='py-2 sidebar-items'>
                <Col className='align-content-center text-start' md={2}><FaGear/></Col>
                <Col className='align-content-center text-start' md={10}>
                    <p className='m-2'>Setting</p>
                </Col>
            </Row>
            </div>

            {/* Bottom Half */}
            <div className="flex-grow-1 d-flex flex-column">
            <Row className='py-2 sidebar-items'>
                <Col className='align-content-center text-start' md={2}><FaListUl/></Col>
                <Col className='align-content-center text-start' md={10}>
                    <p className='m-2'>Project List</p>
                </Col>
         
                
            </Row>
            <div className={styles.allGroupsContainer}>
        <Row >
           
           
          {groups.slice(0, 3).map((group) => (
            <Col md={12} className="mb-2 text-start" key={group.id}>
              <Link to={`/group/${group.id}`} className={styles.sidebarGroupItem}>              
                <span className={styles.sidebarGroupItem}>{group.title}</span>
              </Link>
            </Col>
          ))}
         
        </Row>
      </div>
                <Row className='py-3 btn-membership mt-auto'>
                    <Col className='align-content-center text-center text-white' md={12}>
                        <h5 className='m-0'>Buy Membership</h5>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default IndividualSideBar;
