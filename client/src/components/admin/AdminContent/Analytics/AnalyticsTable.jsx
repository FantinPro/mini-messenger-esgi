import React, { useContext, useState, useEffect } from 'react';
import * as Icons from '@mui/icons-material'
import { Box } from '@mui/material';
import { blue } from '@mui/material/colors';
import { TableContainer, TableHead, Table, TableRow, TableCell, TableBody, TablePagination, Paper } from '@mui/material';
import { UserContext } from '../../../../contexts/user.context';
import { analyticService } from '../../../../services/analytic.service';
import Row from './Row';

export default function Analytics() {

    const { nbUsersConnected } = useContext(UserContext);
    const [stats, setStats] = useState({})
    const [analytics, setAnalytics] = useState([])

    useEffect(() => {
        const getStats = async () => {
            await analyticService.stats().then(res => {
                setStats(res);
            })

            await analyticService.getSessions().then(res => {
                setAnalytics(res);            
            })
        }

        getStats();
    }, [])

    return (
        <Box mt={4}>
            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={4}>
                <GridItem
                    stat={nbUsersConnected}
                    text="Nombres d'utilisateurs connectés"
                    iconName="PeopleAlt"
                />
                {stats.length > 0 && stats.map(({ count, text, iconName }, index) => (
                    <GridItem
                        key={index}
                        stat={count}
                        text={text}
                        iconName={iconName}
                    />
                ))}
            </Box>
            <TableContainer sx={{ flex: '1 0 0', marginTop: 4 }} component={Paper}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell>User</TableCell>
                            <TableCell align="left">Last Connection</TableCell>
                            <TableCell align="center">Connections</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {analytics.length > 0 && analytics.map(analytic => (
                            <Row key={analytic._id} analytic={analytic} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

}

const GridItem = ({ stat, text, iconName }) => {
    
    const Icon = Icons[iconName];

    return (
        <Box gridColumn="span 6" display='flex' alignItems='center' justifyContent='space-between' p={3} borderRadius={5} boxShadow={3}>
            <Box bgcolor={blue[100]} p={2.5} borderRadius={4} lineHeight={0}>
                <Icon />
            </Box>
            <Box flex flexDirection='column' width='100%' ml={4}>
                <Box component='h1' my={0}>{stat}</Box>
                <Box component='p' my={0}>{text}</Box>
            </Box>
        </Box>
    )
}