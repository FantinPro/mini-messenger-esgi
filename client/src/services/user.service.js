import { httpMethodsWrapper } from '../helpers/http-methods-wrapper';
import config from '../config/config';

const baseUrl = `${config.apiUrl}/users`;

export const userService = {
    getUserByToken
};

function getUserByToken() {
    if (!localStorage.getItem('jwt')) {
        return Promise.resolve();
    }
    return httpMethodsWrapper.get(`${baseUrl}/token`);
}
