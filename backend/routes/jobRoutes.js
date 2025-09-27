// routes/jobRoutes.js
import express from 'express';
import { createJob, getJobs , deleteJob} from '../controllers/jobController.js';

const router = express.Router();

// POST /api/jobs → create new job
router.post('/', createJob);

// GET /api/jobs → get all jobs
router.get('/', getJobs);

// DELETE /api/jobs/:id → delete a job by ID
router.delete('/:id', deleteJob);

export default router;
