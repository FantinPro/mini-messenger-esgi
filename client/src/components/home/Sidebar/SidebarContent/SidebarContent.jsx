import { Box, Divider } from '@mui/material';
import React, { useCallback } from 'react';
import FriendItemsConversation from './FriendItemsConversation';

export default function SidebarContent ({ navigationIndex }) {

    const navSwitch = useCallback((navigationIndex) => {
        switch (navigationIndex) {
        case 0:
            return <FriendItemsConversation />;
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