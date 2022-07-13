import express from 'express';
import * as friendController from '../controllers/friend.controller';
import { authorized } from '../middlewares/auth';

const router = express.Router();

router.post('/', authorized(), friendController.sendFriendInvitation);
router.put('/:friendId', authorized(), friendController.acceptFriendInvitation);
router.delete('/:friendId', authorized(), friendController.deleteFriend);
router.get('/users/:userId', authorized(), friendController.getFriendsList);

export default router;
