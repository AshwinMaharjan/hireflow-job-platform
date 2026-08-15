const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        company: {
            type: String,
            required: true
        },

        location: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        salary: {
            type: Number,
    default: 0,
    min: [0, "Salary cannot be below 0"],
    max: [150000, "Salary cannot exceed 1,50,000"]
        },

        employmentType: {
            type: String,
            enum: ["Full-Time", "Part-Time", "Internship", "Contract", "Remote"],
            default: "Full-Time"
        },

        experienceLevel: {
            type: String,
            enum: ["Fresher", "1 Year", "2 Years", "3 Years", "4+ Years"],
            required: true
        },

        skills: {
            type: [String],
            default: []
        },

        status: {
            type: String,
            enum: ["Draft", "Published", "Closed"],
            default: "Draft"
        },

        deadline: {
            type: Date,
            required: true
        },

        recruiter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }

    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Job", jobSchema);