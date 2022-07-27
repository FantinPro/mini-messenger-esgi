import { httpMethodsWrapper } from '../helpers/http-methods-wrapper';
import config from '../config/config';

const baseUrl = `${config.apiUrl}/api/v1/logs`;

export const logService = {
    sendLogError,
    search
};

function sendLogError({
    level,
    message,
    meta
}) {
    return httpMethodsWrapper.post(`${baseUrl}`, {
        level,
        message,
        meta
    });
}

/**
 * 
 * @param {Object} filterLogs - filterLogs.startDate, filterLogs.endDate, filterLogs.textSearch, filterLogs.severity, filterLogs.application
 * @returns 
 */
function search(filter) {
    return httpMethodsWrapper.post(`${baseUrl}/search`, filter);
}
