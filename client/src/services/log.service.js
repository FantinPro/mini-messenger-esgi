import { httpMethodsWrapper } from '../helpers/http-methods-wrapper';
import config from '../config/config';

const baseUrl = `${config.apiUrl}/logs`;

export const logService = {
    sendLogError,
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
