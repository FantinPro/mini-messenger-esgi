import express from 'express';
import * as analyticController from '../controllers/analytic.controller';
import { authorized } from '../middlewares/auth';

const router = express.Router();

router.get('/stats', authorized('ROLE_ADMIN'), analyticController.stats);

export default router;
