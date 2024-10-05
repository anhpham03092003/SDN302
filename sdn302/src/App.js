import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//For pages import
import Home from './Pages/Home';
import Login from './Pages/Login';
import Group from './Pages/Group';
import Admin from './Pages/Admin';
import MemberList from './Pages/MemberList';
import GroupWorkSpace from './Pages/GroupWorkSpace';
import CreateGroup from './Pages/CreateGroup';
//For components import
import LoginForm from './Components/Login/LoginForm';
import RegisterForm from './Components/Login/RegisterForm';
import ForgotPass from './Components/Login/ForgotPass'
import OTPInput from './Components/Login/OTPInput';
import Reset from './Components/Login/Reset'
import Dashboard from './Components/Admin_Components/Dashboard';
import './App.css';
import GroupSideBar from './Components/GroupSideBar';
import GroupSpace from './Components/GroupSpace';

import BuyMembership from './Components/BuyMembership';
import Header from './Components/Header';


function App() {
  return (
    <Router>
      <div className="App">
        <Header/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />}>
            <Route path="loginForm" element={<LoginForm />} />
            <Route path="registerForm" element={<RegisterForm />} />
            <Route path="forgotPass" element={<ForgotPass />} />
          </Route>
          <Route path="otp" element={<OTPInput />} />
          <Route path="resetPass" element={<Reset />} />

          <Route path="/groups" element={<GroupWorkSpace/>}>
              <Route index element={<GroupSpace />} />
              <Route path="membership" element={<BuyMembership />} />
              <Route path="memberList" element={<MemberList />} />
          </Route>

          <Route path="/admin" element={<Admin/>}>
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
     
          <Route path='/create-group' element={<CreateGroup />}></Route>
      
        </Routes>
      </div>
    </Router>

  );
}

export default App;
