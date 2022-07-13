import { Friend } from '../model/postgres/index';
import * as friendService from '../services/friend.service';

export const getFriendsList = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const friendsList = await friendService.getFriendsList(userId);
        res.json(friendsList || []);
    } catch (err) {
        next(err);
    }
};

export const sendFriendInvitation = async (req, res, next) => {
    try {
        const { receiverId } = req.body;

        const pendingFriend = await friendService.sendFriendInvitation({
            senderId: req.user.id,
            receiverId,
        });
        res.json(pendingFriend);
    } catch (e) {
        next(e);
    }
};

export const acceptFriendInvitation = async (req, res, next) => {
    try {
        const { friendId } = req.params;
        const friend = await friendService.acceptFriendInvitation(friendId);
        res.json(friend);
    } catch (e) {
        next(e);
    }
};

export const deleteFriend = async (req, res, next) => {
    try {
        const { friendId } = req.params;

        const friend = await Friend.destroy({
            where: {
                id: friendId,
            },
        });
        res.json(friend);
    } catch (e) {
        next(e);
    }
};
