import express from 'express';
import * as logController from '../controllers/log.controller';
import { authorized } from '../middlewares/auth';

const router = express.Router();

router.post('/', authorized(), logController.create);

export default router;
