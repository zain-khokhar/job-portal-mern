import express from 'express';
import { 
    submitApplication, 
    getAllApplications, 
    getUserApplications,
    acceptApplication,
    rejectApplication
} from '../controllers/jobApplicationController.js';
import protectAdminRoutes from '../middleware/protectAdmin.js';

const router = express.Router();

// Submit application (public)
router.post('/submit', submitApplication);

// Get user-specific applications (public)
router.get('/user/:userId', getUserApplications);

// Protected admin routes
router.get('/', protectAdminRoutes, getAllApplications);
router.put('/accept/:id', protectAdminRoutes, acceptApplication);
router.delete('/reject/:id', protectAdminRoutes, rejectApplication);

export default router;