import { httpMethodsWrapper } from '../helpers/http-methods-wrapper';
import config from '../config/config';

const baseUrl = `${config.apiUrl}/auth`;

export const authService = {
    login,
    // setUser,
    register,
    getGoogleCallback
};

function login(email, password) {
    return httpMethodsWrapper.post(`${baseUrl}/login`, { email, password }).then((res) => {
        localStorage.setItem('jwt', res.token);
        return res;
    });
}

function register ({ email, password, interests }) {
    return httpMethodsWrapper.post(`${baseUrl}/register`, { email, password, interests }).then((res) => {
        localStorage.setItem('jwt', res.token);
        return res
    })
}

function getGoogleCallback() {
    return `${baseUrl}/google`;
}