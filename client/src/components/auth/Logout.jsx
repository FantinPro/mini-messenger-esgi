import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/user.context';

export default function Logout () {
    const navigate = useNavigate();
    const { setUser, socket } = useContext(UserContext);
    useEffect(() => {
        localStorage.removeItem('jwt');
        socket.close()
        setUser(null);
        navigate('/login');
    }, []);
}

