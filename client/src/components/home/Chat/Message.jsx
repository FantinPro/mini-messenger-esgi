import { Delete, Save } from '@mui/icons-material';
import { Box, IconButton, Paper, TextField, Typography } from '@mui/material';
import DOMPurify from 'dompurify';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../../../contexts/user.context';

export default function Message({ message, socket }) {
    const { user } = useContext(UserContext);
    const componentRef = useRef(null);

    const sanitizedData = (data) => ({
        __html: DOMPurify.sanitize(data)
    })

    function handleMessageClick(e, message) {

        if (message.sender.id === user.id) {
            setEditInput(message.text);
            setIsClicked(true);
        }
    }
  
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

    const [isClicked, setIsClicked] = useState(false);
    const [editInput, setEditInput] = useState(null);
  
    function handleBlur() {
        setIsClicked(false);
    }
  

    useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */ 
        function handleClickOutside(event) {
            if (componentRef.current && !componentRef.current.contains(event.target)) {
                handleBlur();
            }
        }
        
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [componentRef]);

    function handleEdit() {
        console.log('here')
        const editedMessage = { ...message };
        editedMessage.text = editInput;
        socket.emit('update', editedMessage);
    }

    function handleDelete() {
        socket.emit('delete', message)
    }

    if (message.deleted === true) {
        return (<Box sx={{ display: 'box', marginY: '15px', marginX: '15px' }}>
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
                onClick={(e) => handleMessageClick(e, message)}
                elevation={1}
                sx={{ width: "fit-content", padding: '8px', marginTop: '3px' }}
            >
                Deleted
            </Paper>       
        </Box>)
         
    }
    
    return (
        <Box ref={componentRef} sx={{ display: 'box', marginY: '15px', marginX: '15px' }}>
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
            {message.edited === true && (
                <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="subtitle2"
                    color="text.secondary"
                > - Edited
                </Typography>
            )}
            
            <Paper  
                onClick={(e) => handleMessageClick(e, message)}
                elevation={1}
                sx={{ width: "fit-content", padding: '8px', marginTop: '3px' }}
            >
                {isClicked ? <Box sx={{display: "flex", alignItems: 'end'}}><TextField value={editInput} onChange={(e) => setEditInput(e.target.value)} id="outlined-basic" label="Edit" variant="standard" /><IconButton onClick={handleEdit}><Save color='success'/></IconButton><IconButton onClick={handleDelete}><Delete color='error'/></IconButton></Box> : <div dangerouslySetInnerHTML={sanitizedData(message.text)}/>}             
            </Paper>                 
        </Box>
    )
}