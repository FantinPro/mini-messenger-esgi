import { StatusCodes } from 'http-status-codes';
import passport from 'passport';
import { ApiError } from '../utils/ApiError';
import { roles } from '../utils/Helpers';

export const verifyCallback = (req, resolve, reject, role) => async (err, user, info) => {
    if (err || info || !user) {
        return reject(new ApiError(StatusCodes.UNAUTHORIZED, 'unauthorized'));
    }

    // do stuff about user role
    // if (user.role !== role) { ... }

    req.user = user;
    resolve();
};

export function authorized(role = roles.ROLE_USER) {
    return async (req, res, next) => new Promise((resolve, reject) => {
        passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, role))(req, res, next);
    })
        .then(() => next())
        .catch((err) => {
            next(err);
        });
}
