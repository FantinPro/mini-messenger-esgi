import React, { useEffect, useState, useContext } from 'react';
import { Paper, Box, Typography } from '@mui/material';
import DOMPurify from 'dompurify';
import { UserContext } from '../../../contexts/user.context';
import { useParams } from 'react-router-dom';

function Messages({ socket, oldMessages }) {
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  let params = useParams();

  useEffect(() => {
    setMessages(oldMessages);
  }, [params, oldMessages]);

  useEffect(() => {
    const messageListener = (message) => {
      console.log(message, user.id)
      if (message.sender.id === params.friendId || message.sender.id === user.id) {
        setMessages((prevMessages) => {
          const newMessages = { ...prevMessages };
          newMessages[message.id] = message;
          return newMessages;
        });
      }
    };

    const deleteMessageListener = (messageID) => {
      setMessages((prevMessages) => {
        const newMessages = { ...prevMessages };
        delete newMessages[messageID];
        return newMessages;
      });
    };

    socket.on('message', messageListener);
    socket.on('deleteMessage', deleteMessageListener);
    socket.emit('getMessages');

    return () => {
      socket.off('message', messageListener);
      socket.off('deleteMessage', deleteMessageListener);
    };
  }, [socket, params]);

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
    <Box >
      {[...Object.values(messages)]
        .sort((a, b) => a.createdAt - b.createdAt)
        .map((message) => (
          <Box sx={{ display: 'box', marginY: '15px' }} key={message.id}>
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
    </Box>
  );
}

export default Messages;
