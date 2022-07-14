import { ValidationError } from 'sequelize';
import logger from '../config/logger';

const _formatError = (validationError) => validationError.errors.reduce((acc, error) => {
    acc[error.path] = error.message;
    return acc;
}, {});

export const errorHandler = (err, req, res, next) => {
    if (err instanceof ValidationError) {
        logger.warn(`Validation error: ${JSON.stringify(_formatError(err))}`);
        return res.status(422).json(_formatError(err));
    }

    // else ApiError
    const { statusCode, message } = err;

    const response = {
        code: statusCode || 500,
        message,
        // stack: err.stack,
    };

    if (response.code === 500) {
        logger.error(`Internal server error: ${JSON.stringify(response)}`);
    } else {
        logger.warn(`${response.code} error: ${JSON.stringify(response)}`);
    }

    res.status(response.code).json(response);
};
