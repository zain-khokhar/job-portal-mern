import express from 'express';
import { 
    submitApplication, 
    getAllApplications, 
    getUserApplications,
    acceptApplication,
    rejectApplication,
    getJobApplications
} from '../controllers/jobApplicationController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
// Submit application
router.post('/submit', submitApplication);

// Get user-specific applications
router.get('/user/:userId', getUserApplications);

// Protected admin routes
// Get all applications for admin's jobs
router.get('/', verifyToken, isAdmin, getAllApplications);

// Get applications for a specific job
router.get('/job/:jobId', verifyToken, isAdmin, getJobApplications);

// Accept application
router.put('/accept/:id', verifyToken, isAdmin, acceptApplication);

// Reject and delete application
router.delete('/reject/:id', verifyToken, isAdmin, rejectApplication);

export default router;