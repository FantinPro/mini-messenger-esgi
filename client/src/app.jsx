import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from 'react-router-dom';
import { io } from "socket.io-client";
import AuthRoute from './components/auth/AuthRoute';
import Login from './components/auth/Login';
import Logout from './components/auth/Logout';
import Register from './components/auth/Register';
import ResetPassword from './components/auth/ResetPassword';
import { UserContext } from './contexts/user.context';
import { userService } from './services/user.service';
import Box from '@mui/material/Box';

const Home = React.lazy(() => import('./components/home/Home'));
const Admin = React.lazy(() => import('./components/admin/Admin'));
const Reports = React.lazy(() => import('./components/admin/AdminContent/Reports/ReportsTable'));
const Logs = React.lazy(() => import('./components/admin/AdminContent/Logs/Logs.jsx'));
const Analytics = React.lazy(() => import('./components/admin/AdminContent/Analytics/AnalyticsTable'));
const Profile = React.lazy(() => import('./components/home/Profile/Profile'))
const Chat = React.lazy(() => import('./components/home/Chat/Chat'))
import config from './config/config';

export default function App() {

    const [user, setUser] = useState(null);
    const [socket, setSocket] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        userService.getUserByToken().then(res => {        
            if (res) {
                setUser(res);
                const newSocket = io(config.apiUrl, {
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
                                    <React.Suspense fallback={<>...</>}>
                                        <Home />
                                    </React.Suspense>
                                </AuthRoute>
                            }
                        >
                            <Route path="/" element={
                                <Box ml={1}>
                                    <h1>Welcome {user?.username} 👋</h1>
                                    <ul>
                                        <li>Start chating with your friends by sending invitations !</li>
                                    </ul>
                                </Box>
                            } />

                            <Route path="profile" element={
                                <React.Suspense fallback={<>...</>}>
                                    <Profile />
                                </React.Suspense>
                            } />
                            <Route path="friends/:friendId" element={
                                <React.Suspense fallback={<>...</>}>
                                    <Chat />
                                </React.Suspense>
                            } />
                        </Route>

                        <Route
                            element={
                                <AuthRoute role="ROLE_ADMIN" >
                                    <React.Suspense fallback={<>...</>}>
                                        <Admin />
                                    </React.Suspense>
                                </AuthRoute>
                                
                            }>
                            {/* default route is Logs */}
                            <Route path="admin/logs" element={
                                <React.Suspense fallback={<>...</>}>
                                    <Logs />
                                </React.Suspense>
                            } />
                            <Route path="admin/reports" element={
                                <React.Suspense fallback={<>...</>}>
                                    <Reports />
                                </React.Suspense>
                            } />
                            <Route path="admin/analytics" element={
                                <React.Suspense fallback={<>...</>}>
                                    <Analytics />
                                </React.Suspense>
                            } />
                            <Route path="admin" element={<Navigate to="logs" />} />
                        </Route>
                    </Routes>
                </UserContext.Provider>
            }
        </>
    );
}