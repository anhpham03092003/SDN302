import { Col, Container, Row } from 'react-bootstrap';
import './App.css';
import Header from './Components/Header';
import GroupSlideBar from './Components/GroupSlideBar';


function App() {
  return (
    <div className="App">
      <Header/>
      <Container fluid>
        <Row>
          <Col md={2}  className='slide-bar-background vh-100'><GroupSlideBar/></Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
