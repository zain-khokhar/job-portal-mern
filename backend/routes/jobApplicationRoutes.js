import express from 'express';
import { submitApplication, getAllApplications } from '../controllers/jobApplicationController.js';

const router = express.Router();

// Submit application
router.post('/submit', submitApplication);

// Get all applications
router.get('/', getAllApplications);

export default router;