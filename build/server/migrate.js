import Sequelize, { DataTypes, Model, Op } from 'sequelize';
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import bcryptjs from 'bcryptjs';

const connection = new Sequelize('postgres://ogqfmqcntrpwfs:e91f2ceace2539fdeaa3028d1bf5c5aa0e22259ff06725c8c40edf729fe10834@ec2-52-49-120-150.eu-west-1.compute.amazonaws.com:5432/ddo1akddpglbc0', {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});

connection.authenticate().then(() => {
    console.log('Postgres (with sequelize) default connection open.');
}).catch((err) => {
    console.error(`Unable to connect to the database >> ${process.env.POSTGRES_DATABASE_URL}:`, err);
});

var config = {
    jwtSecret: process.env.JWT_SECRET,
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackUrl: process.env.GOOGLE_CALLBACK_URL,
    },
    frontBaseUrl: process.env.FRONT_BASE_URL || 'http://localhost:8001',
    backBaseUrl: process.env.BACK_BASE_URL || 'http://localhost:9000',
    mongodb: {
        dbname: process.env.MONGODB_DBNAME,
        host: process.env.MONGODB_HOST,
        port: process.env.MONGODB_PORT,
        login: process.env.MONGODB_LOGIN,
        password: process.env.MONGODB_PASSWORD,
        uri: process.env.MONGODB_URI,
    },
    expressPort: process.env.PORT || 9000,
    env: process.env.NODE_ENV || 'development',
    mailerKey: process.env.MAILER_KEY,
};

/* eslint-disable no-undef */

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

class Message extends Model {}

Message.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        edited: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize: connection,
        modelName: 'message',
    },
);

class ApiError extends Error {
    constructor(statusCode, message, isOperational = true, stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        if (stack) {
             this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

const roles = Object.freeze({
    ROLE_ADMIN: 'ROLE_ADMIN',
    ROLE_USER: 'ROLE_USER',
});

const friendsStatus = Object.freeze({
    PENDING: 'PENDING',
    ACTIVE: 'ACTIVE',
    BLOCKED: 'BLOCKED',
    EXISTS: 'EXISTS',
    UNKNOWN_USER: 'UNKNOWN_USER',
    ADDED: 'ADDED',
    ERROR_SAME_USER: 'ERROR_SAME_USER',
});

const tokenTypes = Object.freeze({
    CONFIRM_EMAIL: 'CONFIRM_EMAIL',
    RESET_PASSWORD: 'RESET_PASSWORD',
});

class Friend extends Model {}

Friend.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        status: {
            type: DataTypes.STRING,
            validate: {
                isIn: {
                    args: [Object.values(friendsStatus)],
                    msg: `Status must be one of: ${Object.values(friendsStatus)}`,
                },
            },
            allowNull: false,
        },
    },
    {
        sequelize: connection,
        modelName: 'friend',
    },
);

Friend.addHook('beforeCreate', (friend, options) => Friend.findOne({
    where: {
        [Op.or]: [
            {
                senderId: friend.senderId,
                receiverId: friend.receiverId,
            },
            {
                senderId: friend.receiverId,
                receiverId: friend.senderId,
            },
        ],
    },
}).then((result) => {
    if (result) {
        throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'friend already exists');
    }
}));

class User extends Model {}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [8, 100],
            },
        },
        googleId: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: roles.ROLE_USER,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            defaultValue: '',
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: `https://avatars.dicebear.com/api/male/${Math.random() * 100}.svg`,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize: connection,
        modelName: 'user',
    },
);

User.addHook('beforeCreate', async (user) => {
    if (user.password) {
        // eslint-disable-next-line no-param-reassign
        user.password = await bcryptjs.hash(
            user.password,
            await bcryptjs.genSalt(),
        );
    }
});

User.addHook('beforeUpdate', async (user, { fields }) => {
    if (fields.includes('password')) {
        // eslint-disable-next-line no-param-reassign
        user.password = await bcryptjs.hash(
            user.password,
            await bcryptjs.genSalt(),
        );
    }
});

class Interest extends Model {}

Interest.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize: connection,
        modelName: 'interest',
    },
);

class Token extends Model {}

Token.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: {
                    args: [Object.values(tokenTypes)],
                    msg: `type must be one of: ${Object.values(tokenTypes)}`,
                },
            },
        },
    },
    {
        sequelize: connection,
        modelName: 'token',
    },
);

// eslint-disable-next-line no-unused-vars

Message.belongsTo(User, {
    as: 'sender',
    foreignKey: 'senderId',
});

Message.belongsTo(User, {
    as: 'receiver',
    foreignKey: 'receiverId',
});

Friend.belongsTo(User, {
    as: 'sender',
    foreignKey: 'senderId',
});

Friend.belongsTo(User, {
    as: 'receiver',
    foreignKey: 'receiverId',
});

User.hasMany(Message, {
    as: 'invitations',
    foreignKey: 'receiverId',
});

User.belongsToMany(Interest, {
    through: 'UserInterest',
});

Interest.belongsToMany(User, {
    through: 'UserInterest',
});

User.hasMany(Token);
Token.belongsTo(User);

/**
 * want to keep a track of this relations
 * allow you to do
 * const result = await User.findByPk(16, {
 *      include: [
 *          {
 *              model: Message,
 *              as: 'messages',
 *          },
 *      ],
 *  });
 * but ça nous sert a rien
 * */

// User.hasMany(Message, {
//     as: 'messages',
//     foreignKey: 'senderId',
// });

// User.hasMany(Message, {
//     as: 'receivedMessages',
//     foreignKey: 'receiverId',
// });

connection
    .sync({
        force: true,
    })
    .then(() => {
        console.log('Database synced');
        connection.close();
    }).finally(() => {
        process.exit(0);
    });
