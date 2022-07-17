import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import React from 'react';
import { useContext } from 'react';
import { FilterLogsContext } from '../../../../../contexts/filterLogs.context';

export default function FilterAppLogs () {
    const {
        filterLogs,
        dispatchFilterLogs
    } = useContext(FilterLogsContext);
    return (
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Application</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filterLogs.application}
                label="Application"
                onChange={(event) => {
                    dispatchFilterLogs({
                        type: 'APPLICATION',
                        payload: event.target.value
                    });
                }}
            >
                <MenuItem value={'all'}>All</MenuItem>
                <MenuItem value={'server'}>Server</MenuItem>
                <MenuItem value={'client'}>Client</MenuItem>
            </Select>
        </FormControl>
    );
}