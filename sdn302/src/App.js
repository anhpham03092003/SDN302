import React from 'react';
import { BrowserRouter ,Router, Routes, Route } from 'react-router-dom';
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
import Dashboard from './Components/Admin_Components/Dashboard'
import GroupListPage from './Pages/GroupListPage';
import UserManagementPage from './Pages/UserManagementPage';
import IndividualSpacePage from './Pages/IndividualSpacePage';
import GroupSpace from './Components/Group_Components/GroupSpace';

import './App.css';
import GroupSideBar from './Components/Group_Components/GroupSideBar';


import BuyMembership from './Components/Group_Components/BuyMembership';
import Header from './Components/Header';


function App() {
  return (
    <BrowserRouter> 
      <div className="App">
        <Header />
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

          <Route path="/groups" element={<GroupListPage />} >
            <Route path="create" element={<CreateGroup />} />

            <Route path="name" element={<GroupWorkSpace />} >
              <Route index element={<GroupSpace />} />
              <Route path="membership" element={<BuyMembership />} />
              <Route path="memberList" element={<MemberList />} />
            </Route>

          </Route>

          <Route path="/admin" element={<Admin />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="userManagement" element={<UserManagementPage />} />
          </Route>

          <Route path="/individualSpace" element={<IndividualSpacePage /> }> 
          </Route>

        </Routes>
      </div>
      </BrowserRouter> 


  );
}

export default App;
