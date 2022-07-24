import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from "socket.io-client";
import Messages from './Messages';
import MessageInput from './MessageInput';

export default function Chat() {
    const [socket, setSocket] = useState(null);
    let params = useParams();
    
    useEffect(() => {
        const newSocket = io(`http://${window.location.hostname}:9000`);
        setSocket(newSocket);
        return () => newSocket.close();
    }, [setSocket]);

    return (
        <div>
            <h1>Chat conv n° : {params.friendId}</h1>
            {socket ? (
                <div className="chat-container">
                    <Messages socket={socket} />
                    <MessageInput socket={socket} />
                </div>
            ) : (
                <div>Not Connected</div>
            )}
        </div>
    );
}