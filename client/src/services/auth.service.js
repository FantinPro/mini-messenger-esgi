import { httpMethodsWrapper } from '../helpers/http-methods-wrapper';
import config from '../config/config';

const baseUrl = `${config.apiUrl}/api/v1/auth`;

export const authService = {
    login,
    // setUser,
    register,
    getGoogleCallback,
    sendResetPassword,
};

function login(email, password) {
    return httpMethodsWrapper.post(`${baseUrl}/login`, { email, password }).then((res) => {
        localStorage.setItem('jwt', res.token);
        return res;
    });
}

function register ({ email, username, password, interests }) {
    return httpMethodsWrapper.post(`${baseUrl}/register`, { email, username, password, interests }).then((res) => {
        localStorage.setItem('jwt', res.token);
        return res
    })
}

function getGoogleCallback() {
    return `${baseUrl}/google`;
}

function sendResetPassword(email) {
    return httpMethodsWrapper.post(`${baseUrl}/reset-password`, { email });
}

function resetPassword(token, password) {
    return httpMethodsWrapper.post(`${baseUrl}/reset-password`, { token, password });
}