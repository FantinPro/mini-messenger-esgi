import * as React from 'react';
import { useReducer } from 'react';
import { FilterLogsContext } from '../../../../contexts/filterLogs.context';
import FilterLogs from './Filter/FilterLogs';
import LogsTable from './LogsTable/LogsTable';

const initialFilterLogs = {
    // startDate less 7 days
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    endDate: new Date(),
    textSearch: '',
    severity: 'all',
    application: 'all',
    page: 0,
    limit: 30,
}

const reducer = (previousState, action) => {
    switch (action.type) {
    case "START_DATE":
        return {
            ...previousState,
            startDate: action.payload,
        }
    case "END_DATE":
        return {
            ...previousState,
            endDate: action.payload,
        }
    case "SEARCH_TEXT":
        return {
            ...previousState,
            textSearch: action.payload,
        }
    case "SEVERITY":
        return {
            ...previousState,
            severity: action.payload,
        }
    case "APPLICATION":
        return {
            ...previousState,
            application: action.payload,
        }
    case "PAGE":
        return {
            ...previousState,
            page: action.payload,
        }
    case "LIMIT":
        return {
            ...previousState,
            limit: action.payload,
        }
    default:
        return previousState;
    }
};

export default function Logs() {
    const [filterLogs, dispatchFilterLogs] = useReducer(reducer, initialFilterLogs);

    return (
        <FilterLogsContext.Provider value={{
            filterLogs,
            dispatchFilterLogs
        }} >
            
            <FilterLogs />
            <LogsTable />
            
        </ FilterLogsContext.Provider>
    );
}
