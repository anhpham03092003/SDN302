import React, { createContext, useState } from 'react';
import axios from 'axios';

export const AppContext = createContext();

const AppProvider = ({ children }) => {
    //api athentication
    const login_API = `http://localhost:9999/authentication/login`;
    const register_API = `http://localhost:9999/authentication/register`;
    const forrgot_API = `http://localhost:9999/authentication/forgot-password`;
    const changePassword_API = `http://localhost:9999/authentication/reset-password`;

    //login
    const loginUser = async (username, password) => {
        try {
            const response = await axios.post(login_API, { username, password });
            return response.data;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    //register
    const registerUser = async (username, password, email, rePassword, phoneNumber) => {
        try {
            const response = await axios.post(register_API, { username, password, email, rePassword, phoneNumber });
            return response.data;
        } catch (error) {
            console.error("Register error:", error);
            throw error;
        }
    };

    //forgot password
    const forgotPassword = async (email, username) => {
        try {
            const response = await axios.post(forrgot_API, { email, username });
            return response.data;
        } catch (error) {
            console.error("Register error:", error);
            throw error;
        }
    };

    // Change password function
    const changePassword = async (id, token, password, confirmPassword) => {
        try {
            const response = await axios.post(`${changePassword_API}/${id}/${token}`, { password, confirmPassword });
            return response.data;
        } catch (error) {
            console.error("Change password error:", error);
            throw error;
        }
    };


    return (
        <AppContext.Provider value={{
            loginUser,
            registerUser,
            forgotPassword,
            changePassword
        }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;
