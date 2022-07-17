import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useContext } from 'react';
import { FilterLogsContext } from '../../../../../contexts/filterLogs.context';
import { useEffect } from 'react';
import { logService } from '../../../../../services/log.service';
import { removeNullOrUndefinedField } from '../../../../../helpers/utils';
import TablePagination from '@mui/material/TablePagination';
import { useState } from 'react';
import Row from './Row';

export default function LogsTable () {

    const { filterLogs, dispatchFilterLogs } =  useContext(FilterLogsContext)
    const [total, setTotal] = useState(0);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        logService.search(
            removeNullOrUndefinedField(filterLogs, ['all', ''])
        ).then(res => {
            setLogs(res.logs);
            setTotal(res.total)
        })
    }, [filterLogs])

    return (
        <>
            <TableContainer sx={{ flex: '1 0 0'}} component={Paper}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell align="left">Level</TableCell>
                            <TableCell align="left">Message</TableCell>
                            <TableCell align="left">Metadata</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {logs.map(log => (
                            <Row key={log._id} log={log} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 30, 60]}
                component="div"
                count={total}
                rowsPerPage={filterLogs.limit}
                page={filterLogs.page}
                onPageChange={(event, newPage) => {
                    dispatchFilterLogs({
                        type: 'PAGE',
                        payload: newPage
                    })
                }}
                onRowsPerPageChange={(event) => {
                    dispatchFilterLogs({
                        type: 'LIMIT',
                        payload: +event.target.value
                    })
                }}
            />
        </>
    )
}