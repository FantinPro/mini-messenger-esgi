export const httpMethodsWrapper = {
    get,
    post,
    put,
    delete: _delete
};

function get(url, params) {
    const urlWithParams = url + '?' + new URLSearchParams(params);
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(urlWithParams, requestOptions).then(handleResponse);
}

function post(url, body) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

function put(url, body) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(url) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };
    return fetch(url, requestOptions).then(handleResponse);
}

// helper functions

function authHeader() {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
        return { Authorization: 'Bearer ' + jwt };
    }
    return {};
}

function handleResponse(response) {
    return response.text().then((text) => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            return Promise.reject(JSON.stringify(data));
        }
        return data;
    });
}
