import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isAuthenticated, setisAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const storedData = JSON.parse(localStorage.getItem('user_data'));

    useEffect(() => {
        if(storedData) {
            const {access_token, user_id, role} = storedData;
            const user = {
                user_id,
                role
            };

            setToken(access_token);
            setUserData(user);
            setisAuthenticated(true);
            setLoading(false);
        }
        setLoading(false);
    }, []);

    const login = (newToken, newData, role) => {
        localStorage.setItem("user_data", JSON.stringify({ access_token: newToken, user_id: newData, role: role}));

        const user = {
            user_id: newData,
            role
        };

        setToken(newToken);
        setUserData(user);
        setisAuthenticated(true);
        setLoading(false);
    };


    const logout = () => {
        localStorage.removeItem("user_data");

        setToken(null);
        setUserData(null);
        setisAuthenticated(false);
        setLoading(false);
    }

    return <AuthContext.Provider value={{ token, isAuthenticated, login, logout, userData, loading }}>
        {children}
    </AuthContext.Provider>
}

export const userAuth = () => useContext(AuthContext);