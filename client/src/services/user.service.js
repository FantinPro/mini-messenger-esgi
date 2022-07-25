import { httpMethodsWrapper } from '../helpers/http-methods-wrapper';
import config from '../config/config';

const baseUrl = `${config.apiUrl}/users`;

export const userService = {
    getUserByToken,
    updatePassword
};

function getUserByToken() {
    if (!localStorage.getItem('jwt')) {
        return Promise.resolve();
    }
    return httpMethodsWrapper.get(`${baseUrl}/token`);
}

function updatePassword(token, password) {
    return httpMethodsWrapper.post(`${baseUrl}/reset-password`, { token, password });
}
