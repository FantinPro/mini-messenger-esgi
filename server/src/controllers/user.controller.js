/* eslint-disable no-param-reassign */
import { StatusCodes } from 'http-status-codes';
import { Op } from 'sequelize';
import bcryptjs from 'bcryptjs';
import { Interest, Token, User } from '../model/postgres/index';
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

export const updateProfile = async (req, res, next) => {
    try {
        const { username, interests } = req.body;

        const user = await User.findOne({
            where: {
                id: req.user.id,
            },
            include: [
                {
                    model: Interest,
                    as: 'interests',
                },
            ],
        }).then(async (u) => {
            if (!u) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
            }
            u.username = username;
            const interestsRecords = await Interest.findAll({
                where: {
                    id: {
                        [Op.in]: interests.map((i) => i.id),
                    },
                },
            });
            await u.setInterests(interestsRecords);
            return u.save();
        }).then((u) => User.findByPk(u.id, {
            include: [
                {
                    model: Interest,
                    as: 'interests',
                },
            ],
        }));

        res.json(user);
    } catch (err) {
        next(err);
    }
};

export const updatePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;

        // check old one
        const user = await User.findOne({
            where: {
                id: req.user.id,
            },
        });

        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
        }
        const isPasswordMatch = await bcryptjs.compare(oldPassword, user?.password);

        if (!isPasswordMatch) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid old password');
        }

        const newUser = await User.update({
            password: newPassword,
        }, {
            where: {
                id: req.user.id,
            },
            returning: true,
            individualHooks: true,
        });

        res.json(newUser);
    } catch (err) {
        next(err);
    }
};
