import express from 'express';
import { 
    submitApplication, 
    getAllApplications, 
    getUserApplications,
    acceptApplication,
    rejectApplication
} from '../controllers/jobApplicationController.js';

const router = express.Router();

// Submit application
router.post('/submit', submitApplication);

// Get user-specific applications
router.get('/user/:userId', getUserApplications);

// Get all applications (admin)
router.get('/', getAllApplications);

// Accept application
router.put('/accept/:id', acceptApplication);

// Reject application
router.delete('/reject/:id', rejectApplication);

export default router;