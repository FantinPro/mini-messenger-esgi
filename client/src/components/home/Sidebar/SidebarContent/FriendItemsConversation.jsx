import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function FriendItemsConversation () {
    return (
        <List>
            {[1,2,3,4,5,6,7,8,9,10,11,12,14,15,16,17].map((friendId, index) => (
                <FriendItem key={index} friendId={friendId} />
            ))}
        </List>
    )
}

const FriendItem = ({ name, avatar, lastMessage, friendId }) => {
    const navigate = useNavigate()
    return (
        <ListItem button onClick={() => navigate(`friends/${friendId || 1}`)} alignItems="flex-start">
            <ListItemAvatar>
                <Avatar alt="Remy Sharp" src={avatar || 'https://avatars.dicebear.com/api/male/2.svg'} />
            </ListItemAvatar>
            <ListItemText
                primary={ lastMessage || 'Last Message'}
                secondary={
                    <React.Fragment>
                        <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                        >
                            { name || 'Fantin Raimbault'}
                        </Typography>
                    </React.Fragment>
                }
            />
        </ListItem>
    )
}