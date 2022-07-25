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
import Chat from './components/home/Main/Chat';
import { UserContext } from './contexts/user.context';
import { userService } from './services/user.service';

export default function App() {

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        userService.getUserByToken().then(res => {
            setUser(res);
        }).catch(err => {
            setUser(null);
        }).finally(() => {
            setIsLoading(false);
        })
    }, []);

    return (
        <UserContext.Provider value={{
            user,
            setUser
        }} >
            {!isLoading &&
                <Routes>

                    <Route path="login" element={
                        user ? <Navigate to="/" /> : <Login />
                    } />
                    <Route path="register" element={
                        user ? <Navigate to="/" /> : <Register />
                    } />
                    <Route path="/logout" element={<Logout />} />

                    <Route
                        path="/"
                        element={
                            <AuthRoute >
                                <Home />
                            </AuthRoute>
                        }
                    >
                        <Route path="friends/:friendId" element={
                            <Chat />
                        } />
                    </Route>

                    <Route
                        element={
                            <Admin />
                        }>
                        {/* default route is Logs */}
                        <Route path="admin/logs" element={<Logs />} />
                        <Route path="admin/reports" element={<Reports />} />
                        <Route path="admin" element={<Navigate to="logs" />} />
                    </Route>
                </Routes>
            }
        </UserContext.Provider>
    );
}