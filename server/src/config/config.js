export default {
    jwtSecret: process.env.JWT_SECRET || 'gX$*T.VUs-AYUP6_WSH_ALORS_LnU?_2,O3z0^]ffMnlhVmC^ynLYmW[pQFtQ:/E1mAV7+',
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID || '503716919924-foqueh3q6nfcccsnk7uf9nhsr3b2r43n.apps.googleusercontent.com',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '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',
        callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:9000/auth/google/callback',
    },
    frontBaseUrl: process.env.FRONT_BASE_URL || 'http://localhost:8001',
    backBaseUrl: process.env.BACK_BASE_URL || 'http://localhost:9000',
    mongodb: {
        dbname: process.env.MONGODB_DBNAME,
        host: process.env.MONGODB_HOST,
        port: process.env.MONGODB_PORT,
        login: process.env.MONGODB_LOGIN,
        password: process.env.MONGODB_PASSWORD,
        uri: process.env.MONGODB_URI || 'mongodb://mongodb:27017/mini-messenger',
    },
    expressPort: process.env.SERVER_PORT || 9000,
    env: process.env.NODE_ENV || 'development',
    mailerKey: process.env.MAILER_KEY || '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',
};
