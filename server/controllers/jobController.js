const Job = require("../models/Job");

// Create Job
const createJob = async (req, res) => {
    try {
        const {
            title,
            company,
            location,
            description,
            salary,
            employmentType,
            skills
        } = req.body;

        // Validate required fields
        if (!title || !company || !location || !description) {
            return res.status(400).json({
                message: "Please fill all required fields"
            });
        }

        const job = await Job.create({
            title,
            company,
            location,
            description,
            salary,
            employmentType,
            skills,
            recruiter: req.user.userId
        });

        res.status(201).json({
            message: "Job created successfully",
            job
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
// Get all jobs
const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate(
            "recruiter",
            "name email"
        );

        res.status(200).json(jobs);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
// Get single job
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate("recruiter", "name email");

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.status(200).json(job);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Update Job
const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        // Ownership check
        if (job.recruiter.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You are not allowed to update this job"
            });
        }

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            message: "Job updated successfully",
            job: updatedJob
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Delete Job
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        // Ownership check
        if (job.recruiter.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You are not allowed to delete this job"
            });
        }

        await job.deleteOne();

        res.status(200).json({
            message: "Job deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob
};