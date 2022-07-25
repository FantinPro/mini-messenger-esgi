import { StatusCodes } from 'http-status-codes';
import * as userService from '../services/user.service';
import * as tokenService from '../services/token.service';
import config from '../config/config';
import { Token, User } from '../model/postgres/index';
import { sendRegistrationMail, sendResetPassword } from '../utils/Mailer';
import { tokenTypes } from '../utils/Helpers';
import { ApiError } from '../utils/ApiError';

export const register = async (req, res, next) => {
    try {
        const user = await userService.createUser(req.body);
        // generate token with Math random
        const emailToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        await Token.create({
            userId: user.id,
            token: emailToken,
            type: tokenTypes.CONFIRM_EMAIL,
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
        // find token include user
        const tokenRecord = await Token.findOne({
            where: {
                token,
                type: tokenTypes.CONFIRM_EMAIL,
            },
            include: [
                {
                    model: User,
                    as: 'user',
                },
            ],
        });

        // delete token
        await tokenRecord.destroy();

        await User.update(
            {
                active: true,
            },
            {
                where: { email: tokenRecord?.user?.email },
                returning: true,
                individualHooks: true,
            },
        );
        res.redirect(301, config.frontBaseUrl);
    } catch (err) {
        next(err);
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({
            where: {
                email,
            },
        });

        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Invalid email');
        }

        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        await Token.create({
            userId: user.id,
            token,
            type: tokenTypes.RESET_PASSWORD,
        });
        await sendResetPassword(email, token);
        res.json({ id: user.id });
    } catch (err) {
        next(err);
    }
};
