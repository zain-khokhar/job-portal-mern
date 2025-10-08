import Application from '../models/Application.js';

// Accept application (admin only - only for their own jobs)
export const acceptApplication = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const application = await Application.findById(id).populate('jobId');
        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Verify the job belongs to this admin
        if (application.jobId.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only manage applications for jobs you created'
            });
        }
        
        application.status = 'accepted';
        await application.save();
        
        res.status(200).json({
            success: true,
            message: 'Application accepted successfully',
            application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error accepting application',
            error: error.message
        });
    }
};

// Reject and delete application (admin only - only for their own jobs)
export const rejectApplication = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const application = await Application.findById(id).populate('jobId');
        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Verify the job belongs to this admin
        if (application.jobId.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only manage applications for jobs you created'
            });
        }

        await Application.findByIdAndDelete(id);
        
        res.status(200).json({
            success: true,
            message: 'Application rejected and deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error rejecting application',
            error: error.message
        });
    }
};

// Submit job application
export const submitApplication = async (req, res) => {
    try {
        const { jobId, coverLetter, resumeUrl, userId } = req.body;

        if (!resumeUrl) {
            return res.status(400).json({
                success: false,
                message: 'Resume URL is required'
            });
        }

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        // Check if user has already applied to this job
        const existingApplication = await Application.findOne({
            userId: userId,
            jobId: jobId
        });

        if (existingApplication) {
            return res.status(409).json({
                success: false,
                message: 'You have already applied to this job'
            });
        }

        const application = new Application({
            jobId,
            userId,
            coverLetter,
            resumeUrl
        });

        await application.save();

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            application
        });

    } catch (error) {
        // Handle duplicate key error specifically
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'You have already applied to this job'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error submitting application',
            error: error.message
        });
    }
};

// Get user-specific applications
export const getUserApplications = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const applications = await Application.find({ userId }).populate('jobId');
        
        res.status(200).json({
            success: true,
            applications
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message
        });
    }
};

// Get all applications (admin only - only for their own jobs)
export const getAllApplications = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Get all jobs created by this admin
        const Job = (await import('../models/newJobs.js')).default;
        const adminJobs = await Job.find({ createdBy: req.user._id }).select('_id');
        const adminJobIds = adminJobs.map(job => job._id);

        // Get applications only for this admin's jobs
        const applications = await Application.find({ 
            jobId: { $in: adminJobIds } 
        }).populate('jobId');
        
        res.status(200).json({
            success: true,
            applications
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message
        });
    }
};

// Get applications for a specific job (admin only - only for their own jobs)
export const getJobApplications = async (req, res) => {
    try {
        const { jobId } = req.params;

        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Verify the job belongs to this admin
        const Job = (await import('../models/newJobs.js')).default;
        const job = await Job.findById(jobId);
        
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        if (job.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only view applications for jobs you created'
            });
        }

        const applications = await Application.find({ jobId }).populate('jobId');
        
        res.status(200).json({
            success: true,
            applications
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message
        });
    }
};