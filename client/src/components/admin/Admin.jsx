import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import logo from '../../../assets/images/messenger.png';
import NavTabs from './NavTabs/NavTabs';


export default function Admin () {

    return (
        <Box sx={
            {
                minHeight: 'inherit',
                display: 'flex',
                flexDirection: 'column',
            }
        }>
            <AppBar position="fixed" sx={{
                width: { sm: `100%` },
            }}
            >
                {/* Top NavBar */}
                <Toolbar sx={{ justifyContent: 'space-between'}}>
                    <Box sx={{ display: 'flex'}}>
                        <img src={logo} width='40' />
                        <Typography alignSelf='center' ml={2} variant="h6" noWrap component="div">
                            Admin 🔑
                        </Typography>
                    </Box>
                </Toolbar>
                {/* End Top NavBar */}
            </AppBar>
            <Toolbar />
            <Container sx={{ display: 'flex', flex: 1, flexDirection: 'column' }} maxWidth="lg">
                <NavTabs />
                <Outlet />
            </Container>
        </Box>

    );
}