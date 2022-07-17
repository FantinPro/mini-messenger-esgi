import React, { useContext } from 'react';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box } from '@mui/system';
import { FilterLogsContext } from '../../../../../contexts/filterLogs.context';

export default function FilterDatesLogs() {

    const {
        filterLogs,
        dispatchFilterLogs
    } = useContext(FilterLogsContext);

    return (
        <Box sx={{ display: 'flex' }}>
            <DatePicker
                label="Start Date"
                value={filterLogs.startDate}
                onChange={(newValue) => {
                    dispatchFilterLogs({
                        type: 'START_DATE',
                        payload: newValue.toJSDate()
                    });
                }}
                mask="__/__/____"
                renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
                label="End Date"
                value={filterLogs.endDate}
                onChange={(newValue) => {
                    dispatchFilterLogs({
                        type: 'END_DATE',
                        payload: newValue.toJSDate()
                    });
                }}
                mask="__/__/____"
                renderInput={(params) => <TextField {...params} />}
            />
        </Box>
    );
}
