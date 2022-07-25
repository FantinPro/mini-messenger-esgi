import { StatusCodes } from 'http-status-codes';
import { Token, User } from '../model/postgres/index';
import { ApiError } from '../utils/ApiError';
import { tokenTypes } from '../utils/Helpers';

export const getUserByToken = async (req, res, next) => {
    try {
        res.json(req.user);
    } catch (err) {
        next(err);
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;

        const tokenRecord = await Token.findOne({
            where: {
                token,
                type: tokenTypes.RESET_PASSWORD,
            },
            include: [
                {
                    model: User,
                    as: 'user',
                },
            ],
        });

        if (!tokenRecord) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token');
        }

        // delete token
        await tokenRecord.destroy();

        await User.update(
            {
                password,
            },
            {
                where: { email: tokenRecord?.user?.email },
                returning: true,
                individualHooks: true,
            },
        );

        res.json({
            message: 'Password has been changed',
        });
    } catch (err) {
        next(err);
    }
};
