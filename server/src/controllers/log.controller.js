import logger from '../config/logger';
import { Log } from '../model/mongodb/Log';

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

export const search = async (req, res, next) => {
    try {
        // search by date range and pagination
        const {
            startDate, endDate, page, limit, textSearch, severity, application,
        } = req.body;
        const match = {
            // search contain message
            // tips de dev senior no raj ptdr (c juste pour pas que le clé soit enumerable si e.g texSearch === undefined)
            ...(textSearch && {
                $text: {
                    $search: textSearch,
                },
            }),
            ...(severity && { level: severity }),
            ...(application && { 'meta.service': application }),
            ...((startDate && endDate) && {
                timestamp: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                },
            }),
        };

        const logs = await Log.find(match)
            .skip((page) * limit)
            .limit(limit)
            .sort({ timestamp: -1 });
        const total = await Log.countDocuments(match);

        res.json({ logs, total });
    } catch (e) {
        next(e);
    }
};
