import express from 'express';
import * as analyticController from '../controllers/analytic.controller';
import { authorized } from '../middlewares/auth';

const router = express.Router();

router.get('/stats', authorized('ROLE_ADMIN'), analyticController.stats);
router.post('/addNewSession', authorized(), analyticController.addNewSession);
router.post('/updateSession', authorized(), analyticController.updateSession);
router.post('/getSessions', authorized(), analyticController.getSessions);

export default router;
