import PeopleIcon from '@mui/icons-material/People';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Box from '@mui/material/Box';
import React from 'react';

export default function BottomNavigationSidebar({ navigationIndex, setNavigationIndex }) {
    return (
        <Box>
            <BottomNavigation
                showLabels
                value={navigationIndex}
                onChange={(event, newValue) => {
                    setNavigationIndex(newValue);
                }}
            >
                <BottomNavigationAction label="Friends" icon={<PeopleIcon />} />
            </BottomNavigation>
        </Box>
    );
}
