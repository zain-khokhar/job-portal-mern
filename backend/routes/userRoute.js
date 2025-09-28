import express from 'express';
import { signup, signin } from '../controllers/authController.js';

const router = express.Router();

// Simple signup route
router.post('/signup', signup);

// Simple signin route
router.post('/signin', signin);

export default router;
