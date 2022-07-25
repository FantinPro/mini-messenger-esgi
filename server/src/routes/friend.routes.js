import express from 'express';
import * as friendController from '../controllers/friend.controller';
import { authorized } from '../middlewares/auth';

const router = express.Router();

router.get('/:userId', authorized(), friendController.getFriendsList);
router.post('/add', authorized(), friendController.sendFriendInvitation);
router.put('/:friendId', authorized(), friendController.acceptFriendInvitation);
router.delete('/:friendId', authorized(), friendController.deleteFriend);
router.get('/:friendId/chat', authorized(), friendController.getFriendChat);

export default router;
