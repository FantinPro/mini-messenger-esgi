import logger from '../config/logger';

export const create = async (req, res, next) => {
    try {
        const { level, message, meta } = req.body;
        switch (level) {
        case 'error':
            logger.error(message, { metadata: meta });
            break;
        case 'warn':
            logger.warn(message, { metadata: meta });
            break;
        case 'info':
            logger.info(message, { metadata: meta });
            break;
        default:
            throw new Error('Level is not valid');
        }
        res.json({ message, meta });
    } catch (e) {
        next(e);
    }
};
