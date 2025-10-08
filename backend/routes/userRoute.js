import express from 'express';
import { signup, signin, verifyEmail, resendVerificationEmail, forgotPassword, resetPassword, verifyResetToken } from '../controllers/authController.js';

const router = express.Router();

// Signup route (for all users including admins)
router.post('/signup', signup);

// Signin route (for all users including admins)
router.post('/signin', signin);

// Email verification routes
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-reset-token', verifyResetToken);

export default router;
