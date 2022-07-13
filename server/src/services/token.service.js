import jwt from 'jsonwebtoken';
import config from '../config/config';

export const getAccessTokens = async (user) => {
    const token = jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: '1y' });
    return token;
};