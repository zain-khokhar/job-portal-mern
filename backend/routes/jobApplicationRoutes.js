import express from 'express';
import { submitApplication, getAllApplications, getUserApplications } from '../controllers/jobApplicationController.js';

const router = express.Router();

// Submit application
router.post('/submit', submitApplication);

// Get user-specific applications
router.get('/user/:userId', getUserApplications);

// Get all applications (admin)
router.get('/', getAllApplications);

export default router;