import { Box } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import useDebounce from '../../../hooks/useDebounce';
import './messages.css'
import { UserContext } from '../../../contexts/user.context';
import Message from './Message';

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
            if (message.senderId === params.friendId || message.senderId === user.id) {
                setIsTyping(false)
                setMessages((prevMessages) => {
                    const newMessages = [ ...prevMessages ];
                    newMessages.push(message);
                    return newMessages;
                });
            }
        };

        const isTypingListener = (message) => {
            console.log('🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩')
            console.log(message)
            console.log('🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦')
            if (message.sender.id !== user.id) {
                if ( message.text !== '') {
                    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
                    setIsTyping(message.id)
                } else {
                    setIsTyping(false)
                }
            }
        }

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
        socket.on('isTyping', isTypingListener);
        socket.emit('getMessages');

        return () => {
            socket.off('message', messageListener);
            socket.off('delete', onMessageUpdate);
            socket.off('update', onMessageUpdate);
            socket.off('isTyping', isTypingListener);
            setIsTyping(false)
        }
    }, [socket, params, messages]);

    useEffect(() => {
        if (isTyping) {
            setIsTyping(false)
        }
    }, [isTypingDebounced])

    return (
        <Box sx={{ flex: '1 0 0', overflowY: 'auto' }}>
            {[...Object.values(messages)]
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                .map((message) => (
                    <Message key={message.id} message={message} socket={socket}/>
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
