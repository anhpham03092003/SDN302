import React from 'react';
import { BrowserRouter, Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Group from './Pages/Group';
import Admin from './Pages/Admin';
import MemberList from './Pages/MemberList';
import GroupWorkSpace from './Pages/GroupWorkSpace';
import CreateGroup from './Pages/CreateGroup';
import LoginForm from './Components/Login/LoginForm';
import VerifyAccount from './Components/Login/VerifyAccount';
import RegisterForm from './Components/Login/RegisterForm';
import ForgotPass from './Components/Login/ForgotPass'
import Reset from './Components/Login/Reset'
import Dashboard from './Components/Admin_Components/Dashboard'
import GroupListPage from './Pages/GroupListPage';
import UserManagementPage from './Pages/UserManagementPage';
import IndividualSpacePage from './Pages/IndividualSpacePage';
import GroupSpace from './Components/Group_Components/GroupSpace';
import BuyMembership from './Components/Group_Components/BuyMembership';
import Header from './Components/Header';
import Payment from './Components/CheckOut_Components/Payment';
import ProfilePage from './Pages/ProfilePage';
import ProfileInfo from './Components/Profile/ProfileInfo';
import EditProfile from './Components/Profile/EditProfile';
import ChangePassword from './Components/Profile/ChangePassword';
import GroupSetting from './Components/Group_Components/GroupSetting';


import './App.css';
import GroupSideBar from './Components/Group_Components/GroupSideBar';




import AdminDashboard from './Pages/AdminDashboard';
import AppProvider from './Context/AppContext';


function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />}>
              <Route path="loginForm" element={<LoginForm />} />
              <Route path="registerForm" element={<RegisterForm />} />
              <Route path="forgotPass" element={<ForgotPass />} />
              <Route path="verifyAccount/:id/:token" element={<VerifyAccount />} />
            </Route>
            <Route path="changePassword/:id/:token" element={<Reset />} />

            <Route path="/profile" element={<ProfilePage />}>
              <Route path="profileInfo" element={<ProfileInfo />} />
              <Route path="editProfile" element={<EditProfile />} />
              <Route path="changePassword" element={<ChangePassword />} />
            </Route>



            <Route path="/groups"  >
              <Route index element={<GroupListPage />} />
              <Route path="create" element={<CreateGroup />} />

              <Route path=":groupId" element={<GroupWorkSpace />} >
                <Route index element={<GroupSpace />} />
                <Route path="membership" element={<BuyMembership />} />
                <Route path="memberList" element={<MemberList />} />
                <Route path="checkOut" element={<Payment />} />
                <Route path="groupSetting" element={<GroupSetting />} />
              </Route>
            </Route>

            <Route path="/admin" element={<Admin />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="userManagement" element={<UserManagementPage />} />
            </Route>

            <Route path="/individualSpace" element={<IndividualSpacePage />}>
            </Route>

          </Routes>
        </div>
      </AppProvider>
    </BrowserRouter>


  );
}

export default App;
