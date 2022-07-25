import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { io } from "socket.io-client";
import Messages from './Messages';
import MessageInput from './MessageInput';
import { friendService } from '../../../services/friend.service';
import { UserContext } from '../../../contexts/user.context';
import { Box } from '@mui/material';

export default function Chat() {
    const [socket, setSocket] = useState(null);
    let params = useParams();
    const [messages, setMessages] = useState([]);
    const [friend, setFriend] = useState({});
    const { user } = useContext(UserContext);
    
    
    useEffect(() => {
        const loadFriendChat = async () => {
            if (friend.id === params.friendId) return;

            await friendService.getFriendChat(params.friendId).then(res => {
                setMessages(res.messages);
                setFriend(res.friend);
            });
        }

        loadFriendChat();
    }, [params]);

    useEffect(() => {
        const newSocket = io(`http://${window.location.hostname}:9000`);
        setSocket(newSocket);
        newSocket.emit('login', user.id);
        return () => newSocket.close();
    }, [setSocket]);

    return (
        <div>
            {socket && friend ? (
                <>
                    <h2>@ {friend.username}</h2>
                    <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', flex: '1 1 auto' }}>
                        <Messages socket={socket} oldMessages={messages} friend={friend} sx={{ flex: '1 1 auto' }} />
                        <MessageInput socket={socket} friend={friend} fixed sx={{ bottom: '0px'}} />
                    </Box>
                </>
            ) : (
                <div>Not Connected</div>
            )}
        </div>
    );
}