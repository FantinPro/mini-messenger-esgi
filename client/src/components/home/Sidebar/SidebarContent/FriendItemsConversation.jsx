import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography, Button, Box, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Alert } from '@mui/material';
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { friendService } from '../../../../services/friend.service';
import { UserContext } from '../../../../contexts/user.context';
import { useForm, Controller } from 'react-hook-form';

export default function FriendItemsConversation() {
    const { user } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(true);
    const [friends, setFriends] = useState([]);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState({});
    const { handleSubmit, reset, control } = useForm();

    const onSubmit = async (data) => {
        if (data.username === '') {
            setError({ message: "Please enter a username or email !", severity: 'error' });
        } else {
            const request = await friendService.addFriend(data.username);
            reset();
            switch (request.status) {
                case 'UNKNOWN_USER':
                    setError({ message: "Incorrect username or email !", severity: 'error' });
                    break;
                case 'EXISTS':
                    setError({ message: "You are already friends with this user !", severity: 'warning' });
                    break;
                case 'ADDED':
                    setError({ message: "Friend request sent successfully !", severity: 'success' });
                    break;
                case 'PENDING':
                    setError({ message: "You already sent a request !", severity: 'success' });
                    break;
                case 'ERROR_SAME_USER':
                    setError({ message: "You can't add yourself !", severity: 'error' });
                    break;
            }
        }
    };

    const openAddFriendModal = () => {
        setError({});
        setOpen(true);
    }

    const closeAddFriendModal = () => {
        setOpen(false);
    }

    useEffect(() => {
        friendService.getFriendsList(user.id).then(res => {
            setFriends(res);
        }).catch(err => {
            setFriends([]);
        }).finally(() => {
            setIsLoading(false);
        })
    }, []);

    return (
        <>
            <List>
                <Box textAlign='center'>
                    <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="h6"
                        color="text.primary"
                    >
                        Friends
                    </Typography>
                    <Button variant='contained' sx={{ width: '90%', marginY: '15px' }} onClick={openAddFriendModal}>
                        Add a friend
                    </Button>
                    <hr></hr>
                </Box>
                {friends.map((friend, index) => (
                    <FriendItem key={index} friendId={friend.id} />
                ))}
            </List>
            <Dialog open={open} onClose={closeAddFriendModal}>
                <DialogTitle>Add a friend</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You can add a friend using their username or email. Watch out for CaPiTaLs!
                    </DialogContentText>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            name={"username"}
                            control={control}
                            defaultValue=""
                            rules={{ required: true }}
                            render={({ field: { onChange, value } }) => (
                                <div>
                                    <TextField
                                        onChange={(e) => onChange(e)}
                                        value={value}
                                        autoFocus
                                        margin="dense"
                                        id="username"
                                        label="Username or Email Address"
                                        type="text"
                                        fullWidth
                                        variant="standard"
                                    />
                                    {error && error.severity && error.message && <Alert severity={error.severity}>{error.message}</Alert>}
                                </div>
                            )}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeAddFriendModal}>Cancel</Button>
                    <Button onClick={handleSubmit(onSubmit)}>Send friend request</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

const FriendItem = ({ name, avatar, lastMessage, friendId }) => {
    const navigate = useNavigate()
    return (
        <ListItem button onClick={() => navigate(`friends/${friendId}`)} alignItems="flex-start">
            <ListItemAvatar>
                <Avatar alt="Remy Sharp" src={avatar || 'https://avatars.dicebear.com/api/male/2.svg'} />
            </ListItemAvatar>
            <ListItemText
                primary={name}
                secondary={
                    <React.Fragment>
                        <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                        >
                            {lastMessage}
                        </Typography>
                    </React.Fragment>
                }
            />
        </ListItem>
    )
}
