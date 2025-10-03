import express from 'express';
import { signup, signin, adminSignin, verifyEmail, resendVerificationEmail } from '../controllers/authController.js';

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

export default router;
