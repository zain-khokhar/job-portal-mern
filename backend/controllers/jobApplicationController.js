import Application from '../models/Application.js';

// Submit job application
export const submitApplication = async (req, res) => {
    try {
        const { jobId, coverLetter } = req.body;

        const application = new Application({
            jobId,
            coverLetter
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

// Get all applications (simple get request without any filters)
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