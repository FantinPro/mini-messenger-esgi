import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useContext, useState } from 'react';
import SidebarContent from './SidebarContent/SidebarContent';
import BottomNavigationSidebar from './BottomNavigationSideBar/BottomNavigationSideBar';
import logo from '../../../../assets/images/messenger.png';
import { UserContext } from '../../../contexts/user.context';

export default function Sidebar({ sidebarWith }) {

    const { user } = useContext(UserContext);

    const [mobileOpen, setMobileOpen] = useState(false);
    const [navigationIndex, setNavigationIndex] = useState(0);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <>
            <AppBar position="fixed" sx={{
                width: { sm: `calc(100% - ${sidebarWith}px)` },
                ml: { sm: `${sidebarWith}px` },
            }}
            >
                {/* Top NavBar */}
                <Toolbar sx={{ justifyContent: 'space-between'}}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ display: 'flex'}}>
                        <img src={logo} width='40' />
                        <Typography alignSelf='center' ml={2} variant="h6" noWrap component="div">
                        Messenger
                        </Typography>
                    </Box>
                    <div>
                        { user.email }
                    </div>
                </Toolbar>
                {/* End Top NavBar */}

            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: sidebarWith }, flexShrink: { sm: 0 } }}
            >

                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: sidebarWith },
                    }}
                    open
                >
                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <SidebarContent navigationIndex={navigationIndex} />
                        <BottomNavigationSidebar navigationIndex={navigationIndex} setNavigationIndex={setNavigationIndex} />
                    </Box>
                </Drawer>

                {/* Below is for mobile (responsive) */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: sidebarWith },
                    }}
                >
                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <SidebarContent navigationIndex={navigationIndex} />
                        <BottomNavigationSidebar navigationIndex={navigationIndex} setNavigationIndex={setNavigationIndex} />
                    </Box>
                </Drawer>
                {/* end for mobile  (responsive) */}

            </Box>
        </>
    )
}