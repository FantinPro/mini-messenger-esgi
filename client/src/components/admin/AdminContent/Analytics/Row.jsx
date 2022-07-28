import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { addMilliseconds, format } from 'date-fns'

export default function Row({ analytic }) {
    const [open, setOpen] = React.useState(false);

    function formattedTime(milliseconds) {
        let helperDate = addMilliseconds(new Date(0), milliseconds);
        return format(helperDate, 'mm:ss');
    }

    return (
        <React.Fragment>
            <TableRow key={analytic._id}>
                <TableCell component="th" scope="row">
                    {analytic.userId}
                </TableCell>
                <TableCell align="left">
                    {(new Date(analytic.updatedAt)).toLocaleString()}
                </TableCell>
                <TableCell align="center">
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell align="left">Duration</TableCell>
                                        <TableCell align="left">Country</TableCell>
                                        <TableCell align="left">Navigator</TableCell>
                                        <TableCell align="left">Os</TableCell>
                                        <TableCell align="left">Device</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {analytic.sessions.map(session => session.duration && (
                                        <TableRow key={session.sessionId}>
                                            <TableCell>{(new Date(session.timestamp)).toLocaleString()}</TableCell>
                                            <TableCell align="left">{formattedTime(session.duration)}</TableCell>
                                            <TableCell align="left">{session.country}</TableCell>
                                            <TableCell align="left">{session.browser}</TableCell>
                                            <TableCell align="left">{session.os}</TableCell>
                                            <TableCell align="left">{session.device}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}