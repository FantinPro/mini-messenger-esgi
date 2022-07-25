export const roles = Object.freeze({
    ROLE_ADMIN: 'ROLE_ADMIN',
    ROLE_USER: 'ROLE_USER',
});

export const friendsStatus = Object.freeze({
    PENDING: 'PENDING',
    ACTIVE: 'ACTIVE',
    BLOCKED: 'BLOCKED',
    EXISTS: 'EXISTS',
    UNKNOWN_USER: 'UNKNOWN_USER',
    ADDED: 'ADDED',
    ERROR_SAME_USER: 'ERROR_SAME_USER',
});

export const tokenTypes = Object.freeze({
    CONFIRM_EMAIL: 'CONFIRM_EMAIL',
    RESET_PASSWORD: 'RESET_PASSWORD',
});
