import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Group from './Pages/Group';
import Admin from './Pages/Admin';
import MemberList from './Pages/MemberList';
import GroupWorkSpace from './Pages/GroupWorkSpace';
import CreateGroup from './Pages/CreateGroup';
import LoginForm from './Components/Login/LoginForm';
import RegisterForm from './Components/Login/RegisterForm';
import ForgotPass from './Components/Login/ForgotPass'
import OTPInput from './Components/Login/OTPInput';
import Reset from './Components/Login/Reset';
import ProfilePage from './Pages/ProfilePage';
import ProfileInfo from './Components/Profile/ProfileInfo';
import EditProfile from './Components/Profile/EditProfile';
import ChangePassword from './Components/Profile/ChangePassword';
import Dashboard from './Components/Admin_Components/Dashboard';
import './App.css';
import GroupSideBar from './Components/Group_Components/GroupSideBar';
import GroupSpace from './Components/Group_Components/GroupSpace';
import BuyMembership from './Components/Group_Components/BuyMembership';
import Header from './Components/Header';


function App() {
  return (
    <Router>
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

          <Route path="/profile" element={<ProfilePage />}>
            <Route path="profileInfo" element={<ProfileInfo />} />
            <Route path="editProfile" element={<EditProfile />} />
            <Route path="changePassword" element={<ChangePassword />} />
          </Route>

          <Route path="/group" element={<Group />}>
            <Route path="memberList" element={<MemberList />} />
          </Route>

          <Route path="/groups" >
            <Route path="create" element={<CreateGroup />} />

            <Route path="name" element={<GroupWorkSpace />} >
              <Route index element={<GroupSpace />} />
              <Route path="membership" element={<BuyMembership />} />
              <Route path="memberList" element={<MemberList />} />
            </Route>

          </Route>

          <Route path="/admin" element={<Admin />}>
            <Route path="dashboard" element={<Dashboard />} />
          </Route>

        </Routes>
      </div>
    </Router>
  );
}

export default App;
