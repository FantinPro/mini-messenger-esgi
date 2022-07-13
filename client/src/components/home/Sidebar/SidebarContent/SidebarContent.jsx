import { Box, Divider, List, Toolbar } from '@mui/material';
import React, { useCallback } from 'react';
import BottomNavigationSidebar from '../BottomNavigationSideBar/BottomNavigationSideBar';
import FriendItemsConversation from './FriendItemsConversation';

export default function SidebarContent ({ navigationIndex }) {

    const navSwitch = useCallback((navigationIndex) => {
        switch (navigationIndex) {
        case 0:
            return <FriendItemsConversation />;
        case 1:
            return <div>Notifications</div>;
        default:
            return <></>;
        }
    }, [])

    return (
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
            <Divider />
            {navSwitch(navigationIndex)}
        </Box>
    )
}