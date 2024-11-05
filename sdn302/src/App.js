import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
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
import ForgotPass from './Components/Login/ForgotPass';
import Reset from './Components/Login/Reset';
import Dashboard from './Components/Admin_Components/Dashboard';
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
import NotAuthorized from './Pages/NotAuthorized';
import NotFound from './Pages/NotFound';

//hook
import useGroupAccess from './Components/Hook_Components/useGroupAccess.jsx';

import './App.css';
import AppProvider, { AppContext } from './Context/AppContext'; // Import AppContext

import AdminDashboard from './Pages/AdminDashboard';

const GroupWorkspaceWrapper = () => {
  const hasAccess = useGroupAccess();
  const navigate = useNavigate();
  if (hasAccess === false)
    navigate('/not-found');
  return null;

  return <GroupWorkSpace />;
};

function App() {
  const { checkTokenExpiration, accessToken, user } = useContext(AppContext); // Lấy hàm checkTokenExpiration từ context
  const location = useLocation();

  useEffect(() => {
    checkTokenExpiration();

    const interval = setInterval(() => {
      checkTokenExpiration();
    }, 60000); // check mỗi 1p

    return () => clearInterval(interval);
  }, [checkTokenExpiration]);

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/not-authorized" element={<NotAuthorized />} />
        <Route path="/not-found" element={<NotFound />} />

        {!accessToken && (
          <Route path="/login" element={<Login />}>
            <Route path="loginForm" element={<LoginForm />} />
            <Route path="registerForm" element={<RegisterForm />} />
            <Route path="forgotPass" element={<ForgotPass />} />
            <Route path="verifyAccount/:id/:token" element={<VerifyAccount />} />
          </Route>
        )}

        <Route path="resetPassword/:id/:token" element={<Reset />} />

        <Route path="/profile" element={accessToken && user ? <ProfilePage /> : <Navigate to="/not-found" replace />} >
          <Route path="profileInfo" element={<ProfileInfo />} />
          <Route path="editProfile" element={<EditProfile />} />
          <Route path="changePassword" element={<ChangePassword />} />
        </Route>


        <Route path="/admin" element={accessToken && user?.role === 'admin' ? <Admin /> : <Navigate to="/not-authorized" replace />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="userManagement" element={<UserManagementPage />} />
        </Route>

        <Route path="/individualSpace" element={accessToken && user ? <IndividualSpacePage /> : <Navigate to="/not-found" replace />} />

        {accessToken && <Route path="/groups"  >
          <Route index element={<GroupListPage />} />
          <Route path="create" element={<CreateGroup />} />
          <Route path=":groupId" element={<GroupWorkspaceWrapper />}>
            <Route index element={<GroupSpace />} />
            <Route path="membership" element={<BuyMembership />} />
            <Route path="memberList" element={<MemberList />} />
            <Route path="membership/checkOut" element={<Payment />} />
            <Route path="groupSetting" element={<GroupSetting />} />
          </Route>
        </Route>}

      </Routes>
    </div>
  );
}

export default App;
