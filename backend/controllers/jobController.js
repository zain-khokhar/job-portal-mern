// controllers/jobController.js
import Job from '../models/newJobs.js';

// Create a new job (Admin only)
export const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      jobType,
      salaryRange,
      experience,
      deadline,
      description,
      requirements
    } = req.body;

    // Basic validation
    if (!title || !company || !location || !jobType) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    // Get admin user from request (set by auth middleware)
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const newJob = new Job({
      title,
      company,
      location,
      jobType,
      salaryRange,
      experience,
      deadline,
      description,
      requirements,
      createdBy: req.user._id // Link job to admin who created it
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all jobs (Public - for job seekers)
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('createdBy', 'name email companyName').sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get admin's own jobs (Admin only)
export const getAdminJobs = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Get only jobs created by this admin
    const jobs = await Job.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching admin jobs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single job by ID
export const getJobById = async (req, res) => {
  const jobId = req.params.id;

  try {
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error('Error fetching job by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Update a job by ID (Admin only - can only update their own jobs)
export const updateJob = async (req, res) => {
  const jobId = req.params.id;
  const {
    title,
    company,
    location,
    jobType,
    salaryRange,
    experience,
    deadline,
    description,
    requirements
  } = req.body;

  try {
    // Basic validation
    if (!title || !company || !location || !jobType) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    // Check if job exists and belongs to this admin
    const existingJob = await Job.findById(jobId);
    if (!existingJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Verify the job belongs to this admin
    if (existingJob.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only update jobs you created' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        title,
        company,
        location,
        jobType,
        salaryRange,
        experience,
        deadline,
        description,
        requirements
      },
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    return res.status(200).json(updatedJob);
  } catch (error) {
    console.error('Error updating job:', error);
    return res.status(500).json({ message: 'Server error while updating job' });
  }
};

// Delete a job by ID (Admin only - can only delete their own jobs)
export const deleteJob = async (req, res) => {
  const jobId = req.params.id;

  try {
    // Check if job exists and belongs to this admin
    const existingJob = await Job.findById(jobId);
    if (!existingJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Verify the job belongs to this admin
    if (existingJob.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete jobs you created' });
    }

    const deletedJob = await Job.findByIdAndDelete(jobId);

    if (!deletedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    return res.status(200).json({ message: 'Job deleted successfully', job: deletedJob });
  } catch (error) {
    console.error('Error deleting job:', error);
    return res.status(500).json({ message: 'Server error while deleting job' });
  }
};
