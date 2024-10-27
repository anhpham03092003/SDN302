import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

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
    //để tam
    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
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
            handleLogout
        }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;
