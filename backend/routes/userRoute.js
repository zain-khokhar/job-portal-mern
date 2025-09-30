import express from 'express';
import { signup, signin, adminSignin } from '../controllers/authController.js';

const router = express.Router();

// Simple signup route
router.post('/signup', signup);

// Simple signin route
router.post('/signin', signin);

// Admin signin route
router.post('/admin-signin', adminSignin);

export default router;
