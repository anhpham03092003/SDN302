import { Col, Container, Row } from 'react-bootstrap';
import './App.css';
import Header from './Components/Header';
import GroupSlideBar from './Components/GroupSideBar';
import GroupSpace from './Components/GroupSpace';


function App() {
  return (
    <div className="App">
      <Header />
      <Container fluid>
        <Row>
          <Col md={2} className='background-color-secondary vh-95'><GroupSlideBar /></Col>
          <Col md={10} className=''>
            <Row className='group-header background-color-third vh-12'>

            </Row>
            <Row>
              <GroupSpace/>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
