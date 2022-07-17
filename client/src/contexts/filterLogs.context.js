import { createContext } from 'react';

export const FilterLogsContext = createContext({
    filterLogs: {
        startDate: new Date(),
        endDate: new Date(),
        textSearch: null,
        severity: null,
        application: null,
        page: 0,
        limit: 30,
    },
    dispatchFilterLogs: () => {},
});
