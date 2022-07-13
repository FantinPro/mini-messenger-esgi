import { StatusCodes } from 'http-status-codes';
import { Message } from '../model/postgres/index';
import { ApiError } from '../utils/ApiError';

export const isMyMessage = async (req, res, next) => {
    const { id } = req.user;
    const { messageId } = req.params;
    const message = await Message.findByPk(messageId);

    if (message.senderId !== id) {
        next(new ApiError(StatusCodes.UNAUTHORIZED, 'Cant edit a message that is not yours'));
    }
    next();
};
