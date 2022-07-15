import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from 'react-router-dom';
import Admin from './components/admin/Admin';
import AuthRoute from './components/auth/AuthRoute';
import Login from './components/auth/Login';
import Logout from './components/auth/Logout';
import Register from './components/auth/Register';
import ErrorBoundary from './components/error/ErrorBoundary';
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
            { !isLoading &&
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
                        <Route path="friends/:friendId" element={<Chat />} />
                    </Route>

                    <Route
                        path="admin"
                        element={
                            <AuthRoute role='ROLE_ADMIN' >
                                <Admin />
                            </AuthRoute>
                        } />
                </Routes>
            }
        </UserContext.Provider>
    );
}