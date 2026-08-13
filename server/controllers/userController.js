const User = require("../models/User");
const Job = require("../models/Job");


// Get logged-in user's own profile
const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update logged-in user's own profile
const updateMyProfile = async (req, res) => {
    try {
        const { name, skills } = req.body;

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (name !== undefined) user.name = name;
        if (skills !== undefined) user.skills = skills;

        await user.save();

        const updatedUser = await User.findById(user._id).select("-password");

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Toggle save/unsave a job
const toggleSaveJob = async (req, res) => {
    try {
        const { jobId } = req.params;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        const user = await User.findById(req.user.userId);

        const alreadySaved = user.savedJobs.some(
            (id) => id.toString() === jobId
        );

        if (alreadySaved) {
            user.savedJobs = user.savedJobs.filter(
                (id) => id.toString() !== jobId
            );
        } else {
            user.savedJobs.push(jobId);
        }

        await user.save();

        res.status(200).json({
            message: alreadySaved ? "Job unsaved" : "Job saved",
            saved: !alreadySaved,
            savedJobs: user.savedJobs
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all saved jobs (full job details)
const getSavedJobs = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).populate("savedJobs");
        res.status(200).json(user.savedJobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMyProfile, updateMyProfile, toggleSaveJob, getSavedJobs };