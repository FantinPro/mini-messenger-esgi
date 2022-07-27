import { httpMethodsWrapper } from '../helpers/http-methods-wrapper';
import config from '../config/config';

const baseUrl = `${config.apiUrl}/analytics`;

export const analyticService = {
    stats,
};

function stats() {
    return httpMethodsWrapper.get(`${baseUrl}/stats`).then((res) => res);
}