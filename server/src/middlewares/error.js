import { ValidationError } from 'sequelize';
import config from '../config/config';
import { logger } from '../config/logger';

const _formatError = (validationError) => validationError.errors.reduce((acc, error) => {
    acc[error.path] = error.message;
    return acc;
}, {});

export const errorHandler = (err, req, res, next) => {
    if (err instanceof ValidationError) {
        return res.status(422).json(_formatError(err));
    }

    // else ApiError
    const { statusCode, message } = err;

    const response = {
        code: statusCode || 500,
        message,
        // stack: err.stack,
    };

    if (config.env === 'development') {
        logger.error(err);
    }

    res.status(response.code).json(response);
};
