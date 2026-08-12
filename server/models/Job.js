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
            default: 0
        },

        employmentType: {
            type: String,
            enum: ["Full-Time", "Part-Time", "Internship", "Contract"],
            default: "Full-Time"
        },

        skills: {
            type: [String],
            default: []
        },

        status: {
            type: String,
            enum: ["draft", "published", "closed"],
            default: "draft"
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