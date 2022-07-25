import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import * as React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';

function Home() {

    const sidebarWith = React.useMemo(() => 350, []);

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar sidebarWith={sidebarWith} />
            <Box component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${sidebarWith}px)` }, flex: '1 1 auto' }}>

                <Toolbar />

                {/* An <Outlet> renders whatever child route is currently active,
                    so you can think about this <Outlet> as a placeholder for
                    the child routes we defined above. */}
                <Outlet />

            </Box>
        </Box>
    );
}

export default Home;