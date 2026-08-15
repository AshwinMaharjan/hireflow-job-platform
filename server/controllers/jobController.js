const Job = require("../models/Job");
const Application = require("../models/Application"); 



const createJob = async (req, res) => {
    try {
        const {
            title,
            company,
            location,
            description,
            salary,
            employmentType,
            experienceLevel,
            skills,
            deadline
        } = req.body;

    
        
        if (!title || !company || !location || !description || !deadline || !experienceLevel) {
            return res.status(400).json({
                message: "Please fill all required fields"
            });
        }

     
        
        if (salary !== undefined && salary !== null && salary !== "") {
            const salaryNum = Number(salary);

            if (isNaN(salaryNum) || salaryNum < 0 || salaryNum > 150000) {
                return res.status(400).json({
                    message: "Salary must be between 0 and 1,50,000"
                });
            }
        }

        const job = await Job.create({
            title,
            company,
            location,
            description,
            salary,
            employmentType,
            experienceLevel,
            skills,
            deadline,
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



const getAllJobs = async (req, res) => {
    try {
        const { search, location, employmentType } = req.query;

        const filter = { status: "Published" };

        if (search) {
            filter.title = { $regex: search, $options: "i" };
        }

        if (location) {
            filter.location = { $regex: location, $options: "i" };
        }

        if (employmentType) {
            filter.employmentType = employmentType;
        }

        const jobs = await Job.find(filter).populate(
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



const updateJobStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const validStatuses = ["Draft", "Published", "Closed"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

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

        job.status = status;
        await job.save();

        res.status(200).json({
            message: "Job status updated successfully",
            job
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

const getMyJobs = async (req, res) => {
    try {

        const jobs = await Job.find({
            recruiter: req.user.userId
        }).populate("recruiter", "name email");

        res.status(200).json(jobs);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

module.exports = {
    createJob,
    getAllJobs,
    getMyJobs,
    getJobById,
    updateJob,
    updateJobStatus,
    deleteJob
};