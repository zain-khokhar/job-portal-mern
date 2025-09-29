import Application from '../models/Application.js';

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

// Get all applications (admin only)
export const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find().populate('jobId');
        
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