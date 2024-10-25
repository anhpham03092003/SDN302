import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
export const AppContext = createContext();

const AppProvider = ({ children }) => {



    return (
        <div>
            <AppContext.Provider value={{
                
            }}>
                {children}
            </AppContext.Provider>
        </div>
    )
}

export default AppProvider
