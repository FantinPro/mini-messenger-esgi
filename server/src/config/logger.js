import winston from 'winston';
// winston issue : https://github.com/winstonjs/winston-mongodb/issues/171#issuecomment-890848564
// eslint-disable-next-line no-unused-vars
import { MongoDB } from 'winston-mongodb';
import { mongoose } from '../core/db/mongodb/db.mongodb';

const { transports } = winston;

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new transports.MongoDB({
            db: mongoose.connection,
            collection: 'logs',
        }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
    );
}

export default logger;
