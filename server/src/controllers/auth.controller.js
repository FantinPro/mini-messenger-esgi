import jwt from 'jsonwebtoken';
import * as userService from '../services/user.service';
import * as tokenService from '../services/token.service';
import config from '../config/config';
import { User } from '../model/postgres/index';
import { sendRegistrationMail } from '../utils/Mailer';

export const register = async (req, res, next) => {
    try {
        const user = await userService.createUser(req.body);
        const emailToken = jwt.sign({ email: user.email }, config.jwtSecret, {
            expiresIn: '1y',
            algorithm: 'HS512',
        });
        await sendRegistrationMail(req.body.email, emailToken);
        res.json({ id: user.id });
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await userService.loginUserWithEmailAndPassword(email, password);
        const token = await tokenService.getAccessTokens(user);
        res.send({ user, token });
    } catch (err) {
        next(err);
    }
};

export const validate = async (req, res, next) => {
    try {
        const { token } = req.query;
        const { email } = jwt.verify(token, process.env.JWT_SECRET);
        await User.update(
            {
                validate: true,
            },
            {
                where: { email },
                returning: true,
                individualHooks: true,
            },
        );
        res.json({});
    } catch (err) {
        next(err);
    }
};
