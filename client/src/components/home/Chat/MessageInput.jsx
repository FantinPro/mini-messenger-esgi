import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../../contexts/user.context';
import { Paper, IconButton, InputBase } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Send from '@mui/icons-material/Send';
import DOMPurify from 'dompurify';

const NewMessage = ({ socket, friend }) => {
    const { user } = useContext(UserContext);
    const [value, setValue] = useState('');

    const sendMessage = () => {
        if (value.trim().length === 0) return;
        const sanitizedMessage = () => ({
            __html: DOMPurify.sanitize(value.replace(/\n/g, '<br>'))
        })
        socket.emit('message', {
            receiver: { 
                ...friend
            },
            sender: {
                ...user
            },
            text: sanitizedMessage().__html
        });
        setValue('');
    };

    const handleUpload = (e) => {
        e.preventDefault();
    }

    useEffect(() => {
        const textarea = document.getElementById('textareaMessage');
        const handleMessage = (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            } else if (e.key === 'Enter' && e.shiftKey) {
                e.preventDefault();
                setValue(value + "\n");
            }
        }
        if (textarea) {
            textarea.addEventListener('keydown', handleMessage);
        }
        return () => {
            textarea.removeEventListener('keydown', handleMessage);
        }
    }, [value])

    useEffect(() => {
        console.log('je tape')
        socket.emit('isTyping', {
            receiver: { 
                ...friend
            },
            sender: {
                ...user
            },
            text: value
        });
    }, [value])

    return (
        <div>
            <Paper
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%' }}
            >
                <IconButton onClick={() => handleUpload()} sx={{ p: '10px' }} aria-label="menu">
                    <AddCircleIcon />
                </IconButton>
                <InputBase
                    id='textareaMessage'
                    autoFocus
                    sx={{ ml: 1, flex: 1 }}
                    value={value}
                    placeholder="Send a message"
                    multiline
                    minRows={1}
                    maxRows={6}
                    inputProps={{ 'aria-label': 'send a message' }}
                    onChange={(e) => {
                        setValue(e.currentTarget.value);
                    }}
                />
                <IconButton onClick={() => { sendMessage() }} sx={{ p: '10px' }} aria-label="search">
                    <Send />
                </IconButton>
            </Paper>
        </div>
    );
};

export default NewMessage;
