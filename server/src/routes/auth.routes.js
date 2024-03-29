import express from 'express';
import * as authController from '../controllers/auth.controller';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/validate', authController.validate);
router.post('/reset-password', authController.resetPassword);

export default router;
