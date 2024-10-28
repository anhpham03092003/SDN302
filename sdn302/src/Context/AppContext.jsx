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
    //parameter
    const [groups, setGroups] = useState([]);
    const [group, setGroup] = useState()
    const [user, setUser] = useState()
    const navigate = useNavigate();



    //call api
    useEffect(() => {
        axios.get(`${groups_API}/get-group`, { headers: { Authorization: `Bearer ${accessToken}` } })
            .then((res) => { setGroups(res.data) })
    }, [])

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${authentication_API}/get-user`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                setUser(res.data); // Cập nhật thông tin người dùng
            } catch (error) {
                console.error('Error fetching user:', error.response ? error.response.data : error.message);
            }
        };
        fetchUser();
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


    // api groups
    const createGroup_API = `http://localhost:9999/groups/create`;

    const createGroup = async (group) => {
        try {
            const response = await axios.post(createGroup_API, group, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Thêm token vào header
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    };



    return (
        <AppContext.Provider value={{
            groups_API,
            accessToken,
            groups, setGroups,
            user, setUser,
            group, setGroup,
            authentication_API,
            createGroup,
            handleLogout,
            checkTokenExpiration
        }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;
