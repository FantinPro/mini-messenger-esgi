/* eslint-disable no-undef */
import mongoose from 'mongoose';
import config from '../../../config/config';

mongoose.set('strictQuery', false);

// connect database
mongoose.connect(config.mongodb.uri || 'mongodb://localhost:27017/notes-project');

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', () => {
    console.log('Mongoose default connection open');
});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
    console.log(`Mongoose default connection error: ${err}`);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

export { mongoose };

// use the syntax below if you want to host your express api on serverless functions (like firebase functions)

// import mongoose from 'mongoose';
// import config from '../config/config';

// let conn = null;

// const uri = config.mongodb.uri || 'mongodb://localhost:27017/notes-project';

// exports.connect = async function () {
//     if (conn == null) {
//         console.log('Creating new connection');
//         conn = mongoose.connect(uri, {
//             serverSelectionTimeoutMS: 5000,
//         }).then(() => mongoose);

//         // `await`ing connection after assigning to the `conn` variable
//         // to avoid multiple function calls creating new connections
//         await conn;
//     }

//     return conn;
// };
