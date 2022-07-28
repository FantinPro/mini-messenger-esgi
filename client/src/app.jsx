import React, { useEffect, useState } from "react";
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
import { browserName } from 'react-device-detect';
import { analyticService } from './services/analytic.service';

export default function App() {

    const [user, setUser] = useState(null);
    const [socket, setSocket] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [nbUsersConnected, setNbUsersConnected] = useState(0);

    useEffect(() => {
        userService.getUserByToken().then(res => {        
            if (res) {
                setUser(res);
                const newSocket = io(`http://${window.location.hostname}:9000`, {
                    query: { userId: res.id }
                });
                setSocket(newSocket);
            }
        }).catch(_ => {
            setUser(null);
        }).finally(() => {
            setIsLoading(false);
        })
    }, []);

    socket && socket.on('connect', () => {

        const session_id = localStorage.getItem('session_id');

        if (!session_id) {
            let id = `id-${Math.random().toString(16).slice(2)}`;
            localStorage.setItem('session_id', id);
            const newSession = {
                sessionId: id,
                device: navigator.userAgentData.mobile ? 'Mobile' : 'Desktop',
                os: navigator.userAgentData.platform,
                browser: browserName,
                country: navigator.language.split('-')[0], 
            };
            analyticService.addNewSession({ userId: user.id, config: newSession });
            localStorage.setItem('sessionStart', new Date().getTime());
        }

        socket.on('disconnect', () => {
            const sessionEnd = new Date().getTime();
            const sessionStart = localStorage.getItem('sessionStart');
            const sessionDuration = sessionEnd - sessionStart;
            analyticService.updateSession({ userId: user.id, sessionId: session_id, duration: sessionDuration });
        })
    })
    
    return (
        <>
            {!isLoading &&
                <UserContext.Provider value={{
                    user,
                    setUser,
                    socket,
                    setSocket,
                    nbUsersConnected,
                    setNbUsersConnected
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