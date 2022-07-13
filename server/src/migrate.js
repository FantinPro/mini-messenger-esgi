import { connection } from './model/postgres/index';

connection
    .sync({
        alter: true,
    })
    .then(() => {
        console.log('Database synced');
        connection.close();
    }).finally(() => {
        process.exit(0);
    });
