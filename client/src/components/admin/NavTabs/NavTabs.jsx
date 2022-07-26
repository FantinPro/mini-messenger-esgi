import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function NavTabs() {
    const [navigationIndex, setNavigationIndex] = useState(0);
    const navigate = useNavigate()

    const handleNav = useCallback((event, newNavigationIndex) => {
        setNavigationIndex(newNavigationIndex);
        switch (newNavigationIndex) {
        case 0:
            navigate('/admin/logs');
            break;
        case 1:
            navigate('/admin/reports');
            break;
        case 2:
            navigate('/admin/analytics');
            break;
        default:

            break;
        }
    }, []);

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={navigationIndex} onChange={handleNav} aria-label="basic tabs example">
                    <Tab label="Logs" {...a11yProps(0)} />
                    <Tab label="Reports" {...a11yProps(1)} />
                    <Tab label="Analytics" {...a11yProps(2)} />
                </Tabs>
            </Box>
        </Box>
    );
}