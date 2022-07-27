import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import morganBody from 'morgan-body';
import { Server } from 'socket.io';
import config from './config/config';
import logger from './config/logger';
import * as passportConfig from './config/passport';
import chat from './core/socket.chat';
import { errorHandler } from './middlewares/error';
import routes from './routes/index';

const server = express();

server.use(
    cors({
        origin: '*', // only allow front call
    }),
);

server.use(bodyParser.json());

morganBody(server, {
    logResponseBody: true,
});

server.use(express.json());

passportConfig.initialize(server);

server.use(compression({
    level: 9,
}));

// If you want to make a render from the server, you can uncomments this line
// server.use(express.static(process.env.NODE_ENV === 'development' ? '../build/client' : './build/client'));

server.use('/api/v1', routes);

server.use(errorHandler);

const app = createServer(server);
const io = new Server(app, {
    cors: {
        origin: config.frontBaseUrl,
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

app.listen(config.expressPort, () => logger.info(`server started on port ${config.expressPort} with env ${config.env}`, {
    metadata: {
        service: 'server',
    },
}));

chat(io);
