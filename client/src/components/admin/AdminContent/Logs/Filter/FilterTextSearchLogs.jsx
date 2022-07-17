import { TextField } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { FilterLogsContext } from '../../../../../contexts/filterLogs.context';
import useDebounce from '../../../../../hooks/useDebounce';


export default function FilterTextSearchLogs() {

    const [search, setSearch] = useState('');
    const { dispatchFilterLogs } = useContext(FilterLogsContext);

    const searchDebounce = useDebounce(search, 500);

    useEffect(() => {
        dispatchFilterLogs({
            type: 'SEARCH_TEXT',
            payload: searchDebounce
        })
    }, [searchDebounce]);
    
    return (
        <TextField label="Search log message" variant="outlined" sx={{ width: '50%'}} onChange={
            (event) => {
                setSearch(event.target.value);
            }
        } value={search} />
    );
}