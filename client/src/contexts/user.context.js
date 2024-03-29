import { createContext } from 'react';

export const UserContext = createContext({
    user: null,
    setUser: () => {},
    socket: null,
    setSocket: () => {},
    nbUsersConnected: 0,
    setNbUsersConnected: () => {},
});
