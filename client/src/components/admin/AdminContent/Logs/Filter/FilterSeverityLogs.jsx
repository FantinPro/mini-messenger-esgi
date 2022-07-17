import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import React from 'react';
import { useContext } from 'react';
import { FilterLogsContext } from '../../../../../contexts/filterLogs.context';

export default function FilterSeverityLogs () {
    const {
        filterLogs,
        dispatchFilterLogs
    } = useContext(FilterLogsContext);
    return (
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Severity</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filterLogs.severity}
                label="Severity"
                onChange={(event) => {
                    dispatchFilterLogs({
                        type: 'SEVERITY',
                        payload: event.target.value
                    });
                }}
            >
                <MenuItem value={'all'}>All</MenuItem>
                <MenuItem value={'error'}>Error</MenuItem>
                <MenuItem value={'warning'}>Warning</MenuItem>
                <MenuItem value={'info'}>Info</MenuItem>
                <MenuItem value={'debug'}>Debug</MenuItem>
            </Select>
        </FormControl>
    );
}