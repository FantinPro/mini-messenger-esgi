import { httpMethodsWrapper } from '../helpers/http-methods-wrapper';
import config from '../config/config';

const baseUrl = `${config.apiUrl}/api/v1/analytics`;

export const analyticService = {
    stats,
    addNewSession,
    updateSession,
    getSessions
};

function stats() {
    return httpMethodsWrapper.get(`${baseUrl}/stats`).then(res => res);
}

function addNewSession({ userId, config }) {
    return httpMethodsWrapper.post(`${baseUrl}/addNewSession`, { userId, config }).then(res => res);
}

function updateSession({ userId, sessionId, duration }) {
    return httpMethodsWrapper.post(`${baseUrl}/updateSession`, { userId, sessionId, duration }).then(res => res);
}

function getSessions() {
    return httpMethodsWrapper.post(`${baseUrl}/getSessions`).then(res => res);
}