import express from 'express';
import * as interestController from '../controllers/interest.controller';

const router = express.Router();

router.get('/', interestController.getAll);

export default router;
