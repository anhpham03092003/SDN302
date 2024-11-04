import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export const AppContext = createContext();

const AppProvider = ({ children }) => {
    //token
    const accessToken = localStorage.getItem('token');
    // api
    const groups_API = "http://localhost:9999/groups"
    const authentication_API = `http://localhost:9999/authentication`;
     const users_API = "http://localhost:9999/users"
    //parameter
    const [groups, setGroups] = useState([]);
    const [group, setGroup] = useState()
    const [user, setUser] = useState()
    const navigate = useNavigate();
    const [selectedTask, setSelectedTask] = useState();
    const [show, setShow] = useState(false);
    const [groupMembers, setGroupMembers] = useState([]);
    const [showUpgrade,setShowUpgrade]=useState(false)
    const [currentUserRole, setCurrentUserRole] = useState(null);



    //call api
    useEffect(() => {
        axios.get(`${groups_API}/get-group`, { headers: { Authorization: `Bearer ${accessToken}` } })
            .then((res) => { setGroups(res.data) })
    }, [accessToken]);


    useEffect(() => {
        axios.get(`${users_API}/get-profile`, { headers: { Authorization: `Bearer ${accessToken}` } })
            .then((res) => { setUser(res.data) })
    }, [accessToken]);
   
    //fuction
    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setGroups([]);
    };


    //check token
    const checkTokenExpiration = () => {
        const token = localStorage.getItem('token');
        if (token) {
            const { exp } = jwtDecode(token);
            if (Date.now() >= exp * 1000) {
                localStorage.removeItem('token'); // Xóa token
                setUser(null); // Xóa thông tin người dùng
                alert('Session expired, please log in again');
                navigate('/login/loginForm'); // Điều hướng về trang đăng nhập
            }
        }
    };


    //fuction
    const editTask = async (name, value, groupId) => {
        const response = await axios.put(`${groups_API}/${groupId}/tasks/${selectedTask?._id}/edit`, { [name]: value }, { headers: { Authorization: `Bearer ${accessToken}` } })
        return response
    }
    const editSubTask = async (name, value, groupId, subTask) => {
        const response = await axios.put(`${groups_API}/${groupId}/tasks/${selectedTask?._id}/subTasks/${subTask._id}/edit`, { [name]: value }, { headers: { Authorization: `Bearer ${accessToken}` } })
        return response
    }


    // api groups



    return (
        <AppContext.Provider value={{
            groups_API,
            accessToken,
            groups, setGroups,
            user, setUser,
            group, setGroup,
            authentication_API,
            groupMembers, setGroupMembers,
            show, setShow,
            selectedTask, setSelectedTask,
            currentUserRole, setCurrentUserRole,
            editTask,
            editSubTask,
            handleLogout,
            checkTokenExpiration,
            showUpgrade,setShowUpgrade
        }}>
            {children}
        </AppContext.Provider>
    );
};


export default AppProvider;
