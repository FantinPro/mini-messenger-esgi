import { Op } from 'sequelize';
import { Friend, User } from '../model/postgres/index';
import { friendsStatus } from '../utils/Helpers';

export const getFriendsList = async (userId, status = [friendsStatus.ACTIVE]) => Friend.findAll({
    where: {
        [Op.or]: [
            {
                senderId: userId,
            },
            {
                receiverId: userId,
            },
        ],
        [Op.or]: status.map((s) => ({
            status: s,
        })),
    },
    include: [
        {
            model: User,
            as: 'sender',
            attributes: ['id', 'email'],
        },
        {
            model: User,
            as: 'receiver',
            attributes: ['id', 'email'],
        },
    ],
});

export const sendFriendInvitation = ({ senderId, receiverId }) => Friend.create({
    senderId,
    receiverId,
    status: friendsStatus.PENDING,
});

export const acceptFriendInvitation = (friendId) => Friend.update(
    {
        status: friendsStatus.ACTIVE,
    },
    {
        where: {
            id: friendId,
        },
        returning: true,
    },
    // because update return nb of rows updated and the updated rows
).then((res) => res[1][0]);

export const blockFriend = (friendId) => Friend.update(
    {
        status: friendsStatus.BLOCKED,
    },
    {
        where: {
            id: friendId,
        },
        returning: true,
    },
).then((res) => res[1][0]);

export const deleteFriend = (friendId) => Friend.destroy({
    where: {
        id: friendId,
    },
});