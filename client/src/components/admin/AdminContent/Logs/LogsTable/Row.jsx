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
import { useMemo } from 'react';

export default function Row({ log }) {
    const [open, setOpen] = React.useState(false);

    const colorLevel = useMemo( () => {
        switch (log.level) {
        case 'info':
            return '#00bcd4';
        case 'warn':
            return '#ff9800';
        case 'error':
            return '#f44336';
        default:
            return '#4caf50';
        }
    })

    return (
        <React.Fragment>
            <TableRow key={log._id}>
                <TableCell component="th" scope="row">
                    {(new Date(log.timestamp)).toLocaleString()}
                </TableCell>
                <TableCell sx={{ color: colorLevel }} align="left">{log.level}</TableCell>
                <TableCell align="left">{log.message}</TableCell>
                <TableCell>
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
                            <Typography variant="h6" gutterBottom component="div">
                                Metadata
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        {log.meta && Object.keys(log.meta).map(key => (
                                            <TableCell key={key}>{key}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        {log.meta && Object.keys(log.meta).map(key => (
                                            <TableCell  key={key} component="th" scope="row">{log.meta[key]}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}