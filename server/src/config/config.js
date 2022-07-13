export default {
    jwtSecret: process.env.JWT_SECRET,
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackUrl: process.env.GOOGLE_CALLBACK_URL,
    },
    frontBaseUrl: process.env.FRONT_BASE_URL || 'http://localhost:8001',
    mongodb: {
        dbname: process.env.MONGODB_DBNAME,
        host: process.env.MONGODB_HOST,
        port: process.env.MONGODB_PORT,
        login: process.env.MONGODB_LOGIN,
        password: process.env.MONGODB_PASSWORD,
        uri: process.env.MONGODB_URI,
    },
    expressPort: process.env.SERVER_PORT || 9000,
    env: process.env.NODE_ENV || 'development',
};
