import express from 'express';
import { signup, signin, adminSignin, verifyEmail, resendVerificationEmail, forgotPassword, resetPassword, verifyResetToken } from '../controllers/authController.js';

const router = express.Router();

// Simple signup route
router.post('/signup', signup);

// Simple signin route
router.post('/signin', signin);

// Admin signin route
router.post('/admin-signin', adminSignin);

// Email verification routes
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-reset-token', verifyResetToken);

export default router;
