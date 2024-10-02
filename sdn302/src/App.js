import { Col, Container, Row } from 'react-bootstrap';
import './App.css';
import Header from './Components/Header';
import GroupSlideBar from './Components/GroupSideBar';
import GroupSpace from './Components/GroupSpace';
import AdminSideBar from './Components/AdminSideBar';
import UserManagement from './Components/UserManagement';
import GroupList from './Components/GroupList';
import IndividualSideBar from './Components/IndividualSideBar';
import IndividualSpace from './Components/IndividualSpace';
import GroupCreate from './Components/GroupCreate';


function App() {
  return (
    <div className="App">
      <Header />
      <Container fluid>
        <Row>
          <Col md={2} className='background-color-secondary vh-95'><GroupSlideBar/></Col>
          <Col md={10} className=''>
            {/* <Row className='group-header background-color-third vh-12'>

            </Row> */}
            <Row>
              {/* <GroupSpace /> */}
              {/* <UserManagement/> */}
              <GroupList/>
              {/* <IndividualSpace/> */}
             
            </Row>
            {/* <GroupCreate/> */}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
