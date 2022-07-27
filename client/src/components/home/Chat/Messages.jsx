import React, { useEffect, useState, useContext, useRef } from 'react';
import { Paper, Box, Typography, List, ListItem } from '@mui/material';
import DOMPurify from 'dompurify';
import { UserContext } from '../../../contexts/user.context';
import { useParams } from 'react-router-dom';
import useDebounce from '../../../hooks/useDebounce';
import './messages.css'

function Messages({ socket, oldMessages, friend }) {
    const { user } = useContext(UserContext);
    const [messages, setMessages] = useState([]);
    let params = useParams();
    const bottomRef = useRef(null);

    const [isTyping, setIsTyping] = useState(false)

    const isTypingDebounced = useDebounce(isTyping, 4000)

    useEffect(() => {
        setMessages(oldMessages);
    }, [params, oldMessages]);


    useEffect(() => {
        const messageListener = (message) => {
            if (message.sender.id === params.friendId || message.sender.id === user.id) {
                setMessages((prevMessages) => {
                    const newMessages = { ...prevMessages };
                    newMessages[message.id] = message;
                    return newMessages;
                });
            }
        };

        const isTypingListener = (message) => {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
            setIsTyping(message.id)
        }

        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

        const deleteMessageListener = (messageID) => {
            setMessages((prevMessages) => {
                const newMessages = { ...prevMessages };
                delete newMessages[messageID];
                return newMessages;
            });
        };

        socket.on('message', messageListener);
        socket.on('deleteMessage', deleteMessageListener);
        socket.on('isTyping', isTypingListener);

        socket.emit('getMessages');

        return () => {
            socket.off('message', messageListener);
            socket.off('deleteMessage', deleteMessageListener);
            socket.off('isTyping', isTypingListener);
        }
    }, [socket, params, messages]);

    useEffect(() => {
        if (isTyping) {
            setIsTyping(false)
        }
    }, [isTypingDebounced])

    const sanitizedData = (data) => ({
        __html: DOMPurify.sanitize(data)
    })

    const daysBetween = (messageDate) => {
        const today = new Date();
        const message = new Date(messageDate);
        const one = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const two = new Date(message.getFullYear(), message.getMonth(), message.getDate());
        const millisecondsPerDay = 1000 * 60 * 60 * 24;
        const millisBetween = two.getTime() - one.getTime();
        const days = millisBetween / millisecondsPerDay;
        return Math.floor(days);
    }

    return (
        <Box sx={{ flex: '1 0 0', overflowY: 'auto' }}>
            {[...Object.values(messages)]
                .sort((a, b) => a.createdAt - b.createdAt)
                .map((message) => (
                    <Box sx={{ display: 'box', marginY: '15px', marginX: '15px' }} key={message.id}>
                        <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="subtitle2"
                            color="text.primary"
                        >
                            {message.sender
                                ? message.sender.id === user.id ? 'Moi' : message.sender.username
                                : message.receiver.username}
                        </Typography>
                        <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            {`${daysBetween(message.createdAt) === 0
                                ? ' Today'
                                : daysBetween(message.createdAt) === -1
                                    ? ' Yesterday '
                                    : `${new Date(message.createdAt).toLocaleDateString()}`
                            } at ${new Date(message.createdAt).toLocaleTimeString()}`}
                        </Typography>
                        <Paper
                            elevation={1}
                            sx={{ width: "fit-content", padding: '8px', marginTop: '3px' }}
                        >
                            <div dangerouslySetInnerHTML={sanitizedData(message.text)}></div>
                        </Paper>

                    </Box>
                ))
            }
            <div ref={bottomRef} />
            <Box sx={{
                marginLeft: '1rem',
                display: 'flex',
                color: 'gray',
                visibility: isTyping ? 'visible' : 'hidden',
                alignItems: 'center',
            }}>
                <Box
                    component="img"
                    src={friend.avatar}
                    sx={{width: 20, marginRight: 1}}>

                </Box>
                <span>{friend.username} is typing</span>
                <Box  id="wave">
                    <span className="dot one"></span>
                    <span className="dot two"></span>
                    <span className="dot three"></span>
                </Box>
            </Box>
            
            
        </Box>
    );
}

export default Messages;
