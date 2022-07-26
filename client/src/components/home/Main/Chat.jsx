import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from "socket.io-client";
const socket = io('wss://messenger.zhenzhen.fr');

export default function Chat() {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [lastPong, setLastPong] = useState(null);
    useEffect(() => {

        console.log('okkkk')
        socket.on('connect', () => {

            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        socket.on('pong', () => {
            setLastPong(new Date().toISOString());
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('pong');
        };
    }, [])

    const sendPing = () => {
        socket.emit('ping');
    }

    let params = useParams();
    return (
        <div>
            <h1>Chat conv n° : {params.friendId}</h1>
            <p>Connected: {'' + isConnected}</p>
            <p>Last pong: {lastPong || '-'}</p>
            <button onClick={sendPing}>Send ping</button>
        </div>
    );
}