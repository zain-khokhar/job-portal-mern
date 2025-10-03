// routes/jobRoutes.js
import express from 'express';
import { createJob, getJobs, getJobById, updateJob, deleteJob} from '../controllers/jobController.js';

const router = express.Router();

// POST /api/jobs → create new job
router.post('/', createJob);

// GET /api/jobs → get all jobs
router.get('/', getJobs);

// GET /api/jobs/:id → get a single job by ID
router.get('/:id', getJobById);

// PUT /api/jobs/:id → update a job by ID
router.put('/:id', updateJob);

// DELETE /api/jobs/:id → delete a job by ID
router.delete('/:id', deleteJob);

export default router;
