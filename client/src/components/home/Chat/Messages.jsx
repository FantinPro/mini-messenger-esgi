import { Box } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../../contexts/user.context';
import Message from './Message';

function Messages({ socket, oldMessages }) {
    const { user } = useContext(UserContext);
    const [messages, setMessages] = useState([]);
    let params = useParams();
    const bottomRef = useRef(null);

    useEffect(() => {
        console.log('messages', messages);
    }, [messages]);

    useEffect(() => {
        setMessages(oldMessages);
    }, [params, oldMessages]);

    useEffect(() => {
        const messageListener = (message) => {
            console.log('new message', message)
            if (message.senderId === params.friendId || message.senderId === user.id) {
                setMessages((prevMessages) => {
                    const newMessages = [ ...prevMessages ];
                    newMessages.push(message);
                    return newMessages;
                });
            }
        };
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

        const onMessageUpdate = (message) => {
            console.log('message update', message)

            setMessages((prevMessages) => {
                const newMessages = [...prevMessages];
                const index = prevMessages.findIndex((m) => m.id === message.id);
                newMessages[index] = message;
                return newMessages;
            });
        };


        socket.on('message', messageListener);
        socket.on('delete', onMessageUpdate);
        socket.on('update', onMessageUpdate);
        socket.emit('getMessages');

        return () => {
            socket.off('message', messageListener);
            socket.off('delete', onMessageUpdate);
            socket.off('update', onMessageUpdate);
        };
    }, [socket, params, messages]);

    


    

    return (
        <Box sx={{ flex: '1 0 0', overflowY: 'auto' }}>
            {[...Object.values(messages)]
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                .map((message) => (
                    <Message key={message.id} message={message} socket={socket}/>
                ))
            }
            <div ref={bottomRef} />
        </Box>
    );
}

export default Messages;
