import { Op } from 'sequelize';
import { Message, User } from '../model/postgres/index';

export const createMessage = (message) => Message.create(message);

export const getMessagesFromUsers = (senderId, receiverId) => Message.findAll({
    where: {
        [Op.or]: [
            {
                senderId,
                receiverId,
            },
            {
                senderId: receiverId,
                receiverId: senderId,
            },
        ],
    },
    include: [
        {
            model: User,
            as: 'sender',
            attributes: ['email'],
        },
        {
            model: User,
            as: 'receiver',
            attributes: ['email'],
        },
    ],
    order: [['createdAt', 'ASC']],
});

export const updateMessage = (messageId, message) => Message.update(message, {
    where: {
        id: messageId,
    },
    returning: true,
});
