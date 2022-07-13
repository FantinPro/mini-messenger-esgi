/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../contexts/user.context';

export default function AuthRoute({ children, role  }) {
    const { user } = useContext(UserContext);

    if (!user) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/login" />;
    }

    if (role && user.role !== role) {
        return <Navigate to="/" />;
    }

    return children;
}