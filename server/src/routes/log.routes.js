import express from 'express';
import * as logController from '../controllers/log.controller';
import { authorized } from '../middlewares/auth';

const router = express.Router();

router.post('/', authorized(), logController.create);
router.post('/search', authorized('ROLE_ADMIN'), logController.search);

export default router;
