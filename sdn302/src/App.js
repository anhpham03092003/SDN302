import { Col, Container, Row } from 'react-bootstrap';
import './App.css';
import Header from './Components/Header';
import GroupSlideBar from './Components/GroupSideBar';
import GroupSpace from './Components/GroupSpace';
import GroupWorkSpace from './Pages/GroupWorkSpace';
import CreateGroup from './Pages/CreateGroup';
import { Route, Routes } from 'react-router-dom';
import BuyMembership from './Components/BuyMembership';


function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
          <Route path='/create-group' element={<CreateGroup />}></Route>
          <Route path='/group' element={<GroupWorkSpace />}>
              <Route index element={<GroupSpace />} />
              <Route path="membership" element={<BuyMembership />} />
          </Route>
      </Routes>
    </div>
  );
}

export default App;
