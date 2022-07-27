import React, { useEffect, useState, useContext } from "react";
import { Navigate, Route, Routes } from 'react-router-dom';
import Admin from './components/admin/Admin';
import Logs from './components/admin/AdminContent/Logs/Logs.jsx';
import Reports from './components/admin/AdminContent/Reports/ReportsTable';
import AuthRoute from './components/auth/AuthRoute';
import Login from './components/auth/Login';
import Logout from './components/auth/Logout';
import Register from './components/auth/Register';
import Home from './components/home/Home';
import Chat from './components/home/Chat/Chat';
import { UserContext } from './contexts/user.context';
import { userService } from './services/user.service';
import ResetPassword from './components/auth/ResetPassword';
import Profile from './components/home/Profile/Profile';
import Analytics from "./components/admin/AdminContent/Analytics/AnalyticsTable";
import { io } from "socket.io-client";

export default function App() {

    const [user, setUser] = useState(null);
    const [socket, setSocket] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        userService.getUserByToken().then(res => {        
            if (res) {
                setUser(res);
                const newSocket = io(`http://${window.location.hostname}:9000`, {
                    query: { userId: res.id }
                });
                setSocket(newSocket);
            }
        }).catch(err => {
            setUser(null);
        }).finally(() => {
            setIsLoading(false);
        })
    }, []);

    return (
        <>
            {!isLoading &&
                <UserContext.Provider value={{
                    user,
                    setUser,
                    socket,
                    setSocket
                }} >
                    
                    <Routes>

                        <Route path="login" element={
                            user ? <Navigate to="/" /> : <Login />
                        } />
                        <Route path="register" element={
                            user ? <Navigate to="/" /> : <Register />
                        } />
                        <Route path="/logout" element={<Logout />} />

                        <Route path="/reset-password" element={<ResetPassword />} />

                        <Route
                            path="/"
                            element={
                                <AuthRoute >
                                    <Home />
                                </AuthRoute>
                            }
                        >
                            <Route path="profile" element={<Profile />} />
                            <Route path="friends/:friendId" element={
                                <Chat />
                            } />
                        </Route>

                        <Route
                            element={
                                <AuthRoute role="ROLE_ADMIN" >
                                    <Admin />
                                </AuthRoute>
                                
                            }>
                            {/* default route is Logs */}
                            <Route path="admin/logs" element={<Logs />} />
                            <Route path="admin/reports" element={<Reports />} />
                            <Route path="admin/analytics" element={<Analytics />} />
                            <Route path="admin" element={<Navigate to="logs" />} />
                        </Route>
                    </Routes>
                </UserContext.Provider>
            }
        </>
    );
}