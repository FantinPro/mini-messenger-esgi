import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import * as React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import { SidebarContext } from '../../contexts/sidebar.context';
import { useState } from 'react';

function Home() {

    const [ sidebarOpen, setSidebarOpen ] = useState(false)

    const sidebarWith = React.useMemo(() => 350, []);

    return (
        <SidebarContext.Provider value={{
            sidebarOpen,
            setSidebarOpen
        }} >
            <Box sx={{ display: 'flex', minHeight: 'inherit' }}>
                <Sidebar sidebarWith={sidebarWith} />
                <Box component="main"
                    sx={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1, 
                        width: { sm: `calc(100% - ${sidebarWith}px)` }, 
                        flex: '1 1 auto' 
                    }}>

                    <Toolbar />

                    {/* An <Outlet> renders whatever child route is currently active,
                    so you can think about this <Outlet> as a placeholder for
                    the child routes we defined above. */}
                    <Outlet />

                </Box>
            </Box>
        </SidebarContext.Provider>
    );
}

export default Home;