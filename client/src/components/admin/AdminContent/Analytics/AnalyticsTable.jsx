import React, { useContext, useState } from 'react';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { Box, Grid } from '@mui/material';
import { blue } from '@mui/material/colors';
import { UserContext } from '../../../../contexts/user.context';

export default function Analytics() {

    const { socket } = useContext(UserContext);
    const [countUserConnected, setCountUserConnected] = useState(0);

    socket && socket.on('users.count', function (number) {
        setCountUserConnected(number);
    });


    return (
        <Box mt={6}>
            <Grid>
                <GridItem
                    stat={countUserConnected}
                    text="Nombres d'utilisateurs connectés"
                />
            </Grid>
        </Box>
    );

}

const GridItem = ({ stat, text }) => (
    <Grid item display='flex' alignItems='center' justifyContent='space-between' xs={6} p={3} borderRadius={5} boxShadow={3}>
        <Box bgcolor={blue[100]} p={2} borderRadius={4}>
            <PeopleAltIcon />
        </Box>
        <Box flex flexDirection='column' width='100%' ml={4}>
            <Box component='h1' my={0}>{stat}</Box>
            <Box component='p' my={0}>{text}</Box>
        </Box>
    </Grid>
)