import { httpMethodsWrapper } from '../helpers/http-methods-wrapper';
import config from '../config/config';

const baseUrl = `${config.apiUrl}/api/v1/users`;

export const userService = {
    getUserByToken,
    resetPassword,
    updateProfile,
    updatePassword
};

function getUserByToken() {
    if (!localStorage.getItem('jwt')) {
        return Promise.resolve();
    }
    return httpMethodsWrapper.get(`${baseUrl}/token`);
}

function resetPassword(token, password) {
    return httpMethodsWrapper.post(`${baseUrl}/reset-password`, { token, password });
}

function updateProfile({  username, interests }) {
    return httpMethodsWrapper.put(`${baseUrl}/profile`, { username, interests });
}

function updatePassword(oldPassword, newPassword) {
    return httpMethodsWrapper.put(`${baseUrl}/password`, { oldPassword, newPassword });
}
