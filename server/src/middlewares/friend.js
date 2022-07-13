import { StatusCodes } from 'http-status-codes';
import { Op } from 'sequelize';
import { Friend } from '../model/postgres/index';
import { ApiError } from '../utils/ApiError';

export const areFriends = async (req, res, next) => {
    const { receiverId } = req.body;
    const { id } = req.user;

    const friend = await Friend.findOne({
        where: {
            [Op.or]: [
                {
                    senderId: id,
                    receiverId,
                },
                {
                    senderId: receiverId,
                    receiverId: id,
                },
            ],
        },
    });

    if (!friend) {
        next(new ApiError(StatusCodes.UNAUTHORIZED, 'You are not friends with this user'));
    }

    next();
};
