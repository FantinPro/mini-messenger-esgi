import express from 'express';
import * as usersController from '../controllers/user.controller';
import { authorized } from '../middlewares/auth';

const router = express.Router();

router.get('/token', authorized(), usersController.getUserByToken);

export default router;
