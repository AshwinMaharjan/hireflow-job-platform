const Application = require("../models/Application");
const Job = require("../models/Job");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const Notification = require("../models/Notification");

const { getIO } = require("../socket");

// Candidate applies to a job
const applyForJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    // Check if job exists
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Block applications after the deadline
    if (job.deadline && new Date() > new Date(job.deadline)) {
      return res.status(400).json({
        message: "The application deadline for this job has passed.",
      });
    }

    // Prevent duplicate application
    const existingApplication = await Application.findOne({
      job: jobId,
      candidate: req.user.userId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job.",
      });
    }

    let resumeUrl = "";

    if (req.file) {
      const uploadFromBuffer = () => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: "raw",
              folder: "hireflow-resumes",
              public_id: `${Date.now()}-${req.user.userId}.pdf`,
              format: "pdf",
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            },
          );

          streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
        });
      };

      const uploadedFile = await uploadFromBuffer();

      resumeUrl = uploadedFile.secure_url;
    }

    const application = await Application.create({
      job: jobId,
      candidate: req.user.userId,
      coverLetter: req.body.coverLetter || "",
      resumeUrl,
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Recruiter views applicants for a job
const getApplicantsByJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Ownership check
    if (job.recruiter.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not allowed to view these applicants",
      });
    }

    const applications = await Application.find({
      job: req.params.jobId,
    })
      .populate("candidate", "name email skills")
      .populate("job", "title company");

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Candidate views their applications
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      candidate: req.user.userId,
    })
      .populate("job", "title company location salary employmentType")
      .populate("candidate", "name email");

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Recruiter updates application status
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    const validStatuses = ["Pending", "Reviewed", "Accepted", "Rejected"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const application = await Application.findById(req.params.id).populate(
      "job",
    );

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    // Check job ownership
    if (application.job.recruiter.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not allowed to update this application",
      });
    }

    application.status = status;

    await application.save();

    if (
      status === "Accepted" ||
      status === "Rejected" ||
      status === "Reviewed"
    ) {
      const statusMeta = {
        Accepted: {
          title: "Application Accepted",
          message: `Your application for ${application.job.title} at ${application.job.company} has been accepted.`,
          type: "APPLICATION_APPROVED",
        },
        Rejected: {
          title: "Application Rejected",
          message: `Your application for ${application.job.title} at ${application.job.company} has been rejected.`,
          type: "APPLICATION_REJECTED",
        },
        Reviewed: {
          title: "Application Reviewed",
          message: `Your application for ${application.job.title} at ${application.job.company} has been reviewed.`,
          type: "APPLICATION_REVIEWED",
        },
      };

      const { title, message, type } = statusMeta[status];

      const notification = await Notification.create({
        recipient: application.candidate,
        sender: req.user.userId,
        title,
        message,
        type,
        relatedJob: application.job._id,
        relatedApplication: application._id,
      });

      const io = getIO();

      io.to(application.candidate.toString()).emit(
        "new_notification",
        notification,
      );
    }

    res.status(200).json({
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  applyForJob,
  getApplicantsByJob,
  getMyApplications,
  updateApplicationStatus,
};